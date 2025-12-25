import { Engine, Scene } from "excalibur";
import { PersistentGameStateManager } from "@/managers/persistent-game-state-manager";
import { SceneManager } from "@/managers/scene-manager";
import { GameScene } from "@/core/game-scene";

export class EndGameManager {
  private static _instance: EndGameManager | undefined = undefined;
  private engine!: Engine;
  private _endedScene?: Scene;
  private endedSceneKey: string = "";
  private endGameBackground: string = "";
  private endGameMusic: string = "";
  private score: number = 0;
  private bestScore: number = 0;

  public static dispose() {
    EndGameManager._instance = undefined;
    // Clear any other static properties or listeners here
  }

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  public static init(engine: Engine) {
    if (!EndGameManager._instance) {
      EndGameManager._instance = new EndGameManager(engine);
    }
    return EndGameManager._instance;
  }

  public static get instance() {
    if (!EndGameManager._instance) {
      throw new Error("EndGameManager not initialized. Call EndGameManager.init(engine) first.");
    }
    return EndGameManager._instance;
  }

  private getGameScoreKey() {
    switch (this.endedSceneKey) {
      case "tennis":
        return "tennisHighScore";
      case "basketDash":
        return "basketDashHighScore";
      case "roleRush":
        return "roleRushHighScore";
      default:
        return "tennisHighScore";
    }
  }

  public gameHasEnded(scene: Scene, score: number): void {
    this._endedScene = scene;
    this.endedSceneKey = (scene as GameScene).registeredSceneKey;
    //set game background and random end music
    switch (this.endedSceneKey) {
      case "tennis":
        this.endGameBackground = "TennisEndBg";
        break;
      case "basketDash":
        this.endGameBackground = "BasketDashEndBg";
        break;
      case "roleRush":
        this.endGameBackground = "RoleRushEndBg";
        break;
    }
    // randomly pick end game music
    const musicOptions = ["EndGameMusic1", "EndGameMusic2", "EndGameMusic3"];
    const randomIndex = Math.floor(Math.random() * musicOptions.length);
    this.endGameMusic = musicOptions[randomIndex];
    //set score
    this.score = score;
    //store score and fetch best score
    this.bestScore = PersistentGameStateManager.getHighScore(this.getGameScoreKey());
    if (score > this.bestScore) {
      PersistentGameStateManager.setHighScore(this.getGameScoreKey(), score);
      this.bestScore = score;
    }
    //call scene change
    this.engine.goToScene("endgame");
  }

  public getEndGameProps() {
    return {
      background: this.endGameBackground,
      music: this.endGameMusic,
      score: this.score,
      bestScore: this.bestScore
    };
  }

  public goToMenuScene() {
    this.engine.goToScene("menu");
    if (this._endedScene) {
      this._endedScene = undefined;
      SceneManager.instance.resetScene(this.endedSceneKey);
    }
  }

}
