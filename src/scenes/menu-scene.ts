import { Actor, Color, Engine, ExcaliburGraphicsContext, FadeInOut, vec, Vector } from "excalibur";
import { Resources } from "@/resources";
import { MenuManager } from "@/managers/menu-manager";
import { BaseScene } from "@/core/base-scene";
import { SoundManager } from "@/managers/sound-manager";
import { MovingBackground } from "@/actors/objects/moving-background";
import { MenuBgRandom } from "@/sprite-sheets/menu-bg";
import { InputManager } from "@/managers/input-manager";

export class MenuScene extends BaseScene {
  private menuManager!: MenuManager;
  private background?: MovingBackground;

  constructor() {
    super("menu");
  }

  onInitialize(engine: Engine) {
    // Create menu manager
    this.menuManager = new MenuManager(engine);
    // Load initial menu state (changed to minigames)
    this.menuManager.setState("minigames");

    Resources.MenuMusic.loop = true;

    // background
    const randomBg = MenuBgRandom[Math.floor(Math.random() * MenuBgRandom.length)];
    const directionOptions = ["left", "right", "up", "down", "diagonal-to-topleft", "diagonal-to-topright", "diagonal-to-bottomleft", "diagonal-to-bottomright"];
    const randomDirection = directionOptions[Math.floor(Math.random() * directionOptions.length)] as any;
    this.background = new MovingBackground({
      width: engine.drawWidth,
      height: engine.drawHeight,
      sprite: randomBg,
      spriteSize: 64,
      direction: randomDirection,
      speed: 0.05,
    });
    this.add(this.background);

    //add logo image: Resources.CYNLogo
    const logoActor = new Actor({
      pos: vec(engine.halfDrawWidth + 30, 200),
      anchor: Vector.Half,
      scale: vec(0.6, 0.6)
    });
    logoActor.graphics.use(Resources.CYNLogo.toSprite());
    this.add(logoActor);
  }

  onActivate() {
    SoundManager.instance.play(Resources.MenuMusic, 0.3);
    // Reset state when entering the menu scene (changed to minigames)
    this.menuManager.setState("minigames");
  }

  onDeactivate() {
    SoundManager.instance.stopAll();
    SoundManager.instance.cleanup();
    InputManager.instance.enable();
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
