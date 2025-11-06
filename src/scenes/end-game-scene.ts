import { BaseScene } from "@/core/base-scene";
import { EndGameManager } from "@/managers/end-game-manager";
import { Resources as EndGameResources } from "@/resources/end-game-resources";
import { InputManager } from "@/managers/input-manager";
import { Font, Color,  Vector, TextAlign, BaseAlign, Engine, Sprite, ImageSource, Actor, Label, Sound } from "excalibur";
import { TimelineScheduler } from "@/core/timeline-scheduler";
import { SoundManager } from "@/managers/sound-manager";

export class EndGameScene extends BaseScene {
  private timeline?: TimelineScheduler;
  private background?: Sprite;
  private backgroundActor?: Actor;
  private pressText?: Label;
  private currentScoreText?: Label;
  private bestScoreText?: Label;
  private elapsed = 0;

  constructor() {
    super("endgame");
  }

  onInitialize(engine: Engine): void {
    super.onInitialize(engine);
    this.backgroundActor = new Actor({
      name: "Background",
      pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
      anchor: Vector.Half
    });
    this.add(this.backgroundActor);
  }

  onActivate() {
    super.onActivate();
    const engine = this.engine;
    const endGameProps = EndGameManager.instance.getEndGameProps();

    console.log("END GAME SCENE INITIALIZE", endGameProps);
    this.showScoreLabels(engine, endGameProps.score, endGameProps.bestScore);

    // Background
    const bgTexture = EndGameResources[endGameProps.background as keyof typeof EndGameResources] as ImageSource;
    this.background = bgTexture.toSprite();
    this.background.scale = new Vector(
      engine.drawWidth / this.background.width,
      engine.drawHeight / this.background.height
    );
    this.backgroundActor?.graphics.use(this.background);

    const events = [
      { ms: 1000, callback: () => {
          SoundManager.instance.playOnce(EndGameResources[endGameProps.music as keyof typeof EndGameResources] as Sound, 1.0);
      }},
      { ms: 4000, callback: () => {
          this.showPressAnyKeyPrompt(engine);
          InputManager.instance.enable();
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 4100,
      onComplete: () => {},
    });

    this.timeline.start();
  }

  onDeactivate(): void {
    this.pressText?.kill();
    this.currentScoreText?.kill();
    this.bestScoreText?.kill();
    this.timeline?.stop();
  }

  public onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    this.timeline?.update(delta);

    if (InputManager.instance.isAnyInputPressed()) {
      EndGameManager.instance.goToMenuScene();
    }

    // Breathing animation for pressText
    if (this.pressText) {
      this.elapsed += delta;
      const alpha = 0.5 + 0.5 * Math.sin(this.elapsed / 400);
      this.pressText.color = new Color(0, 0, 128, alpha);
    }
  }

  private showScoreLabels(engine: Engine, currentScore: number, bestScore: number) {
    this.currentScoreText = new Label({
      text: `Score: ${currentScore}`,
      pos: new Vector(engine.halfDrawWidth, 200),
      font: new Font({
        family: "PolygonParty",
        size: 130,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        color: new Color(30, 183, 255)
      }),
      anchor: Vector.Half,
    });
    this.add(this.currentScoreText);

    this.bestScoreText = new Label({
      text: `Best: ${bestScore}`,
      pos: new Vector(engine.halfDrawWidth, 400),
      font: new Font({
        family: "PolygonParty",
        size: 80,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        color: Color.Yellow
      }),
      anchor: Vector.Half,
    });
    this.add(this.bestScoreText);
  }

  private showPressAnyKeyPrompt(engine: Engine) {
    this.pressText = new Label({
      text: "Press any key to go back to menu...",
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

}
