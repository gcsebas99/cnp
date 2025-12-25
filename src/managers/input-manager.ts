import { Keys, Gamepad, Engine } from "excalibur";

export type InputState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;

  button1: boolean;
  button2: boolean;
  button3: boolean;
  pause: boolean;
  fullscreen?: boolean;

  justPressed: Set<string>;   // names of inputs pressed this frame
  justReleased: Set<string>;  // names of inputs released this frame
  heldTime: Map<string, number>; // ms held per key/button
};

interface ManagedGamepad {
  id: string;
  gamepad: Gamepad;
}

export class InputManager {
  private static _instance: InputManager | undefined = undefined;
  private engine: Engine;

  public static dispose() {
    InputManager._instance = undefined;
    // Remove any static listeners or references
  }

  private gamepads: ManagedGamepad[] = [];

  private current: InputState = this.emptyState();
  private previous: InputState = this.emptyState();

  private _enabled = true;
  private _allowPauseOnly = false;

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  /** Initialize singleton instance */
  public static init(engine: Engine) {
    if (!InputManager._instance) {
      engine.input.gamepads.enabled = true;
      InputManager._instance = new InputManager(engine);
      InputManager._instance.updateConnectedGamepads();
    }
    return InputManager._instance;
  }

  /** Access singleton */
  public static get instance() {
    if (!InputManager._instance) {
      throw new Error("InputManager not initialized. Call InputManager.init(engine) first.");
    }
    return InputManager._instance;
  }

  // --------------------------------------------------
  // GAMEPAD HANDLING
  // --------------------------------------------------

  /** Refresh internal list of connected gamepads */
  public updateConnectedGamepads() {
    this.gamepads = [];
    const pads = this.engine.input.gamepads;
    for (let i = 0; i < pads.count(); i++) {
      const pad = pads.at(i);
      if (pad?.connected) {
        this.gamepads.push({
          id: `pad-${i}`,  // Assign our own ID
          gamepad: pad,
          //handlers: []
        });
      }
    }
  }

  /** Returns the first connected gamepad */
  public getConnectedGamepad(): Gamepad | undefined {
    return this.gamepads[0]?.gamepad;
  }

  // ==================================================
  // NEW: SNAPSHOT SYSTEM
  // ==================================================
  private emptyState(): InputState {
    return {
      left: false, right: false, up: false, down: false, button1: false, button2: false, button3: false, pause: false, fullscreen: false,
      justPressed: new Set(),
      justReleased: new Set(),
      heldTime: new Map()
    };
  }

  /** Call once per frame from your scene/engine update */
  public update() {
    const delta = this.engine.clock.elapsed();
    // Save previous state
    this.previous = { ...this.current, justPressed: new Set(this.current.justPressed), justReleased: new Set(this.current.justReleased), heldTime: new Map(this.current.heldTime)  };
    this.current = this.emptyState();

    if (!this._enabled && !this._allowPauseOnly) {
      return; // ignore all input
    }

    const kb = this.engine.input.keyboard;
    const gp = this.getConnectedGamepad();

    // --- keyboard mapping ---
    if (this._enabled) {
      this.current.left = kb.isHeld(Keys.Left);
      this.current.right = kb.isHeld(Keys.Right);
      this.current.up = kb.isHeld(Keys.Up);
      this.current.down = kb.isHeld(Keys.Down);

      this.current.button1 = kb.isHeld(Keys.S);
      this.current.button2 = kb.isHeld(Keys.A);
      this.current.button3 = kb.isHeld(Keys.W);
    }
    if (this._enabled || this._allowPauseOnly) {
      this.current.pause = kb.isHeld(Keys.P);
    }
    this.current.fullscreen = kb.isHeld(Keys.F);

    // --- gamepad mapping ---
    if (gp) {
      const leftX = gp.getAxes(0); // -1 = left, +1 = right
      const leftY = gp.getAxes(1); // -1 = up, +1 = down
      if (this._enabled) {
        this.current.left ||= leftX < -0.3 || gp.isButtonHeld(14);
        this.current.right ||= leftX > 0.3 || gp.isButtonHeld(15);
        this.current.up ||= leftY < -0.3 || gp.isButtonHeld(12);
        this.current.down ||= leftY > 0.3 || gp.isButtonHeld(13);
        this.current.button1 ||= gp.isButtonHeld(0); // Cross / X
        this.current.button2 ||= gp.isButtonHeld(2); // Square
        this.current.button3 ||= gp.isButtonHeld(1); // Circle
      }
      if (this._enabled || this._allowPauseOnly) {
        this.current.pause ||= gp.isButtonHeld(9);
      }
      this.current.fullscreen ||= gp.isButtonHeld(8);
    }

    // --- edge detection & held tracking ---
    for (const key of ["left","right","up","down","button1","button2","button3","pause","fullscreen"] as const) {
      if (this.current[key] && !this.previous[key]) {
        this.current.justPressed.add(key);
        this.current.heldTime.set(key, 0); // just started
      } else if (this.current[key] && this.previous[key]) {
        const prev = this.previous.heldTime.get(key) ?? 0;
        this.current.heldTime.set(key, prev + delta);
      }

      if (!this.current[key] && this.previous[key]) {
        this.current.justReleased.add(key);
      }
    }
  }

  /** Get the current unified state */
  public get state(): InputState {
    return this.current;
  }

  // ==================================================
  // CONTROL ENABLE/DISABLE
  // ==================================================
  /** Enable all inputs again */
  public enable() {
    this._enabled = true;
    this._allowPauseOnly = false;
  }

  /** Disable all input completely */
  public disable() {
    this._enabled = false;
    this._allowPauseOnly = false;
    this.current = this.emptyState();
  }

  /** Disable everything except pause button */
  public disableExceptPause() {
    this._enabled = false;
    this._allowPauseOnly = true;
    this.current = this.emptyState();
  }

  /** Check if input is fully disabled */
  public get isDisabled() {
    return !this._enabled && !this._allowPauseOnly;
  }

  /** Check if only pause is allowed */
  public get isPauseOnly() {
    return this._allowPauseOnly;
  }

  // ==================================================
  // Helpers
  // ==================================================
  public isAnyInputPressed(): boolean {
    return this.current.justPressed.size > 0;
  }
}

// --------------------------------------------------
// HOW TO USE IT
// --------------------------------------------------
// Init once
// InputManager.init(engine);
//
// In scene.update()
// InputManager.instance.update();
//
// const input = InputManager.instance.state;
//
// Example: tennis swing
// if (input.justPressed.has("button1")) {
//   player.startSwing();
// }
//
// Example: adventure move
// if (input.left) player.vel.x = -150;
// if (input.right) player.vel.x = 150;
//
// Example: pause
// if (input.justPressed.has("pause")) {
//   this.scene.engine.goToScene("pauseMenu");
// }
