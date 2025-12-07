// basket-obstacle.ts
import {
  Actor,
  CollisionType,
  Vector,
  Engine,
  Sprite,
  vec,
} from "excalibur";

interface BasketObstacleConfig {
  sprite: Sprite;
  targetPos: Vector;
  startPos: Vector;
  arcHeight?: number; // height of the arc
  flightDuration?: number; // ms
  lifetime?: number; // ms the obstacle stays after landing
}

export class BasketObstacle extends Actor {
  private config: BasketObstacleConfig;

  constructor(config: BasketObstacleConfig) {
    super({
      name: "BasketObstacle",
      pos: config.startPos.clone(),
      width: config.sprite.width,
      height: config.sprite.height,
      anchor: vec(0.5, 1),
      collisionType: CollisionType.PreventCollision, // will switch to Fixed later
      z: 5,
      scale: vec(1.75, 1.75),
    });

    this.config = {
      arcHeight: 200,
      flightDuration: 900,
      lifetime: 9000,
      ...config,
    };
  }

  onInitialize(engine: Engine) {
    this.graphics.use(this.config.sprite);

    this.startArcFlight().then(() => {
      // Landed
      this.collider.useBoxCollider(this.config.sprite.width, this.config.sprite.height, vec(0.5, 1));
      this.body.collisionType = CollisionType.Fixed;

      // Start vanish timer
      engine.clock.schedule(() => {
        this.fadeOut(600).then(() => {
          this.kill();
          this.events.emit("obstacle-removed");
        });
      }, this.config.lifetime);
    });
  }

  /** Arc motion using quadratic curve */
  private async startArcFlight(): Promise<void> {
    const { startPos, targetPos, flightDuration, arcHeight } = this.config;

    return new Promise((resolve) => {
      let elapsedTime = 0;
      this.on("postupdate", ({ elapsed }) => {
        elapsedTime += elapsed;
        const t = elapsedTime / flightDuration!; // Normalized time (0 to 1)

        if (t < 1) {
            // Calculate horizontal position (linear interpolation)
            const x = startPos.x + (targetPos.x - startPos.x) * t;

            // Calculate vertical position (parabolic function: h * 4 * t * (1 - t))
            // The 4 * t * (1 - t) formula ensures the peak is at t=0.5 and ends at 0
            const y = startPos.y - arcHeight! * 4 * t * (1 - t);

            this.pos.x = x;
            this.pos.y = y;
        } else {
            this.pos = targetPos.clone(); // Ensure it lands exactly on the target
            // Optionally, remove the update hook or stop the animation
            this.off("postupdate");
            resolve();
        }
      });
    });
  }

  /** Fade-out animation */
  private async fadeOut(duration: number) {
    return new Promise<void>((resolve) => {
      this.actions.fade(0, duration).callMethod(() => resolve());
    });
  }
}
