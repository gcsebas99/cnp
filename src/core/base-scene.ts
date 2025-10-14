import { InputManager } from "@/managers/input-manager";
import { PauseManager } from "@/managers/pause-manager";
import { Color, Engine, FadeInOut, Scene } from "excalibur";

export abstract class BaseScene extends Scene {
  protected canBePaused: boolean = true;
  public registeredSceneKey: string = "";
  public isPaused: boolean = false;

  constructor(name?: string) {
    super();
    this.registeredSceneKey = name || "";
  }

  onActivate() {
    InputManager.instance.updateConnectedGamepads();
  }

  onPreUpdate(engine: Engine, delta: number) {
    InputManager.instance.update();
    super.onPreUpdate(engine, delta);

    const inputState = InputManager.instance.state;
    if (inputState.justPressed.has("pause") && this.canBePaused) {
      PauseManager.instance.pauseScene(this);
    }
  }

  onTransition(direction: "in" | "out") {
    if (this.isPaused) return undefined; // No transition if pausing or resuming from pause
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
