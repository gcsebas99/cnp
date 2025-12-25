import { GameOrchestration } from "@/core/game-orchestration";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
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

    InputManager.instance.disable();

    const events = [
      { ms: 1000, callback: () => {
          (this.scene as RoleRushScene).addPlayerToScene();
      }},
      { ms: 2000, callback: () => {
          SoundManager.instance.playOnce(RoleRushResources.IntroSfx);
      }},
      { ms: 7500, callback: () => {
          InputManager.instance.enable();
          (this.scene as RoleRushScene).showStartPromptAndGUI();
      }},
    ];

    this.timeline = new TimelineScheduler(events, {
      totalMs: 12000,
      onComplete: async () => {
        SoundManager.instance.playOnce(RoleRushResources.RoleRushMusic, 0.3);
        await this.delay(500);
        (this.scene as RoleRushScene).startGame();
        this.isRunning = false;
      },
    });

    this.timeline.start();
  }

  async devStart() {
    this.isRunning = true;
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
          this.player.celebrate();
          SoundManager.instance.playOnce(RoleRushResources.Cheering2Sfx, 0.5);
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