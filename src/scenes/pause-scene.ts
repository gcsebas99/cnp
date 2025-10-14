import { InputManager } from "@/managers/input-manager";
import { PauseManager } from "@/managers/pause-manager";
import { Scene, Text, Font, Color, ExcaliburGraphicsContext, ScreenElement, Vector, TextAlign, BaseAlign, Engine } from "excalibur";

export class PauseScene extends Scene {
  private pausedManager = PauseManager.instance;
  private quitCounter = 0;
  public bgSceneToRender: Scene | null = null;

  public onInitialize(engine: ex.Engine) {
    const screen = engine.screen;

    const overlay = new ScreenElement({
      pos: Vector.Zero,
      anchor: Vector.Zero,
      z: 5000,
      width: screen.width,
      height: screen.height,
      color: new Color(0, 0, 0, 0.4),
    });
    this.add(overlay);

    const pauseLabel = new ScreenElement({
      pos: screen.center,
      z: 5001
    });
    pauseLabel.graphics.use(new Text({
      text: "Press Pause to resume or hold Button3 to quit",
      color: Color.Yellow,
      font: new Font({
        family: "PolygonParty",
        size: 50,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    }));
    this.add(pauseLabel);
  }

  public onPreDraw(ctx: ExcaliburGraphicsContext, elapsed: number) {
    const pausedScene = this.pausedManager.pausedScene;
    if(pausedScene) {
      pausedScene.draw(ctx, elapsed);
    }
  }

  public onPreUpdate(engine: Engine, delta: number) {
    InputManager.instance.update();
    const state = InputManager.instance.state;
    super.onPreUpdate(engine, delta);
    if (InputManager.instance.state.justPressed.has("pause")) {
      this.pausedManager.resumeScene();
    }
    if (state.heldTime.get("button3")) {
      this.quitCounter += delta;
      if (this.quitCounter > 1500) { // hold for 1.5 seconds
        console.log("Quitting to main menu...");
        this.quitCounter = 0;

        // tell pausedManager to reset paused scene without resuming
        this.pausedManager.goToMenuScene();
      }
    } else {
      this.quitCounter = 0;
    }
  }
}
