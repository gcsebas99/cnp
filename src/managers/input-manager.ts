import { GamepadButtonEvent, KeyEvent, Keys, Gamepad, Engine } from "excalibur";

export type InputState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;

  button1: boolean;
  button2: boolean;
  button3: boolean;
  pause: boolean;

  justPressed: Set<string>;   // names of inputs pressed this frame
  justReleased: Set<string>;  // names of inputs released this frame
  heldTime: Map<string, number>; // ms held per key/button
};

type KeyHandler = (evt: KeyEvent) => void;
type GamepadHandler = (evt: GamepadButtonEvent) => void;

interface ManagedGamepad {
  id: string;
  gamepad: Gamepad;
  handlers: GamepadHandler[];
}

export class InputManager {
  private static _instance: InputManager;
  private engine: Engine;

  private keyboardHandlers: Map<string, KeyHandler[]> = new Map();
  private gamepads: ManagedGamepad[] = [];

  private current: InputState = this.emptyState();
  private previous: InputState = this.emptyState();

  private constructor(engine: Engine) {
    this.engine = engine;
    this.updateConnectedGamepads();
  }

  /** Initialize singleton instance */
  public static init(engine: Engine) {
    if (!InputManager._instance) {
      InputManager._instance = new InputManager(engine);
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
  // KEYBOARD HANDLING
  // --------------------------------------------------

  public onKey(event: "press" | "hold" | "release", handler: KeyHandler) {
    if (!this.keyboardHandlers.has(event)) {
      this.keyboardHandlers.set(event, []);
    }
    this.keyboardHandlers.get(event)!.push(handler);
    this.engine.input.keyboard.on(event, handler);
  }

  public offKey(event: "press" | "hold" | "release", handler: KeyHandler) {
    const handlers = this.keyboardHandlers.get(event);
    if (!handlers) return;

    const idx = handlers.indexOf(handler);
    if (idx !== -1) {
      handlers.splice(idx, 1);
      this.engine.input.keyboard.off(event, handler);
    }
  }

  public async waitForKeyPress(): Promise<Keys> {
    return new Promise((resolve) => {
      const once = (evt: KeyEvent) => {
        this.engine.input.keyboard.off("press", once);
        resolve(evt.key);
      };
      this.engine.input.keyboard.on("press", once);
    });
  }

  // --------------------------------------------------
  // GAMEPAD HANDLING
  // --------------------------------------------------

  /** Refresh internal list of connected gamepads */
  private updateConnectedGamepads() {
    this.gamepads = [];
    const pads = this.engine.input.gamepads;

    for (let i = 0; i < pads.count(); i++) {
      const pad = pads.at(i);
      if (pad?.connected) {
        this.gamepads.push({
          id: `pad-${i}`,  // Assign our own ID
          gamepad: pad,
          handlers: []
        });
      }
    }
  }

  /** Returns the first connected gamepad */
  public getConnectedGamepad(): Gamepad | undefined {
    this.updateConnectedGamepads();
    return this.gamepads[0]?.gamepad;
  }

  /** Subscribe to button presses for the first connected gamepad */
  public onGamepadButton(handler: GamepadHandler) {
    const padEntry = this.gamepads[0];
    if (!padEntry) return;

    padEntry.handlers.push(handler);
    padEntry.gamepad.on("button", handler);
  }

  /** Unsubscribe a handler from the first connected gamepad */
  public offGamepadButton(handler: GamepadHandler) {
    const padEntry = this.gamepads[0];
    if (!padEntry) return;

    const idx = padEntry.handlers.indexOf(handler);
    if (idx !== -1) {
      padEntry.handlers.splice(idx, 1);
      padEntry.gamepad.off("button", handler);
    }
  }

  /** Await the next gamepad button press */
  public async waitForGamepadButton(): Promise<number> {
    return new Promise((resolve) => {
      const pad = this.getConnectedGamepad();
      if (!pad) resolve(-1);

      const once = (evt: GamepadButtonEvent) => {
        pad?.off("button", once);
        resolve(evt.button);
      };
      pad?.on("button", once);
    });
  }

  // ==================================================
  // NEW: SNAPSHOT SYSTEM
  // ==================================================
  private emptyState(): InputState {
    return {
      left: false, right: false, up: false, down: false, button1: false, button2: false, button3: false, pause: false,
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

    const kb = this.engine.input.keyboard;
    const gp = this.getConnectedGamepad();

    // --- keyboard mapping ---
    this.current.left = kb.isHeld(Keys.Left);
    this.current.right = kb.isHeld(Keys.Right);
    this.current.up = kb.isHeld(Keys.Up);
    this.current.down = kb.isHeld(Keys.Down);

    this.current.button1 = kb.isHeld(Keys.S);
    this.current.button2 = kb.isHeld(Keys.A);
    this.current.button3 = kb.isHeld(Keys.W);
    this.current.pause = kb.isHeld(Keys.Esc);

    // --- gamepad mapping ---
    if (gp) {
      const leftX = gp.getAxes(0); // -1 = left, +1 = right
      const leftY = gp.getAxes(1); // -1 = up, +1 = down

      this.current.left ||= leftX < -0.3;
      this.current.right ||= leftX > 0.3;
      this.current.up ||= leftY < -0.3;
      this.current.down ||= leftY > 0.3;

      this.current.button1 ||= gp.isButtonHeld(0); // Cross / X
      this.current.button2 ||= gp.isButtonHeld(1); // Circle
      this.current.button3 ||= gp.isButtonHeld(2); // Square
      this.current.pause ||= gp.isButtonHeld(9);   // Options/Start
    }

    // --- edge detection & held tracking ---
    for (const key of ["left","right","up","down","button1","button2","button3","pause"] as const) {
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

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  /** Remove all listeners — call on scene exit */
  public clearAllListeners() {
    // Clear keyboard
    for (const [event, handlers] of this.keyboardHandlers) {
      handlers.forEach((h) => this.engine.input.keyboard.off(event as any, h));
    }
    this.keyboardHandlers.clear();

    // Clear gamepad handlers
    this.updateConnectedGamepads();
    this.gamepads.forEach((padEntry) => {
      padEntry.handlers.forEach((h) => padEntry.gamepad.off("button", h));
      padEntry.handlers = [];
    });
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
//
// Example activate / deactivate
// onActivate(ctx: ex.SceneActivationContext<undefined>): void {
//   const input = InputManager.instance;
//   const handler = () => this.gotoMenu(this.engine);
//   input.onKey("press", handler);
//   input.onGamepadButton(handler);
// }
// onDeactivate() {
//   InputManager.instance.clearAllListeners();
// }