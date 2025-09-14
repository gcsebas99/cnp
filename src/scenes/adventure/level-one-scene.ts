import { Color, Engine, FadeInOut, Scene } from "excalibur";
import { Resources } from "@/resources";

export class LevelOneScene extends Scene {

  constructor() {
    super();
  }

  onInitialize(engine: Engine) {
    this.backgroundColor = Color.Blue;
    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    Resources.MenuMusic.play();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  onTransition(direction: "in" | "out") {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
