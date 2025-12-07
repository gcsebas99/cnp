// RoleTarget.ts
import { RoleName } from "@/managers/role-rush/role-task-manager";
import { Actor, CollisionType, Engine, Timer, vec, Sprite } from "excalibur";

export class RoleTarget extends Actor {
  private sprite: Sprite;
  private shakeTimer!: Timer;
  private baseRotation = 0;
  private taskName: RoleName = "doctor";

  constructor(taskName: RoleName, sprite: Sprite, x: number, y: number, yAdjustment: number = 0, scale: number = 1.0) {
    super({
      pos: vec(x, y + yAdjustment),
      width: sprite.width,
      height: sprite.height,
      collisionType: CollisionType.Passive,
      z: 10,
    });

    this.taskName = taskName;
    this.scale = vec(scale, scale);
    this.sprite = sprite;
    this.addTag("role-target");
  }

  onInitialize(engine: Engine) {
    this.graphics.use(this.sprite);
    this.baseRotation = this.rotation;

    this.createShake(engine);

    this.on("collisionstart", (evt) => {
      if (evt.other.owner.hasTag("player")) {
        // Play sound
        //engine.sound.play("role-success"); // your sound handler
        this.scene?.emit("target:touched", { task: this.taskName });

        this.kill(); // vanish
      }
    });
  }

  private createShake(engine: Engine) {
    this.shakeTimer = new Timer({
      interval: 120,
      repeats: true,
      fcn: () => {
        const r = (Math.random() * 0.12) - 0.06; // -3° to +3°
        this.rotation = this.baseRotation + r;

        // Pause between shakes
        this.shakeTimer.interval = 800;
        setTimeout(() => (this.shakeTimer.interval = 120), 10);
      }
    });

    engine.currentScene.addTimer(this.shakeTimer);
    this.shakeTimer.start();
  }
}
