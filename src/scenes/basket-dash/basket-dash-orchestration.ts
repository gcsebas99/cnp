import { GameOrchestration } from "@/core/game-orchestration";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { TimelineScheduler } from "@/core/timeline-scheduler";
import { SoundManager } from "@/managers/sound-manager";
import { InputManager } from "@/managers/input-manager";
import { PopupManager } from "@/managers/popup-manager";
import { Resources } from "@/resources";
import { animTimesUpSprite } from "@/sprite-sheets/times-up";
import { EndGameManager } from "@/managers/end-game-manager";
import { BasketDashScene } from "@/scenes/basket-dash/basket-dash-scene";

export class BasketDashOrchestration extends GameOrchestration {
  async start() {
    this.isRunning = true;

    InputManager.instance.disable();

    const events = [
      { ms: 1000, callback: () => {
          (this.scene as BasketDashScene).addPlayerToScene();
      }},
      { ms: 2000, callback: () => {
          SoundManager.instance.playOnce(BasketDashResources.IntroSfx);
      }},
      { ms: 9500, callback: () => {
          InputManager.instance.enable();
          (this.scene as BasketDashScene).showStartPromptAndGUI();
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 12000,
      onComplete: async () => {
        SoundManager.instance.playOnce(BasketDashResources.BasketDashMusic, 0.3);
        await this.delay(500);
        (this.scene as BasketDashScene).startGame();
        this.isRunning = false;
      },
    });

    this.timeline.start();
  }

  async devStart() {
    this.isRunning = true;
    console.log("BasketDashOrchestration DEV START");
    (this.scene as BasketDashScene).addPlayerToScene();
    (this.scene as BasketDashScene).showStartPromptAndGUI();
    await this.delay(3000);
    (this.scene as BasketDashScene).startGame();
    this.isRunning = false;
    // Enable input immediately
    //this.scene.enableInput();
  }

  async play() {
    this.isRunning = true;
  }

  async end() {
    this.isRunning = true;
    InputManager.instance.disable();

    const events = [
      { ms: 100, callback: () => {
          PopupManager.instance.show({
            text: "Time's up!",
            duration: 1500,
            soundAppear: Resources.TimesUpSfx,
            sprite: animTimesUpSprite,
            soundAppearDelay: 100,
          });
      }},
      { ms: 1000, callback: () => {
          this.player.celebrate();
          SoundManager.instance.playOnce(BasketDashResources.Cheering2Sfx, 0.5);
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 6100,
      onComplete: () => {
        this.isRunning = false;
        EndGameManager.instance.gameHasEnded(this.scene, (this.scene as BasketDashScene).getScore());
      },
    });

    this.timeline.start();
  }

  update(delta: number) {
    this.timeline?.update(delta);
  }

  // Helpers
  private delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }

}