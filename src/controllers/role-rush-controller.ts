import { Engine } from "excalibur";
import { Player, RoleRushState } from "@/actors/player/player";
import { InputManager } from "@/managers/input-manager";
import { Controller } from "@/controllers/controller";

export class RoleRushController implements Controller {
  private input = InputManager.instance;

  // Movement and physics tuning
  private baseSpeed: number = 300;       // walk speed
  private runMultiplier: number = 1.8;   // how much faster when running
  private jumpForce: number = 700;       // upward impulse for jump
  private gravityScale: number = 1.0;    // affects fall acceleration
  private maxFallSpeed: number = 800;    // clamp fall velocity
  private airControl: number = 0.8;      // fraction of movement allowed mid-air

  private isRunning = false;
  private isOnGround = false;
  private respawnFreeze = false;
  private state: RoleRushState = "idle";

  update(player: Player, engine: Engine, delta: number) {
    if (this.respawnFreeze) {
      return;
    }

    const input = this.input.state;
    const dt = delta / 1000;

    // --- Detect ground contact ---
    // (basic version — you might later replace with collision checks or sensors)
    this.isOnGround = Math.abs(player.vel.y) < 0.1;

    // --- Direction ---
    let dir = 0;
    if (input.left) dir = -1;
    else if (input.right) dir = 1;

    // --- Facing ---
    if (dir !== 0) {
      player.setFacing(dir < 0);
      player.tool?.use(dir < 0 ? "facing-left" : "facing-right");
    }

    // --- Running ---
    this.isRunning = input.button2 ?? false;

    let speed = this.baseSpeed;
    if (this.isRunning) {
      speed *= this.runMultiplier;
    }

    const accel = this.isOnGround ? 1.0 : this.airControl;
    player.vel.x = dir * speed * accel;

    // --- Jump ---
    if (input.justPressed.has("button1") && this.isOnGround) {
      player.vel.y = -this.jumpForce;
      this.isOnGround = false;

      // Optional jump animation (single-shot)
      this.applyState(player, "jump");
    }

    // --- Gravity & fall speed clamp ---
    player.vel.y += engine.physics.gravity.y * this.gravityScale * dt;
    if (player.vel.y > this.maxFallSpeed) {
      player.vel.y = this.maxFallSpeed;
    }

    // --- State resolution ---
    if (!this.isOnGround) {
      // stay in jump or keep last state
      return;
    }

    if (dir === 0) {
      this.applyState(player, "idle");
    } else {
      this.applyState(player, this.isRunning ? "run" : "walk");
    }
  }

  private applyState(player: Player, next: RoleRushState) {
    if (this.state === next) return;
    this.state = next;
    player.setRoleRushState(next);
  }

  performAction(player: Player, action: string, options?: any): void {
    switch (action) {
      case "respawn-freeze":
        this.respawnFreeze = true;
        break;
      case "respawn":
        player.actions.fade(0, 500).callMethod(() => {
          player.pos = options?.position || player.pos;
          player.actions.fade(1, 1);
          this.respawnFreeze = false;
        });
        break;
      default:
        break;
    }
  }
}