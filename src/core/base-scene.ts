import { FullscreenManager } from "@/managers/fullscreen-manager";
import { GuiManager } from "@/managers/gui-manager";
import { InputManager } from "@/managers/input-manager";
import { Color, Engine, FadeInOut, Scene } from "excalibur";

export abstract class BaseScene extends Scene {
  public registeredSceneKey: string = "";

  constructor(name?: string) {
    super();
    this.registeredSceneKey = name || "";
  }

  onActivate() {
    InputManager.instance.updateConnectedGamepads();
    GuiManager.instance.reset();
  }

  onPreUpdate(engine: Engine, delta: number) {
    InputManager.instance.update();
    super.onPreUpdate(engine, delta);

    const inputState = InputManager.instance.state;
    if (inputState.justPressed.has("fullscreen")) {
      FullscreenManager.instance.toggleFullscreen();
    }
  }

  onTransition(direction: "in" | "out"): FadeInOut | undefined {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
