import { Engine, Sprite, Timer, Vector, vec } from "excalibur";
import { AutumnTree } from "@/actors/objects/autumn-tree";
import { TreeItemConfig, TreeItemType } from "@/actors/objects/tree-item";
import { HighlightSprite } from "@/types/highlight-sprite";

export const FRUIT_POINTS: number[] = [
  1,2,4,1,2,4,1,1,1,2,
  4,1,1,2,1,4,2,1,4,2
];

interface TreeItemsManagerConfig {
  tree: AutumnTree;

  // lists of items (sprites already loaded)
  fruits: Sprite[];
  rottenFruits: HighlightSprite[];
  trash: HighlightSprite[];
  powerUps: HighlightSprite[];

  engine: Engine;
}

export class TreeItemsManager {
  private engine: Engine;
  private tree: AutumnTree;

  private fruits: Sprite[];
  private rotten: HighlightSprite[];
  private trash: HighlightSprite[];
  private powerUps: HighlightSprite[];

  private running = false;

  private singleTimer: Timer | null = null;
  private burstTimer: Timer | null = null;

  // Config defaults
  private fallSpeed = 30;
  private maxSpeed = 500;

  constructor(cfg: TreeItemsManagerConfig) {
    this.engine = cfg.engine;
    this.tree = cfg.tree;

    this.fruits = cfg.fruits;
    this.rotten = cfg.rottenFruits;
    this.trash = cfg.trash;
    this.powerUps = cfg.powerUps;
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  start() {
    if (this.running) return;
    this.running = true;

    this.scheduleNextSingle();
    this.scheduleNextBurst(5000); // initial delay 5 sec
  }

  stop() {
    this.running = false;

    if (this.singleTimer) this.singleTimer.cancel();
    if (this.burstTimer) this.burstTimer.cancel();
  }

  // ============================================================
  // TIMELINES
  // ============================================================

  private scheduleNextSingle(delayMs?: number) {
    if (!this.running) return;

    const nextDelay = delayMs ?? this.randomBetween(1000, 3000); // 1–3s

    this.engine.clock.schedule(() => {
      if (!this.running) return;

      this.throwSingleItem();
      this.scheduleNextSingle(); // reschedule
    }, nextDelay);
  }

  private scheduleNextBurst(delayMs?: number) {
    if (!this.running) return;

    const nextDelay = delayMs ?? this.randomBetween(4000, 8000); // 4–8s

    this.engine.clock.schedule(() => {
      if (!this.running) return;

      this.throwBurst();
      this.scheduleNextBurst(); // reschedule
    }, nextDelay);
  }

  // ============================================================
  // SINGLE THROW
  // ============================================================
  private throwSingleItem() {
    // 1) pick branch
    const branchIndex = this.randomBranchIndex();

    // 2) pick item
    const itemCfg = this.getRandomItemConfig();

    // 3) dropMode
    const dropMode: "fall" | "arc" = Math.random() < 0.3 ? "fall" : "arc";

    // 4) arc direction (if arc)
    const arcVel = dropMode === "arc" ? this.randomArcVelocity() : undefined;

    this.tree.shakeBranch(branchIndex);

    this.tree.spawnItemFromBranch(branchIndex, {
      ...itemCfg,
      dropMode,
      arcInitialVelocity: arcVel,
      fallSpeed: this.fallSpeed,
      maxSpeed: this.maxSpeed,
    });
  }

  // ============================================================
  // BURST THROW (3 items)
  // ============================================================
  private async throwBurst() {
    const branchIndex = this.randomBranchIndex();
    this.tree.shakeBranch(branchIndex);

    // Pre-pick three distinct arc directions
    const arc1 = this.randomArcVelocity();
    let arc2 = this.randomArcVelocity();
    let arc3 = this.randomArcVelocity();

    // enforce that all 3 arc directions differ meaningfully
    const differentEnough = (a: Vector, b: Vector) =>
      Math.abs(a.x - b.x) > 40;

    while (!differentEnough(arc1, arc2))
      arc2 = this.randomArcVelocity();
    while (!differentEnough(arc2, arc3) || !differentEnough(arc1, arc3))
      arc3 = this.randomArcVelocity();

    // For burst: fruits / rotten / trash can repeat, powerups cannot
    const items: TreeItemConfig[] = [];

    for (let i = 0; i < 3; i++) {
      items.push(this.getRandomItemConfig({ allowPowerUp: i === 0 }));
    }

    const arcList = [arc1, arc2, arc3];

    for (let i = 0; i < 3; i++) {
      const cfg = items[i];
      const arcVel = arcList[i];

      this.tree.spawnItemFromBranch(branchIndex, {
        ...cfg,
        dropMode: "arc",
        arcInitialVelocity: arcVel,
        fallSpeed: this.fallSpeed,
        maxSpeed: this.maxSpeed,
      });

      // spacing
      await this.delay(500);
    }
  }

  // ============================================================
  // RANDOM SELECTION HELPERS
  // ============================================================

  private randomBranchIndex() {
    const branches = this.tree.getBranches();
    return Math.floor(Math.random() * branches.length);
  }

  private getRandomItemConfig(opts?: { allowPowerUp?: boolean }): TreeItemConfig {
    const allowPU = opts?.allowPowerUp ?? true;

    // Weighted distribution:
    // Fruits (60%), Rotten (20%), Trash (15%), PowerUp (5%)
    const r = Math.random();

    let type: TreeItemType = "fruit";
    let scoreValue: number = 0;
    let sprite: Sprite;
    let highlightSprite: Sprite | undefined = undefined;
    let randSprite: HighlightSprite;
    let randomSprite: {sprite: Sprite | HighlightSprite, index: number};

    if (r < 0.6) {
      type = "fruit";
      randomSprite = this.randomFrom(this.fruits);
      sprite = randomSprite.sprite as Sprite;
      scoreValue = FRUIT_POINTS[randomSprite.index];
    } else if (r < 0.8) {
      type = "rotten";
      scoreValue = -2;
      randSprite = this.randomFrom(this.rotten).sprite;
      sprite = randSprite.default;
      highlightSprite = randSprite.highlight;
    } else if (r < 0.90) {
      type = "trash";
      randSprite = this.randomFrom(this.trash).sprite;
      sprite = randSprite.default;
      highlightSprite = randSprite.highlight;
    } else {
      type = "powerup";
      if (!allowPU)
        return this.getRandomItemConfig({ allowPowerUp: false });
      randomSprite = this.randomFrom(this.powerUps);
      randSprite = randomSprite.sprite as HighlightSprite;
      scoreValue = randomSprite.index;
      sprite = randSprite.default;
      highlightSprite = randSprite.highlight;
    }

    return {
      itemType: type,
      sprite,
      scoreValue,
      highlightSprite,
      fallSpeed: this.fallSpeed,
      maxSpeed: this.maxSpeed,
      dropMode: "fall", // overwritten by manager logic
      startPosition: vec(0, 0), // replaced in spawnItemFromBranch
    };
  }

  // x: ±220, y: between -200 and -400
  private randomArcVelocity() {
    const x = this.randomBetween(-220, 220);
    const y = this.randomBetween(-400, -200);
    return vec(x, y);
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  private randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private randomFrom<T>(arr: T[]): {sprite: T, index: number} {
    const index = Math.floor(Math.random() * arr.length);
    return {sprite: arr[index], index};
  }

  private delay(ms: number) {
    return new Promise<void>((resolve) => {
      this.engine.clock.schedule(() => resolve(), ms);
    });
  }
}
