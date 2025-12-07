// tree-item.ts
import { PHYSICS_CONFIG } from "@/config/physiscs";
import { Actor, CollisionType, Engine, Sprite, Timer, Vector, vec } from "excalibur";
import { Basket } from "../tools/basket";
import { Player } from "../player/player";

export type TreeItemType =
  | "fruit"
  | "rotten"
  | "trash"
  | "powerup";

export type DropMode = "fall" | "arc";

export interface TreeItemConfig {
  startPosition: Vector;
  width?: number;
  height?: number;
  sprite: Sprite;
  highlightSprite?: Sprite;
  itemType: TreeItemType;
  scoreValue: number;

  initialZ?: number;

  // Motion
  fallSpeed: number;   // pixels/sec
  dropMode: DropMode;

  // Arc mode only
  arcInitialVelocity?: Vector; // e.g. vec(200, -300)
  maxSpeed?: number;
}

export class TreeItem extends Actor {
  private defaultSprite: Sprite;
  private highlightSprite: Sprite | null = null;
  private highlightTimer!: Timer;

  private _vel = vec(0, 0);
  private fallSpeed: number;
  private dropMode: DropMode;
  private maxSpeed: number;
  private arcVelocity: Vector | null = null;

  private itemType: TreeItemType;
  private scoreValue: number;

  constructor(config: TreeItemConfig) {
    super({
      name: "TreeItem",
      pos: config.startPosition.clone(),
      width: config.width ?? 40,
      height: config.height ?? 40,
      collisionType: CollisionType.Passive,
      z: config.initialZ ?? 0,
    });

    this.defaultSprite = config.sprite;
    this.highlightSprite = config.highlightSprite || null;

    this.fallSpeed = config.fallSpeed;
    this.dropMode = config.dropMode;

    this.maxSpeed = config.maxSpeed ?? 700;

    this.itemType = config.itemType;
    this.scoreValue = config.scoreValue;

    if (config.dropMode === "arc" && config.arcInitialVelocity) {
      this.arcVelocity = config.arcInitialVelocity.clone();
    }
  }

  onInitialize(engine: Engine) {
    if (this.defaultSprite) {
      this.graphics.use(this.defaultSprite);
    }
    if (this.highlightSprite) {
      this.addHighlight(engine);
    }
    // move in front of branches after 300ms
    engine.clock.schedule(() => {
      this.z = this.z + 2;
    }, 300);

    this.on("collisionstart", (evt) => {
      const other = evt.other.owner;

      if (other.hasTag("basket")) {
        const player: Player = (other as Basket).getPlayer();
        if (player.isPlayerHurt()) {
          return;
        }
        this.handleBasketCollision(engine, other as Basket );
      }

      if (other.hasTag("player")) {
        const player: Player = other as Player;
        if (player.isPlayerHurt()) {
          return;
        }
        this.handlePlayerCollision(engine, other as Player);
      }
    });
  }




  private handleBasketCollision(engine: Engine, basket: Basket) {
    const scene: any = engine.currentScene;
    // const score = scene.scoreManager;

    switch (this.itemType) {
      case "fruit": {
        //score.add(this.scoreValue);
        scene.emit("item:picked", { points: this.scoreValue });
        break;
      }
      case "rotten":
        //score.subtract(this.scoreValue);
        scene.emit("item:picked", { points: this.scoreValue });
        break;

      case "trash":
        scene.player.applyHurt();
        break;

      case "powerup":
        scene.player.applyPowerup(this, this.scoreValue);
        break;
    }

    this.kill();
  }

  private handlePlayerCollision(engine: Engine, player: Player) {
    if (this.itemType === "trash") {
      player.applyHurt();
      this.kill();
    }

    if (this.itemType === "powerup") {
      player.applyPowerup(this, this.scoreValue);
    }
  }





  private addHighlight(engine: Engine) {
    let state = 0;

    this.highlightTimer = new Timer({
      interval: 200,
      fcn: () => {
        if (state === 1) {
          this.graphics.use(this.highlightSprite!);
        } else if (state === 0) {
          this.graphics.use(this.defaultSprite);
        }
        state++;
        if (state > 1) {
          state = 0;
        }
      },
      repeats: true,
    });

    engine.currentScene.addTimer(this.highlightTimer);
    this.highlightTimer.start();
  }

  onPreUpdate(engine: Engine, delta: number) {
    const dt = delta / 1000;

    if (this.dropMode === "fall") {
      // Just fall with gravity applied
      this._vel.y += PHYSICS_CONFIG.gravity.y * dt;
      this._vel.y = Math.min(this._vel.y, this.maxSpeed);

      this.pos = this.pos.add(vec(0, this.fallSpeed * dt + this._vel.y * dt));
    }

    if (this.dropMode === "arc" && this.arcVelocity) {
      // ARC MODE = full motion influenced by gravity
      this.arcVelocity = this.arcVelocity.add(PHYSICS_CONFIG.gravity.scale(dt));

      // Cap speed
      if (this.arcVelocity.y > this.maxSpeed) {
        this.arcVelocity = vec(this.arcVelocity.x, this.maxSpeed);
      }

      this.pos = this.pos.add(this.arcVelocity.scale(dt));
    }

    // Auto-remove if out of game view
    if (
      this.pos.y > engine.drawHeight + 200 ||
      this.pos.x < -200 ||
      this.pos.x > engine.drawWidth + 200
    ) {
      this.kill();
    }
  }
}
