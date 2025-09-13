import { GamepadButtonEvent, KeyEvent, Keys, Gamepad, Engine } from "excalibur";

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
