import { GameScene } from "@/core/game-scene";
import { Engine, Scene } from "excalibur";
import { SceneManager } from "@/managers/scene-manager";
import { SoundManager } from "@/managers/sound-manager";

export class PauseManager {
  private static _instance: PauseManager;
  private engine!: Engine;
  private _pausedScene?: Scene;

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  public static init(engine: Engine) {
    if (!PauseManager._instance) {
      PauseManager._instance = new PauseManager(engine);
    }
    return PauseManager._instance;
  }

  public static get instance() {
    if (!PauseManager._instance) {
      throw new Error("PauseManager not initialized. Call PauseManager.init(engine) first.");
    }
    return PauseManager._instance;
  }

  public pauseScene(scene: Scene) {
    if (this.engine.currentScene !== scene) {
      console.warn("PauseManager: Trying to pause a scene that is not the current scene.");
      return;
    }
    this._pausedScene = scene;
    (this._pausedScene as GameScene).isPaused = true;
    SoundManager.instance.pauseAll();
    this.engine.goToScene("pause");
  }

  public resumeScene() {
    if (!this._pausedScene) {
      console.warn("PauseManager: Trying to resume a scene that is not paused.");
      return;
    }
    const pausedSceneKey = (this._pausedScene as GameScene).registeredSceneKey;
    if (pausedSceneKey) {
      this.engine.goToScene(pausedSceneKey);
      SoundManager.instance.resumeAll();
      (this._pausedScene as GameScene).isPaused = false;
      this._pausedScene = undefined;
    }
  }

  public goToMenuScene() {
    this.engine.goToScene("menu");
    if (this._pausedScene) {
      const pausedSceneKey = (this._pausedScene as GameScene).registeredSceneKey;
      this._pausedScene = undefined;
      SceneManager.instance.resetScene(pausedSceneKey);
    }
  }

  public get pausedScene() {
    return this._pausedScene;
  }
}
