// RoleTrigger.ts
import { RoleName } from "@/managers/role-rush/role-task-manager";
import { Actor, CollisionType, Engine, vec, Timer, Sprite } from "excalibur";

export class RoleTrigger extends Actor {
  private defaultSprite: Sprite;
  private outlineSprite: Sprite;
  private blinkTimer!: Timer;
  private floatDirection = 1;
  private floatSpeed = 12; // px/sec
  private floatRange = 10;
  private baseY = 0;
  public taskName: RoleName = "doctor";
  private isDisabled = false;

  constructor(taskName: RoleName, defaultSprite: Sprite, outlineSprite: Sprite, x: number, y: number, yAdjustment: number = 0) {
    super({
      pos: vec(x, y + yAdjustment),
      width: defaultSprite.width,
      height: defaultSprite.height,
      collisionType: CollisionType.Passive,
      z: 10,
    });

    this.taskName = taskName;
    this.defaultSprite = defaultSprite;
    this.outlineSprite = outlineSprite;
  }

  onInitialize(engine: Engine) {
    this.graphics.use(this.defaultSprite);
    this.baseY = this.pos.y;

    this.createBlinkTimer(engine);

    // Make it pick-up-ready
    this.addTag("role-trigger");

    this.on("collisionstart", (evt) => {
      console.log("RoleTrigger collisionstart", this.taskName, this.isDisabled, evt.other.owner.hasTag("player"));
      if (!this.isDisabled && evt.other.owner.hasTag("player")) {
        // Play sound
        this.scene?.emit("trigger:touched", { task: this.taskName, player: evt.other.owner });
        this.kill(); // vanish
      }
    });
  }

  private createBlinkTimer(engine: Engine) {
    let state = 0;

    this.blinkTimer = new Timer({
      interval: 100,
      fcn: () => {
        state++;
        if (state === 1 || state === 3) {
          this.graphics.use(this.outlineSprite);
        } else if (state === 2 || state === 4) {
          this.graphics.use(this.defaultSprite);
        }

        if (state >= 4) {
          // long pause
          this.blinkTimer.interval = 800;
          state = 0;
        } else {
          this.blinkTimer.interval = 100;
        }
      },
      repeats: true,
    });

    engine.currentScene.addTimer(this.blinkTimer);
    this.blinkTimer.start();
  }

  onPreUpdate(_engine: Engine, delta: number) {
    // Floating movement
    const dy = (this.floatSpeed * delta) / 1000 * this.floatDirection;
    this.pos.y += dy;

    if (Math.abs(this.pos.y - this.baseY) > this.floatRange) {
      this.floatDirection *= -1;
    }
  }

  public setDisabled(disabled: boolean) {
    this.isDisabled = disabled;
    this.graphics.opacity = disabled ? 0.5 : 1;
  }
}
