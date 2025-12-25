import { Engine } from "excalibur";
import { Player, TennisState } from "@/actors/player/player";
import { InputManager } from "@/managers/input-manager";
import { Controller } from "@/controllers/controller";
import { Racket } from "@/actors/tools/racket";

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

  private state: TennisState = "idle";
  private swingLocked = false;


  update(player: Player, engine: Engine, delta: number) {
    const inputState = this.input.state;

    // --- MOVEMENT ---
    let dir = 0;
    if (inputState.left) dir = -1;
    else if (inputState.right) dir = 1;

    const running = this.computeRunning(engine, dir);
    const speed = this.computeSpeed(running, engine, player, delta);
    player.vel.x = dir * speed;

    // --- SWING (highest priority) ---
    if (!this.swingLocked && inputState.justPressed.has("button1")) {
      this.enterSwing(engine, player);
      return;
    }
    if (this.swingLocked) return;

    // --- STATE DECISION ---
    let nextState: TennisState = "idle";
    if (dir !== 0) {
      nextState = running ? "run" : "walk";
    }

    this.applyState(player, nextState, dir);
  }

  private applyState(player: Player, state: TennisState, dir: number) {
    if (this.state === state) return;
    this.state = state;

    const racket = player.tool as Racket | undefined;

    player.setTennisState(state);

    switch (state) {
      case "idle":
        racket?.allowAutoAdjust(true);
        break;

      case "walk":
      case "run":
        racket?.allowAutoAdjust(false);
        player.setFacing(dir < 0);
        racket?.forceSide(dir < 0 ? "left" : "right");
        break;
    }
  }

  private enterSwing(engine: Engine, player: Player) {
    this.state = "swing";
    this.swingLocked = true;

    const racket = player.tool as Racket;
    racket.allowAutoAdjust(false);

    player.setFacing(racket.getRacketSide() === "left");
    player.setTennisState("swing");
    racket.use("swing", engine.clock.now());

    player.bodyActor.animation.current.events.once("end", () => {
      this.swingLocked = false;
      this.state = "idle";
      racket.allowAutoAdjust(true);
      player.setTennisState("idle");
    });
  }

  private computeRunning(engine: Engine, dir: number): boolean {
    if (dir === 0) {
      this.holdMoveStart = null;
      this.isRunning = false;
      this.isRunningFaster = false;
      return false;
    }

    if (this.holdMoveStart === null) {
      this.holdMoveStart = engine.clock.now();
    }

    const heldFor = engine.clock.now() - this.holdMoveStart;

    this.isRunning = heldFor > this.runThreshold[0];
    this.isRunningFaster = heldFor > this.runThreshold[1];

    return this.isRunning;
  }

  private computeSpeed(
    running: boolean,
    engine: Engine,
    player: Player,
    delta: number
  ): number {
    let speed = this.baseSpeed;

    if (running) {
      speed *= this.isRunningFaster
        ? this.runMultiplier[1]
        : this.runMultiplier[0];

      // Vertical bump (purely visual)
      const amp = this.isRunningFaster
        ? this.bumpAmplitude[1]
        : this.bumpAmplitude[0];

      player.pos.y +=
        Math.sin(engine.clock.now() / 100 * this.bumpFrequency) *
        amp *
        delta;
    }

    return speed;
  }

  performAction(player: Player, action: string, options?: any): void {
    switch (action) {
      case "swing":
        if (player.scene && player.scene.engine) {
          this.enterSwing(player.scene.engine, player);
        }
        break;
      default:
        break;
    }
  }
}
