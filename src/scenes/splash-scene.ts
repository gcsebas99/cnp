import { Actor, Color, Engine, FadeInOut, Font, Label, Scene, Sprite, TextAlign, Vector } from "excalibur";
import { Resources } from "@/resources";
import { InputManager } from "@/managers/input-manager";

export class SplashScene extends Scene {
  private inputManager = InputManager.instance;
  private background?: Sprite;
  private pressText!: Label;
  private elapsed = 0;

  constructor() {
    super();
  }

  public onInitialize(engine: Engine) {
    // Background sprite
    const bgTexture = Resources.Splash;
    this.background = bgTexture.toSprite();
    this.background.scale = new Vector(
      engine.drawWidth / this.background.width,
      engine.drawHeight / this.background.height
    );

    // Add background
    const bgActor = new Actor({
      pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
      anchor: Vector.Half
    });
    bgActor.graphics.use(this.background);
    this.add(bgActor);

    // Press any key text
    this.pressText = new Label({
      text: "Presiona cualquier tecla...",
      pos: new Vector(engine.halfDrawWidth, engine.drawHeight - 120),
      font: new Font({
        size: 64,
        family: "ThaleahFat",
        textAlign: TextAlign.Center,
        color: new Color(0, 0, 128)
      }),
      anchor: Vector.Half,
    });

    this.add(this.pressText);
  }

  onActivate() {
    InputManager.instance.updateConnectedGamepads();
  }

  onTransition(direction: "in" | "out") {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }

  private gotoMenu(engine: ex.Engine) {
    engine.goToScene("menu");
  }

  public onPreUpdate(engine: ex.Engine, delta: number) {
    this.inputManager.update();
    super.onPreUpdate(engine, delta);

    if (this.inputManager.isAnyInputPressed()) {
      this.gotoMenu(engine);
    }

    // Breathing animation for pressText
    this.elapsed += delta;
    // Sinusoidal fade in/out (slow breathing effect)
    const alpha = 0.5 + 0.5 * Math.sin(this.elapsed / 400);
    this.pressText.color = new Color(0, 0, 128, alpha);
  }
}
