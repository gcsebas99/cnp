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
  private racketDisabled = false;
  private autoAdjust: boolean = true;

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
      if (!this.autoAdjust) return;
      // Assist only if clear horizontal motion
      if (dx > 10) {
        this.pivot.switchHand("right");
      } else if (dx < -10) {
        this.pivot.switchHand("left");
      }
    });

    this.scene?.on("racket:disable", () => {
      this.racketDisabled = true;
    });
    this.scene?.on("racket:enable", () => {
      this.racketDisabled = false;
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
    if (this.racketDisabled) return;

    const winChance = (this.scene as TennisScene).ballManager?.hitBall("player");
    //console.log("Racket onBallHit, winChance", winChance);

    if (winChance && winChance >= 0.75) {
      TennisResources.BallSolidHitSfx.play();
    } else {
      TennisResources.BallHitSfx.play();
    }
    //ball.emit("ball:hit", { by: "player" });
    // optionally play a sound, particles, etc.
  }

  public getRacketSide(): "left" | "right" {
    return this.pivot.getRacketSide();
  }

  forceSide(side: "left" | "right") {
    //this.pivot.side = side;
    this.pivot.setRacketOnSide(side);
  }

  allowAutoAdjust(enabled: boolean) {
    this.autoAdjust = enabled;
  }
}
