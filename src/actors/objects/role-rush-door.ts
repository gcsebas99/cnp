import { InputManager } from "@/managers/input-manager";
import { Actor, CollisionType, Engine, range, vec, Vector, Animation, AnimationStrategy } from "excalibur";
import { Player } from "../player/player";
import { RoleRushDoorSheet } from "@/sprite-sheets/role-rush-door";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
import { SoundManager } from "@/managers/sound-manager";

export class RoleRushDoor extends Actor {
  private input = InputManager.instance;
  private playerNearby = false;
  private isAnimating = false;
  private playerRef: Player | null = null;

  private animIdle!: Animation;
  private animOpen!: Animation;
  private animIdleOpen!: Animation;
  private animClose!: Animation;

  constructor(x: number, y: number) {
    super({
      name: "RoleRushDoor",
      pos: vec(x, y),
      width: 264,
      height: 264,
      anchor: Vector.Zero,
      collisionType: CollisionType.Passive,
      z: -1,
    });

    this.collider.useBoxCollider(264 / 2, 264, Vector.Zero, vec(66, 0));
  }

  onInitialize(engine: Engine) {
    // Build animations
    const sheet = RoleRushDoorSheet;

    this.animIdle = Animation.fromSpriteSheet(sheet, [0], 500);
    this.animOpen = Animation.fromSpriteSheet(sheet, range(0, 3), 120, AnimationStrategy.Freeze);
    this.animIdleOpen = Animation.fromSpriteSheet(sheet, [3], 500);
    this.animClose = this.animOpen.clone();
    this.animClose.reverse();

    this.graphics.use(this.animIdle);

    // Detect player proximity
    this.on("collisionstart", (evt) => {
      const other = evt.other;
      const testPlayer = other.owner;
      if (!this.playerNearby && testPlayer && testPlayer instanceof Player) {
        this.playerNearby = true;
        this.playerRef = testPlayer;
      }
    });
    this.on("collisionend", () => {
      this.playerNearby = false;
      this.playerRef = null;
    });
  }

  onPreUpdate(engine: Engine) {
    if (!this.playerNearby || this.isAnimating) return;

    const input = this.input.state;
    if (input.justPressed.has("up")) {
      this.openDoor(engine);
    }
  }

  private async openDoor(engine: Engine) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (this.playerRef) {
      this.playerRef.performAction("respawn-freeze");
    }

    // 1. Play open animation
    this.animOpen.reset();
    this.graphics.use(this.animOpen);
    SoundManager.instance.playOnce(RoleRushResources.DoorOpenSfx, 0.5);
    await new Promise((r) => setTimeout(r, 480));

    // 3. Fade out player
    if (this.playerRef) {
      this.playerRef.performAction("respawn", { position: vec(1024, -192) });
    }

    // 2. Optional: wait a bit (simulate teleport or level change)
    this.graphics.use(this.animIdleOpen);
    await new Promise((r) => setTimeout(r, 700));

    // 4. Play close animation
    this.animClose.reset();
    this.graphics.use(this.animClose);
    SoundManager.instance.playOnce(RoleRushResources.DoorCloseSfx, 0.5);
    await new Promise((r) => setTimeout(r, 480));

    // 5. Return to idle
    this.graphics.use(this.animIdle);
    this.isAnimating = false;
  }
}