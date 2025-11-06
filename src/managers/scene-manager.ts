import { Engine } from "excalibur";
//
import { TennisScene } from "@/scenes/tennis/tennis-scene";
import { loader as tennisLoader } from "@/resources/tennis-resources";
//
import { BasketDashScene } from "@/scenes/basket-dash/basket-dash-scene";
import { loader as basketDashLoader } from "@/resources/basket-dash-resources";
//
import { RoleRushScene } from "@/scenes/role-rush/role-rush-scene";
import { loader as roleRushLoader } from "@/resources/role-rush-resources";
import { LevelOneScene } from "@/scenes/adventure/level-one-scene";

export class SceneManager {
  private static _instance: SceneManager;
  private engine!: Engine;

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  public static init(engine: Engine) {
    if (!SceneManager._instance) {
      SceneManager._instance = new SceneManager(engine);
    }
    return SceneManager._instance;
  }

  public static get instance() {
    if (!SceneManager._instance) {
      throw new Error("SceneManager not initialized. Call SceneManager.init(engine) first.");
    }
    return SceneManager._instance;
  }

  public addGameScenes() {
    this.engine.addScene("tennis", {scene: TennisScene, loader: tennisLoader});
    this.engine.addScene("basketDash", {scene: BasketDashScene, loader: basketDashLoader});
    this.engine.addScene("roleRush", {scene: RoleRushScene, loader: roleRushLoader});
    this.engine.addScene("levelOne", {scene: LevelOneScene });
  }

  public resetScene(name: string) {
    switch(name) {
      case "tennis":
        this.engine.removeScene("tennis");
        this.engine.addScene("tennis", {scene: TennisScene, loader: tennisLoader});
        break;
      case "basketDash":
        this.engine.removeScene("basketDash");
        this.engine.addScene("basketDash", {scene: BasketDashScene, loader: basketDashLoader});
        break;
      case "roleRush":
        this.engine.removeScene("roleRush");
        this.engine.addScene("roleRush", {scene: RoleRushScene, loader: roleRushLoader});
        break;
      default:
        console.warn(`SceneManager: No scene found with the name "${name}" to reset.`);
    }
  }
}
