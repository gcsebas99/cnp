import { Color, Engine } from "excalibur";
import { Resources } from "@/resources";
import { GameScene } from "@/core/game-scene";

export class LevelOneScene extends GameScene {

  constructor() {
    super("levelOne");
  }

  onInitialize(engine: Engine) {
    this.backgroundColor = Color.Blue;
    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {

  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }
}
