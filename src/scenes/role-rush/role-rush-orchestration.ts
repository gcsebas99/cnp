import { GameOrchestration } from "@/core/game-orchestration";
import { Resources as TennisResources } from "@/resources/tennis-resources";
import { TimelineScheduler } from "@/core/timeline-scheduler";
import { SoundManager } from "@/managers/sound-manager";
import { InputManager } from "@/managers/input-manager";
import { PopupManager } from "@/managers/popup-manager";
import { Resources } from "@/resources";
import { animTimesUpSprite } from "@/sprite-sheets/times-up";
import { EndGameManager } from "@/managers/end-game-manager";
import { RoleRushScene } from "@/scenes/role-rush/role-rush-scene";

export class RoleRushOrchestration extends GameOrchestration {
  async start() {
    this.isRunning = true;

    const events = [
      { ms: 500, callback: () => {
          SoundManager.instance.playOnce(TennisResources.Cheering1Sfx, 0.3);
      }},
      { ms: 2000, callback: () => {
          SoundManager.instance.playOnce(TennisResources.WelcomeChutiSfx);
      }},
      { ms: 6500, callback: () => {
          //(this.scene as TennisScene).addPlayerToScene();
      }},
      { ms: 6600, callback: () => {
          SoundManager.instance.playOnce(TennisResources.Cheering3Sfx, 0.7);
      }},
      { ms: 15000, callback: () => {
          TennisResources.Cheering3Sfx.volume = 0.4;
      }},
      { ms: 17000, callback: () => {
          TennisResources.Cheering3Sfx.volume = 0.1;
      }},
      { ms: 18700, callback: () => {
          (this.scene as RoleRushScene).showStartPromptAndGUI();
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 21500,
      onComplete: () => {
        this.isRunning = false;
        console.log("RR intro complete — start game!");
        // TennisResources.HelloIntro1Sfx.volume = 0.7;
        // TennisResources.HelloIntro1Sfx.loop = true;
        // TennisResources.HelloIntro1Sfx.play();
        //this.scene.enableInput();
      },
    });

    this.timeline.start();
  }

  async devStart() {
    this.isRunning = true;
    console.log("RoleRushOrchestration DEV START");
    (this.scene as RoleRushScene).addPlayerToScene();
    (this.scene as RoleRushScene).showStartPromptAndGUI();
    await this.delay(3000);
    (this.scene as RoleRushScene).startGame();
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
          //SoundManager.instance.playOnce(TennisResources.Cheering2Sfx, 0.5);
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 6100,
      onComplete: () => {
        this.isRunning = false;
        EndGameManager.instance.gameHasEnded(this.scene, (this.scene as RoleRushScene).getScore());
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