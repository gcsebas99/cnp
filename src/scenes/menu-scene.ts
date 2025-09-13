import { Color, Engine, ExcaliburGraphicsContext, FadeInOut, Scene } from "excalibur";
import { Resources } from "../resources";
import { MenuManager } from "../managers/menu-manager";
import { InputManager } from "../managers/input-manager";

export class MenuScene extends Scene {
  private menuManager!: MenuManager;

  constructor() {
    super();
  }

  onInitialize(engine: Engine) {
    // Create menu manager
    this.menuManager = new MenuManager(engine);
    // Load initial menu state
    this.menuManager.setState("main");

    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    // Reset state when entering the menu scene
    this.menuManager.setState("main");
    Resources.MenuMusic.play();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
    InputManager.instance.clearAllListeners();
  }

  onPostDraw(ctx: ExcaliburGraphicsContext, elapsed: number) {
    this.menuManager.draw(ctx);
  }

  onPreUpdate(engine: Engine, delta: number) {
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

// export class MenuScene extends Scene {

//   public onInitialize(engine: Engine) {
//     this.backgroundColor = Color.Purple;
//   }

//   public onActivate() {
//     const input = InputManager.instance;

//     input.onKey("press", (evt) => {
//       if (evt.key === Keys.Enter) {
//         console.log("Start game!");
//       }
//     });

//     input.onGamepadButton((evt) => {
//       console.log("Gamepad button:", evt.button);
//     });
//   }

//   public onDeactivate(ctx: ex.SceneActivationContext<undefined>): void {
//     InputManager.instance.clearAllListeners();
//   }
// }
