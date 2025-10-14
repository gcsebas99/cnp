import { Engine } from "excalibur";
import { Player } from "@/actors/player/player";
import { InputManager } from "@/managers/input-manager";
import { Controller } from "@/controllers/controller";

export class TennisController implements Controller {
  private input = InputManager.instance;
  private holdMoveStart: number | null = null;
  private isRunning = false;
  private isRunningFaster = false;
  private baseSpeed:number = 200;
  private runMultiplier:number[] = [1.8, 3.0];
  private runThreshold:number[] = [400, 1100]; //ms
  private bumpAmplitude:number[] = [0.15, 0.2];
  private bumpFrequency:number = 0.9;

  update(player: Player, engine: Engine, delta: number) {
    const inputState = this.input.state;

    // handle left/right movement
    let dir = 0;
    if (inputState.left) {
      dir = -1;
      if (this.holdMoveStart === null) {
        this.holdMoveStart = engine.clock.now();
      }
    } else if (inputState.right) {
      dir = 1;
      if (this.holdMoveStart === null) {
        this.holdMoveStart = engine.clock.now();
      }
    } else {
      this.holdMoveStart = null;
      this.isRunning = false;
      this.isRunningFaster = false;
    }
    if (this.holdMoveStart !== null) {
      const heldFor = engine.clock.now() - this.holdMoveStart;
      this.isRunning = heldFor > this.runThreshold[0];
      this.isRunningFaster = heldFor > this.runThreshold[1];
    }
    let speed = this.baseSpeed;
    if (this.isRunning) {
      speed *= this.isRunningFaster ? this.runMultiplier[1] : this.runMultiplier[0];
      // Optional bump effect
      player.pos.y += Math.sin(engine.clock.now() / 100 * this.bumpFrequency) * (this.isRunningFaster ? this.bumpAmplitude[1] : this.bumpAmplitude[0]) * delta;
    }
    player.vel.x = dir * speed;

    // handle swing
    if (inputState.justPressed.has("button1")) {
      player.tool?.use("swing", engine.clock.now());
    }

    // handle racket switch
    if (inputState.justPressed.has("button2")) {
      player.tool?.use("switch-hand");
    }
  }

  performAction(player: Player, action: string, options?: any): void {
    // Not used in this controller
  }
}
