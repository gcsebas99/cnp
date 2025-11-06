// service-area.ts
import { BallManager } from "@/managers/tennis/ball-manager";
import { Actor, Color, Vector, CollisionType, Engine, vec, Sprite } from "excalibur";
import { Resources as TennisResources } from "@/resources/tennis-resources";

export class ServiceArea extends Actor {
  public side: "player" | "opponent";
  private blinkTimer = 0;
  private blinkState = true;
  private isExpectingService = false;
  private ballManager?: BallManager;
  private ballSprite!: Sprite;

  constructor(pos: Vector, side: "player" | "opponent") {
    super({
      pos,
      radius: 15,
      color: Color.Transparent,
      collisionType: CollisionType.Passive,
      anchor: Vector.Half,
      z: 1500,
    });
    this.side = side;

    this.ballSprite = TennisResources.Ball.toSprite();
    const scale = (side === "player" ? 30 : 15) / this.ballSprite.width;
    this.ballSprite.scale = vec(scale, scale);
  }

  onInitialize() {
    this.on("precollision", (event) => {
      const other = event.other.owner as Actor;
      if (!this.isExpectingService || (other && !other.hasTag("player") && !other.hasTag("npc"))) {
        event.contact.cancel();
        return;
      }
      return; // allow contact
    });
    this.on("collisionstart", (event) => {
      const other = event.other.owner as Actor;
      if (this.isExpectingService && other && (other.hasTag("player") || other.hasTag("npc"))) {
        this.ballManager?.triggerServe(this.side);
      }
    });
  }

  /** Start blinking and become interactable */
  public enable() {
    this.isExpectingService = true;
    this.blinkTimer = 0;
    this.setVisible(true);
  }

  /** Stop blinking and hide */
  public disable() {
    this.isExpectingService = false;
    this.setVisible(false);
  }

  private setVisible(on: boolean) {
    if(on) {
      this.graphics.use(this.ballSprite);
    } else {
      this.graphics.hide();
    }
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (!this.isExpectingService) return;

    this.blinkTimer += delta;
    if (this.blinkTimer > 400) { // toggle every ~0.4s
      this.blinkTimer = 0;
      this.blinkState = !this.blinkState;
      this.setVisible(this.blinkState);
    }
  }

  public setBallManager(ballManager: BallManager) {
    this.ballManager = ballManager;
  }

  /** Checks if player touched this area */
  // public checkPlayerCollision(player: Actor): boolean {
  //   if (!this.isActive) return false;
  //   return this.collides(player);
  // }
}
