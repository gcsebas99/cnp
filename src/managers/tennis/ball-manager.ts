import { TennisOpponent } from "@/actors/npcs/tennis-opponent";
import { Ball } from "@/actors/objects/ball";
import { ServiceArea } from "@/actors/objects/service-area";
import { Player } from "@/actors/player/player";
import { Racket } from "@/actors/tools/racket";
import { computeHitEffectiveness } from "@/actors/tools/racket/compute-hit-effectiveness";
import { BounceTrapezoidPoints } from "@/types/bounce-trapezoid-points";
import { Scene, vec, Vector } from "excalibur";
import { Resources as TennisResources } from "@/resources/tennis-resources";
import { SoundManager } from "@/managers/sound-manager";
import { Resources } from "@/resources";

export class BallManager {
  private scene: Scene;
  private player: Player;
  private opponent: TennisOpponent;
  //serve
  private serviceAreas: { player: ServiceArea[], opponent: ServiceArea[] } = { player: [], opponent: [] };
  private servingSide: "player" | "opponent" = "player"; // who serves next
  private waitingForServe = false;
  //
  public ball?: Ball;
  private lastHitBy: "opponent" | "player" = "opponent"; // used to determine who hit ball last when goal area is reached
  private bounce: { player: {deep: Vector[], short: Vector[]}, opponent: {deep: Vector[], short: Vector[]} } = {
    player: {
      deep: [],
      short: []
    },
    opponent: {
      deep: [],
      short: []
    }
  };
  private winnerBounce: { player: { left: Vector[], right: Vector[]}, opponent: { left: Vector[], right: Vector[]} } = {
    player: {
      left: [],
      right: []
    },
    opponent: {
      left: [],
      right: []
    }
  };
  // win/loss zones
  private spawns: { pointWon: any[], pointLost: any[] } = {
    pointWon: [], pointLost: []
  };

  constructor(scene: Scene, player: Player, opponent: TennisOpponent) {
    this.scene = scene;
    this.player = player;
    this.opponent = opponent;
  }

  public registerAreas(areas: {
    pointWonActors: any[],
    pointLostActors: any[],
    playerBouncePoints: BounceTrapezoidPoints,
    playerWinnerBouncePoints: { left: Vector[]; right: Vector[] },
    opponentBouncePoints: BounceTrapezoidPoints,
    opponentWinnerBouncePoints: { left: Vector[]; right: Vector[] },
    playerService: ServiceArea[],
    opponentService: ServiceArea[]
  }) {
    this.spawns.pointWon = areas.pointWonActors;
    this.spawns.pointLost = areas.pointLostActors;
    // bounce zones
    this.bounce.player = {
      short: [areas.playerBouncePoints.topLeft, areas.playerBouncePoints.topRight, areas.playerBouncePoints.middleRight, areas.playerBouncePoints.middleLeft],
      deep: [areas.playerBouncePoints.middleLeft, areas.playerBouncePoints.middleRight, areas.playerBouncePoints.bottomRight, areas.playerBouncePoints.bottomLeft],
    };

    this.bounce.opponent = {
      short: [areas.opponentBouncePoints.middleLeft, areas.opponentBouncePoints.middleRight, areas.opponentBouncePoints.bottomRight, areas.opponentBouncePoints.bottomLeft],
      deep: [areas.opponentBouncePoints.topLeft, areas.opponentBouncePoints.topRight, areas.opponentBouncePoints.middleRight, areas.opponentBouncePoints.middleLeft],
    };
    // winner bounce zones
    this.winnerBounce.player = {
      left: areas.playerWinnerBouncePoints.left,
      right: areas.playerWinnerBouncePoints.right,
    };
    this.winnerBounce.opponent = {
      left: areas.opponentWinnerBouncePoints.left,
      right: areas.opponentWinnerBouncePoints.right,
    };
    // service areas
    this.serviceAreas.player = areas.playerService;
    this.serviceAreas.opponent = areas.opponentService;
    this.serviceAreas.player.forEach(area => area.setBallManager(this));
    this.serviceAreas.opponent.forEach(area => area.setBallManager(this));
  }

  private randomPointInTrapezoid(points: Vector[]): Vector {
    // Points order assumed clockwise or counterclockwise: [p1, p2, p3, p4]
    const [p1, p2, p3, p4] = points;

    // Split trapezoid into two triangles: (p1,p2,p3) and (p1,p3,p4)
    const triangles = [
      [p1, p2, p3],
      [p1, p3, p4],
    ];

    // Pick one triangle randomly
    const tri = triangles[Math.random() < 0.5 ? 0 : 1];

    // Generate random barycentric coordinates
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }

