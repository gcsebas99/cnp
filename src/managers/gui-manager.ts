import { Engine, ScreenElement, Vector, Text, Color, Font, TextAlign, BaseAlign, GraphicsComponent, vec } from "excalibur";

export class GuiManager {
  private static _instance: GuiManager;
  private engine!: Engine;

  private timerElement!: ScreenElement;
  private timerLabelElement!: ScreenElement;
  private scoreElement!: ScreenElement;
  private scoreLabelElement!: ScreenElement;

  private remainingTime = 0; // ms
  private score = 0;
  private elementsCreated:boolean = false;
  private isVisible = false;

  private constructor(engine: Engine) {
    this.engine = engine;
    this.elementsCreated = false;
  }

  public static init(engine: Engine) {
    if (!GuiManager._instance) {
      GuiManager._instance = new GuiManager(engine);
    }
    return GuiManager._instance;
  }

  public static get instance() {
    if (!GuiManager._instance) {
      throw new Error("GuiManager not initialized. Call GuiManager.init(engine) first.");
    }
    return GuiManager._instance;
  }

  private createElements() {
    // Timer (top-left)
    const timerLabelPos = this.engine.screen.worldToScreenCoordinates(new Vector(192, 96));
    this.timerLabelElement = new ScreenElement({
      pos: timerLabelPos,
      anchor: Vector.Zero,
      z: 2000
    });
    this.timerLabelElement.graphics.use(new Text({
      text: "Tiempo",
      color: Color.Violet,
      font: new Font({
        family: "PolygonParty",
        size: 50,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    }));

    const timerPos = this.engine.screen.worldToScreenCoordinates(new Vector(192, 170));
    this.timerElement = new ScreenElement({
      pos: timerPos,
      anchor: Vector.Zero,
      z: 2000
    });
    this.timerElement.graphics.use(new Text({
      text: "00:00",
      color: Color.Red,
      font: new Font({
        family: "PolygonParty",
        size: 80,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    }));

    // Score (top-right)
    const scoreLablePos = this.engine.screen.worldToScreenCoordinates(new Vector(this.engine.screen.width, 96));
    this.scoreLabelElement = new ScreenElement({
      pos: scoreLablePos,
      anchor: new Vector(1, 0), // top-right
      z: 2000
    });
    this.scoreLabelElement.graphics.use(new Text({
      text: "Puntos",
      color: Color.Violet,
      font: new Font({
        family: "PolygonParty",
        size: 50,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    }));

    const scorePos = this.engine.screen.worldToScreenCoordinates(new Vector(this.engine.screen.width - 40, 170));
    this.scoreElement = new ScreenElement({
      pos: scorePos,
      anchor: new Vector(1, 0), // top-right
      z: 2000
    });
    this.scoreElement.graphics.use(new Text({
      text: "00",
      color: Color.Red,
      font: new Font({
        family: "PolygonParty",
        size: 80,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    }));

    this.engine.currentScene.add(this.timerElement);
    this.engine.currentScene.add(this.timerLabelElement);
    this.engine.currentScene.add(this.scoreElement);
    this.engine.currentScene.add(this.scoreLabelElement);

    this.hide();
  }

  /** Show GUI */
  public show() {
    if (!this.elementsCreated) {
      this.createElements();
      this.elementsCreated = true;
    }
    this.isVisible = true;
    this.timerElement.get(GraphicsComponent).isVisible = true;
    this.timerLabelElement.get(GraphicsComponent).isVisible = true;
    this.scoreElement.get(GraphicsComponent).isVisible = true;
    this.scoreLabelElement.get(GraphicsComponent).isVisible = true;
  }

  /** Hide GUI */
  public hide() {
    this.isVisible = false;
    this.timerElement.get(GraphicsComponent).isVisible = false;
    this.timerLabelElement.get(GraphicsComponent).isVisible = false;
    this.scoreElement.get(GraphicsComponent).isVisible = false;
    this.scoreLabelElement.get(GraphicsComponent).isVisible = false;
  }

  /** Reset countdown (ms) */
  public setTimer(ms: number) {
    this.remainingTime = ms;
    this.updateTimerText();
  }

  /** Decrement timer */
  public tick(delta: number) {
    if (!this.isVisible) return;
    this.remainingTime = Math.max(0, this.remainingTime - delta);
    this.updateTimerText();
  }

  /** Add to score */
  public addScore(amount: number = 1) {
    this.score += amount;
    this.updateScoreText(true);
  }

  private updateTimerText() {
    const totalSec = Math.floor(this.remainingTime / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const sec = (totalSec % 60).toString().padStart(2, "0");
    (this.timerElement.graphics.current as Text).text = `${min}:${sec}`;
  }

  private updateScoreText(animate = false) {
    (this.scoreElement.graphics.current as Text).text = this.score.toString().padStart(2, "0");

    if (animate) {
      this.scoreElement.actions.scaleTo({scale: vec(1.3, 1.3), duration: 150}).scaleTo({scale: Vector.One, duration: 150});
    }
  }
}