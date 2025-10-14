import { Engine } from "excalibur";
import { Player } from "@/actors/player/player";
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

  update(player: Player, engine: Engine, delta: number) {
    if (this.respawnFreeze) {
      return;
    }

    const inputState = this.input.state;
    const dt = delta / 1000;

    // --- Detect ground contact ---
    // (basic version — you might later replace with collision checks or sensors)
    this.isOnGround = Math.abs(player.vel.y) < 0.1;

    // --- Horizontal movement ---
    let dir = 0;
    if (inputState.left) dir = -1;
    if (inputState.right) dir = 1;

    // Run logic: only when button2 is held
    this.isRunning = inputState.button2 ?? false;

    let speed = this.baseSpeed;
    if (this.isRunning) {
      speed *= this.runMultiplier;
    }

    const accel = this.isOnGround ? 1.0 : this.airControl;
    const targetVelX = dir * speed * accel;

    // Smooth horizontal velocity
    player.vel.x = targetVelX;

    // --- Jumping ---
    if (inputState.justPressed.has("button1") && this.isOnGround) {
      player.vel.y = -this.jumpForce; // negative is upward
      this.isOnGround = false;
    }

    // --- Gravity & fall speed clamp ---
    player.vel.y += engine.physics.gravity.y * this.gravityScale * dt;
    if (player.vel.y > this.maxFallSpeed) {
      player.vel.y = this.maxFallSpeed;
    }

    // --- Simple facing direction ---
    if (dir !== 0) {
      player.graphics.flipHorizontal = dir < 0;
    }
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

  // --- Expose some tuning hooks ---
  public setTuning(options: Partial<{
    baseSpeed: number;
    runMultiplier: number;
    jumpForce: number;
    gravityScale: number;
    maxFallSpeed: number;
    airControl: number;
  }>) {
    Object.assign(this, options);
  }
}