    const a = tri[0], b = tri[1], c = tri[2];
    const x = a.x + r1 * (b.x - a.x) + r2 * (c.x - a.x);
    const y = a.y + r1 * (b.y - a.y) + r2 * (c.y - a.y);
    return vec(x, y);
  }

  private randomPointInTriangle(points: Vector[]): Vector {
    // Points are [p1, p2, p3]
    const [a, b, c] = points;
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }
    const x = a.x + r1 * (b.x - a.x) + r2 * (c.x - a.x);
    const y = a.y + r1 * (b.y - a.y) + r2 * (c.y - a.y);
    return vec(x, y);
  }

  public serveBy(by: "player" | "opponent", ballSpawn: Vector) {
    this.lastHitBy = by;

    if (this.ball) {
      this.ball.kill();
      this.ball = undefined;
    }

    this.ball = new Ball(ballSpawn.x, ballSpawn.y, 20);
    this.scene.add(this.ball);

    this.ball.on("ball:goal", (evt: any) => {
      const goalActor = evt.actor;
      if (this.spawns.pointWon.includes(goalActor) && this.lastHitBy === "player") {
        this.onPointWon();
      } else if (this.spawns.pointLost.includes(goalActor) && this.lastHitBy === "opponent") {
        this.onPointLost();
      }
    });

    this.scene.on("opponent:hit", () => {
      this.hitBall("opponent");
    });

    // --- serve parameters ---
    const baseSpeedMult = Math.random() < 0.5 ? 1.0 : 1.1; // very low or low
    const winChance = 0.05; // always low
    const targetZone = "short";

    // Mark for opponent logic
    this.ball.lastPlayerWinChance = winChance;

    this.hitBall(by, { forced: true, speedMult: baseSpeedMult, targetZone });
  }

  private onPointWon() {
    this.scene.emit("tennis:point", { who: "player" });
    this.removeBall();
    this.servingSide = "player"; // winner serves
    setTimeout(() => this.promptService(), 600);
  }

  private onPointLost() {
    if (Math.random() < 0.4) {
      SoundManager.instance.playOnce(this.player.character === "chuti" ? Resources.ChutiOhNoSfx : Resources.NeitiOhNoSfx, 1);
    }

    this.scene.emit("tennis:point", { who: "opponent" });
    this.removeBall();
    this.servingSide = "opponent"; // opponent serves next

    // move to serve area instead
    setTimeout(() => this.promptService(), 600);
  }

  private removeBall() {
    if (this.ball) {
      this.ball.kill();
      this.ball = undefined;
      this.scene.emit("ball:removed");
    }
  }

  public hitBall(by: "player" | "opponent", opts?: { forced?: boolean; speedMult?: number; targetZone?: "short" | "deep" }) {
    if (!this.ball) return;

    const zones = by === "player" ? this.bounce.opponent : this.bounce.player;
    if (!zones) return;

    this.lastHitBy = by;

    let speed = this.ball.speed;
    let winChance = 0.5;
    let targetZone: "short" | "deep" = "deep";

    console.log(`\n--- Ball hit by ${by} --- Forced: ${opts?.forced ? "YES" : "NO"} `);

    // --- Player hit ---
    if (by === "player" && !opts?.forced) {
      const swing = (this.player.getEquippedTool() as Racket)?.swing;
      if (swing) {
        const info = swing.getSwingInfo(this.scene.engine.clock.now());
        const eff = computeHitEffectiveness(info);
        speed *= eff.newSpeedMult;
        winChance = eff.winChance;
        targetZone = eff.targetZone as "short" | "deep";

        console.log("\n\n---------------------------------------------------");
        console.log(`🎾 Player hit effectiveness: ${eff.winChanceLabel} (WC: ${winChance}, SpeedMult: ${eff.newSpeedMult.toFixed(2)}, Zone: ${targetZone})`);
      }
    } else if (opts?.forced) {
      // Forced serve
      speed *= opts.speedMult ?? 1.0;
      winChance = 0.05;
      targetZone = opts.targetZone ?? "short";
    }

    // --- Opponent hit ---
    if (by === "opponent") {
      // Use previously stored player win chance
      const prevPlayerWinChance = this.ball.lastPlayerWinChance ?? 0.5;
      winChance = 1 - prevPlayerWinChance;

      // Simulate reaction-based "opponent effectiveness"
      const oppEff = this.opponent.computeReturnEffectiveness();
      speed *= oppEff.speedMult;
      targetZone = oppEff.targetZone;
    }

    // Pick random bounce within trapezoid or winner triangles
    //const target = this.randomPointInTrapezoid(zones[targetZone]);
    const target = this.getTargetBounce(by, zones, targetZone);

    // Compute direction
    const dx = target.x - this.ball.pos.x;
    const dy = target.y - this.ball.pos.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const newVel = vec((dx / len) * speed, (dy / len) * speed);
    this.ball.vel = newVel;

    TennisResources.BallHitSfx.play();

    // Add bounce marker + store last chance
    this.ball.addBounceMarker(target.x, target.y, by === "player" ? 4 : 8);
    this.ball.lastPlayerWinChance = winChance;

    this.scene.emit("ball:trajectory", { by, vel: newVel.clone(), ball: this.ball });
    return winChance;
  }

  private getTargetBounce(by: "player" | "opponent", zones: { deep: Vector[]; short: Vector[] }, targetZone: "short" | "deep"): Vector {
    let target: Vector;

    // --- Player hitting with VERY_HIGH effectiveness ---
    if (by === "player" && this.ball && this.ball.lastPlayerWinChance >= 0.75) {
      // Retrieve latest swing info (you already log this)
      const swing = (this.player.getEquippedTool() as Racket)?.swing;
      const info = swing?.getSwingInfo?.(this.scene.engine.clock.now());
      const eff = info ? computeHitEffectiveness(info) : null;

      if (eff?.winChanceLabel === "VERY_HIGH" && this.winnerBounce.opponent.left.length && this.winnerBounce.opponent.right.length) {
        const side = Math.random() < 0.5 ? "left" : "right";
        target = this.randomPointInTriangle(this.winnerBounce.opponent[side]);
        console.log(`🎯 TARGET_WINNER_BOUNCE Player VERY_HIGH hit → targeting opponent ${side} winner corner`);
      } else {
        target = this.randomPointInTrapezoid(zones[targetZone]);
      }

    // --- Opponent hitting ---
    } else if (by === "opponent") {
      const oppHasWinnerChance =
        this.opponent.timeInPositionMs >= (this.opponent.winnerHoldThresholdMs ?? 700);
      const chance = this.opponent.winnerChanceValue ?? 0.3;

      if (oppHasWinnerChance && Math.random() < chance) {
        const side = Math.random() < 0.5 ? "left" : "right";
        target = this.randomPointInTriangle(this.winnerBounce.player[side]);
        console.log(`🔥 TARGET_WINNER_BOUNCE Opponent winner shot → targeting player ${side} corner!`);
      } else {
        target = this.randomPointInTrapezoid(zones[targetZone]);
      }

    // --- Default (fallback) ---
    } else {
      target = this.randomPointInTrapezoid(zones[targetZone]);
    }

    return target;
  }


  /** Called by scene to begin first serve */
  public startFirstServe() {
    this.servingSide = "player";
    this.promptService();
  }

  /** Called after each point to setup next service */
  private promptService() {
    this.waitingForServe = true;

    // enable blinking for correct side
    const playerArea = this.serviceAreas.player!;
    const oppArea = this.serviceAreas.opponent!;

    playerArea.forEach(area => area.disable());
    oppArea.forEach(area => area.disable());

    if (this.servingSide === "player") {
      playerArea.forEach(area => area.enable());
    } else {
      oppArea.forEach(area => area.enable());
      setTimeout(() => this.opponent.moveToServePosition(this.serviceAreas.opponent!.map(area => area.pos.clone())), 200);
    }
  }

  /** Trigger actual serve */
  public triggerServe(by: "player" | "opponent") {
    if (!this.waitingForServe) return;
    this.waitingForServe = false;

    // disable both service areas
    this.serviceAreas.player?.forEach(area => area.disable());
    this.serviceAreas.opponent?.forEach(area => area.disable());

    // If player serves: play swing animation first
    if (by === "player") {
      this.scene.emit("racket:disable");
      this.player.controller.performAction(this.player, "swing", { delta: this.scene.engine.clock.now() });
      setTimeout(() => {
        this.serveBy(by, this.player.getCustomData("tennis-serve-ball-position"));
      }, 300);
      setTimeout(() => {
        this.scene.emit("racket:enable");
      }, 700);
    } else {
      this.opponent.animateServe();
      // opponent must move to touch its own service area first
      this.serveBy(by, this.opponent.getCustomData("tennis-serve-ball-position"));
    }
  }
}
