import { InputManager } from "@/managers/input-manager";
import { PauseManager } from "@/managers/pause-manager";
import { Color, Engine, FadeInOut } from "excalibur";
import { BaseScene } from "@/core/base-scene";

export abstract class GameScene extends BaseScene {
  protected canBePaused: boolean = true;
  //public registeredSceneKey: string = "";
  public isPaused: boolean = false;

  constructor(name?: string) {
    super(name);
  }

  onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);

    const inputState = InputManager.instance.state;
    if (inputState.justPressed.has("pause") && this.canBePaused) {
      PauseManager.instance.pauseScene(this);
    }
  }

  override onTransition(direction: "in" | "out"): FadeInOut | undefined {
    if (this.isPaused) return undefined; // No transition if pausing or resuming from pause
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
