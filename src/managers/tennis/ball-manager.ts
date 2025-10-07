import { Ball } from "@/actors/objects/ball";
import { Player } from "@/actors/player/player";
import { Racket } from "@/actors/tools/racket";
import { computeHitEffectiveness } from "@/actors/tools/racket/compute-hit-effectiveness";
import { Area } from "@/types/area";
import { Scene, vec } from "excalibur";

export class BallManager {
  private scene: Scene;
  private player: Player;
  private ball?: Ball;
  private spawns: { playerSide: Area[], opponentSide: Area[], pointWon: any[], pointLost: any[], opponentSpawns: Area[] } = {
    playerSide: [], opponentSide: [], pointWon: [], pointLost: [], opponentSpawns: []
  };
  private bounce: { player?: Area, opponent?: Area } = {};

  private servingSide: "opponent" | "player" = "opponent";
  private lastHitBy: "opponent" | "player" = "opponent";

  constructor(scene: Scene, player: Player) {
    this.scene = scene;
    this.player = player;
  }

  public registerAreas(areas: { ballSpawnRects: Area[], opponentSpawnRects: any[], pointWonActors: any[], pointLostActors: any[], bouncePlayer: Area, bounceOpponent: Area }) {
    this.spawns.playerSide = areas.ballSpawnRects.filter(a => a.side === "player");
    this.spawns.opponentSide = areas.ballSpawnRects.filter(a => a.side === "opponent");
    this.spawns.opponentSpawns = areas.opponentSpawnRects.map(r => r.rect);
    this.spawns.pointWon = areas.pointWonActors;
    this.spawns.pointLost = areas.pointLostActors;
    this.bounce.player = areas.bouncePlayer;
    this.bounce.opponent = areas.bounceOpponent;
  }

  private randomPointInRect(rect:Area) {
    return {
      x: rect.x + Math.random() * rect.width,
      y: rect.y + Math.random() * rect.height
    };
  }

  public serveBy(by: "player" | "opponent") {
    console.log("||----serveBy", by);
    this.lastHitBy = by;

    if (this.ball) {
      this.ball.kill();
      this.ball = undefined;
    }

    const spawnRects = by === "opponent" ? this.spawns.opponentSide : this.spawns.playerSide;
    if (!spawnRects.length) {
      console.warn("No spawn rects!");
      return;
    }
    const rect = spawnRects[Math.floor(Math.random() * spawnRects.length)];
    const pos = this.randomPointInRect(rect);
    this.ball = new Ball(pos.x, pos.y, 20);
    this.scene.add(this.ball);

    // wire ball events
    this.ball.on("ball:goal", (evt:any) => {
      const goalActor = evt.actor;
      // decide winner based on which zone
      if (this.spawns.pointWon.includes(goalActor) && this.lastHitBy === "player") {
        this.onPointWon();
      } else if (this.spawns.pointLost.includes(goalActor) && this.lastHitBy === "opponent") {
        this.onPointLost();
      }
    });

    this.ball.on("ball:opponent", (evt:any) => {
      // TODO: instead of randomly decide here if opponent hits back, we can consider hit effectiveness to increase/reduce chance
      const hitBack = Math.random() < 0.50; // 50% chance to hit back
      if (hitBack) {
        this.hitBall("opponent");
      }
    });

    this.ball.on("ball:hit", (evt) => {
      // if hit and win true maybe award a point later once ball reaches opponent's point zone
    });

    this.hitBall(by);
  }

  private onPointWon() {
    // increment player score
    this.scene.emit("tennis:point", { who: "player" });
    // next serve: player serves (because he won)

    if (this.ball) {
      this.ball.kill();
      this.ball = undefined;
    }
    setTimeout(() => this.serveBy("player"), 600);
  }

  private onPointLost() {
    this.scene.emit("tennis:point", { who: "opponent" });
    // next serve: opponent serves

    if (this.ball) {
      this.ball.kill();
      this.ball = undefined;
    }
    setTimeout(() => this.serveBy("opponent"), 600);
  }

  /** Called when racket touches the ball */
  public hitBall(by: "player" | "opponent") {
    if (!this.ball) return;
    const targetArea = by === "player" ? this.bounce.opponent : this.bounce.player;
    if (!targetArea) return;
    this.lastHitBy = by;
    const target = this.randomPointInRect(targetArea);

    // compute direction
    const dx = target.x - this.ball.pos.x;
    const dy = target.y - this.ball.pos.y;
    const len = Math.sqrt(dx*dx + dy*dy);

    // --- evaluate effectiveness if player ---
    let speed = this.ball.speed; // base speed
    let winChance = 0.5;
    const swing = (this.player.getEquippedTool() as Racket)?.swing;
    if (by === "player" && swing) {
      const info = swing.getSwingInfo(this.scene.engine.clock.now());
      console.log("swing elapsed:", info.elapsed, info.phase);
      const eff = computeHitEffectiveness(info);
      speed *= eff.newSpeedMult;
      winChance = eff.winChance;
    } else {
      // Opponent AI, for now random
      winChance = 0.5;
    }
    const newVel = vec((dx/len)*speed, (dy/len)*speed);
    this.ball.vel = newVel;




    // TODO: instead of random extra speed, we can use effectiveness of hit to determine speed
    // const speed = 250 + Math.random() * 200;
    // const newVel = vec((dx/len)*speed, (dy/len)*speed);
    // this.ball.vel = newVel;





    // add bounce marker
    this.ball.addBounceMarker(target.x, target.y, by === "player" ? 4 : 8);
    // notify listeners about new trajectory
    this.scene.emit("ball:trajectory", { by, vel: newVel.clone() });

    return winChance;
  }
}


  // public serve(side: "opponent" | "player") {
  //   if (this.ball) {
  //     this.ball.kill();
  //     this.ball = undefined;
  //   }

  //   this.servingSide = side;
  //   const spawnRects = side === "opponent" ? this.spawns.opponentSide : this.spawns.playerSide;
  //   if (!spawnRects.length) {
  //     console.warn("No spawn rects!");
  //     return;
  //   }
  //   const rect = spawnRects[Math.floor(Math.random() * spawnRects.length)];
  //   const pos = this.randomPointInRect(rect);
  //   this.ball = new Ball(pos.x, pos.y, 20);
  //   this.scene.add(this.ball);

  //   // set velocity roughly toward other side
  //   const dir = side === "opponent" ? 1 : -1;
  //   const vx = dir * (300 + Math.random() * 200);
  //   const vy = (Math.random() - 0.5) * 200;
  //   this.ball.vel = vec(vx, vy);

  //   // wire ball events
  //   this.ball.on("ball:goal", (evt:any) => {
  //     const goalActor = evt.actor;
  //     // decide winner based on which zone
  //     if (this.spawns.pointWon.includes(goalActor)) {
  //       console.log("BallManager POINT WON");
  //       this.onPointWon();
  //     } else if (this.spawns.pointLost.includes(goalActor)) {
  //       console.log("BallManager POINT LOST");
  //       this.onPointLost();
  //     }
  //     // remove ball and schedule next serve
  //     //this.ball?.kill();
  //     //setTimeout(() => this.serve(this.servingSide === "opponent" ? "opponent" : "opponent"), 600);
  //   });

  //   this.ball.on("ball:hit", (evt) => {

  //     console.log("BallManager ball:hit", evt);
  //     // if hit and win true maybe award a point later once ball reaches opponent's point zone
  //   });
  // }