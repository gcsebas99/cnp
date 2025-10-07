import { CollisionStartEvent, CollisionType, Engine, Vector } from "excalibur";
import { Resources as TennisResources } from "@/resources/tennis-resources";
import { TennisCollisionGroups } from "@/config/collision-groups";
import { RacketSwing } from "@/actors/tools/racket/racket-swing";
import { Ball } from "@/actors/objects/ball";
import { TennisScene } from "@/scenes/tennis/tennis-scene";
import { Tool } from "@/actors/tools/tool";
import { RacketPivot } from "@/actors/tools/racket/racket-pivot";
import { Player } from "@/actors/player/player";

export class Racket extends Tool {
  private pivot!: RacketPivot;
  public swing!: RacketSwing;

  constructor(player: Player) {
    super({
      name: "Racket",
      width: 48,
      height: 105,
      anchor: new Vector(0.5, 1), // bottom center pivot
    });
    this.body.collisionType = CollisionType.Passive;
    this.body.group = TennisCollisionGroups.Racket;
    // add pivot
    this.pivot = new RacketPivot(player, this);
    this.pivot.addChild(this);
    //add swing
    this.swing = new RacketSwing(this.pivot);
  }

  onInitialize() {
    this.graphics.use(TennisResources.RacketRed.toSprite());

    // assist player by switching hand based on ball trajectory
    this.scene?.on("ball:trajectory", (evt: any) => {
      if (evt.by !== "opponent") return;
      const dx = evt.vel.x;
      // Assist only if clear horizontal motion
      if (dx > 10) {
        this.pivot.switchHand("right");
      } else if (dx < -10) {
        this.pivot.switchHand("left");
      }
    });
  }

  onPreUpdate(engine: Engine, delta: number) {
    this.swing.update(engine.clock.now());
  }

  public override attachTo(player: Player, attachmentPoint?: Vector) {
    this.player = player;
    if(attachmentPoint) {
      this.pos = attachmentPoint;
    }
    player.addChild(this.pivot); // attach to player
  }

  public use(action: string, now?: number) {
    if (action === "swing") {
      this.swing.startSwing(now ?? 0);
    }
    if (action === "switch-hand") {
      if (this.swing.swinging) return; // prevent switching during swing
      this.pivot.switchHand();
    }
  }

  /** Called when ball collides with the racket */
  public onBallHit(ball: Ball, ev: CollisionStartEvent) {
    const winChance = (this.scene as TennisScene).ballManager?.hitBall("player");
    console.log("Racket onBallHit, winChance", winChance);

    if (winChance && winChance >= 0.75) {
      TennisResources.BallSolidHitSfx.play();
    } else {
      TennisResources.BallHitSfx.play();
    }
    ball.emit("ball:hit", { by: "player" });
    // optionally play a sound, particles, etc.
  }
}

// const progress = this.swing.getProgress(); // -1 idle, 0..1 during swinging
    // const momentum = this.swing.getInstantMomentum();
    // // Determine effectiveness based on progress
    // let effectiveness = 0.15; // default low
    // if (progress === -1) {
    //   effectiveness = 0.15;
    // } else if (progress <= 0.2 || progress >= 0.8) {
    //   // first/last 100ms ~ proportion; tune accordingly vs your duration
    //   effectiveness = 0.40;
    // } else {
    //   effectiveness = 0.85;
    // }
    // // incorporate momentum slightly
    // effectiveness = Math.min(1, effectiveness + momentum * 0.2);
    // // decide if this hit results in a "winning" shot vs neutral return
    // const win = Math.random() < effectiveness;
    // // Set new ball velocity: reflect towards opponent side with some randomness
    // // If racket side is left, ball should go to the right (positive x), and vice versa
    // const dirX = this.side === "left" ? 1 : -1;
    // const baseSpeed = 500 + momentum * 400; // tune
    // const vx = dirX * (baseSpeed * (win ? 1.2 : 0.8));
    // const vy = (Math.random() - 0.5) * 200; // some vertical variation
    // ball.vel = vec(vx, vy);
    // mark ball owner, direction, maybe add spin flag