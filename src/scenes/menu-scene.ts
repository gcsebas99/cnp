import { Color, Engine, ExcaliburGraphicsContext, FadeInOut } from "excalibur";
import { Resources } from "@/resources";
import { MenuManager } from "@/managers/menu-manager";
import { BaseScene } from "@/core/base-scene";
import { SoundManager } from "@/managers/sound-manager";

export class MenuScene extends BaseScene {
  private menuManager!: MenuManager;

  constructor() {
    super("menu");
  }

  onInitialize(engine: Engine) {
    // Create menu manager
    this.menuManager = new MenuManager(engine);
    // Load initial menu state (changed to minigames)
    this.menuManager.setState("minigames");

    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    SoundManager.instance.play(Resources.MenuMusic, 0.3);
    // Reset state when entering the menu scene (changed to minigames)
    this.menuManager.setState("minigames");
  }

  onDeactivate() {
    SoundManager.instance.stopAll();
    SoundManager.instance.cleanup();
  }

  onPostDraw(ctx: ExcaliburGraphicsContext, elapsed: number) {
    this.menuManager.draw(ctx);
  }

  onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    this.menuManager.update(delta);
  }

  onTransition(direction: "in" | "out") {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
