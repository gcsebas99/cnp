import { Engine, ScreenElement, Color, Vector, Label, Font, GraphicsComponent } from "excalibur";
import { InputManager } from "@/managers/input-manager";

export class PauseManager {
  private static _instance: PauseManager;
  private engine!: Engine;
  private overlay!: ScreenElement;
  private menuBox!: ScreenElement;
  private isActive = false;
  private elementsCreated:boolean = false;
  private input: InputManager;

  private constructor(engine: Engine) {
    this.engine = engine;
    this.elementsCreated = false;
    this.input = InputManager.instance;
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

  private createOverlay() {
    const vp = this.engine.screen.viewport;

    // Semi-transparent overlay
    this.overlay = new ScreenElement({
      pos: Vector.Zero,
      anchor: Vector.Zero,
      z: 5000,
      width: vp.width,
      height: vp.height,
      color: new Color(0, 0, 0, 0.4),
      visible: false
    });

    // Centered box
    this.menuBox = new ScreenElement({
      pos: new Vector(vp.width / 2, vp.height / 2),
      anchor: Vector.Half,
      z: 5001,
      width: 300,
      height: 200,
      color: Color.Gray,
      visible: false
    });

    // Labels
    const font = new Font({ size: 24, color: Color.White });
    const continueLabel = new Label({ text: "[Continue]", pos: new Vector(0, -30), font });
    continueLabel.anchor = Vector.Half;
    this.menuBox.addChild(continueLabel);

    const quitLabel = new Label({ text: "[Quit]", pos: new Vector(0, 30), font });
    quitLabel.anchor = Vector.Half;
    this.menuBox.addChild(quitLabel);

    this.engine.currentScene.add(this.overlay);
    this.engine.currentScene.add(this.menuBox);



    // Input handling
    // this.engine.input.keyboard.on("press", (evt) => {
    //   if (!this.isActive) return;

    //   if (evt.key === Input.Keys.Escape) {
    //     this.resume();
    //   }
    //   if (evt.key === Input.Keys.Q) {
    //     // Simple quit → you can replace with orchestration callback
    //     this.engine.goToScene("mainMenu");
    //   }
    // });
  }

  /** Activate pause */
  public pause() {
    if (!this.elementsCreated) {
      this.createOverlay();
      this.elementsCreated = true;
    }
    this.isActive = true;
    this.overlay.get(GraphicsComponent).isVisible = true;
    this.menuBox.get(GraphicsComponent).isVisible = true;
    // Option A: stop gameplay updates manually via flag
    //this.engine.currentScene.isPaused = true;
  }

  /** Resume game */
  public resume() {
    this.isActive = false;
    this.overlay.get(GraphicsComponent).isVisible = false;
    this.menuBox.get(GraphicsComponent).isVisible = false;
    //this.engine.currentScene.isPaused = false;
  }

  public toggle() {
    this.isActive ? this.resume() : this.pause();
  }

  public get active() {
    return this.isActive;
  }
}


// In Excalibur.js v0.30.3, you cannot directly pause a single scene while the engine continues to run. When a scene is not the currently active one, it is considered "deactivated" and its update/draw loop is automatically stopped.
// The standard approach for creating a pause state is to switch to a dedicated "pause" scene while storing a reference to the previous scene.
// How to implement a pause scene
// Define your scenes: Create a normal scene for your game (GameScene) and a separate scene for your pause menu (PauseScene).
// Add a previousScene property: Inside your PauseScene, add a property to hold a reference to the GameScene.
// typescript
// export class PauseScene extends ex.Scene {
//   public bgSceneToRender?: ex.Scene;

//   //...
// }
// Go to the pause scene: In your GameScene, listen for a keypress (e.g., the 'P' key). When the key is pressed, set the previousScene property on the pause scene and switch to it.
// typescript
// export class GameScene extends ex.Scene {
//   public onInitialize(engine: ex.Engine) {
//     engine.input.keyboard.on('press', (evt) => {
//       if (evt.key === ex.Input.Keys.P) {
//         // Save a reference to the current scene
//         engine.scenes['pause'].bgSceneToRender = engine.scenes['game'];
//         // Switch to the pause scene
//         engine.goToScene('pause');
//       }
//     });
//   }
// }
// Draw the previous scene: To show the gameplay in the background, override the onPreDraw lifecycle method in your PauseScene. This will draw the previous scene's contents before drawing the pause menu on top.
// typescript
// export class PauseScene extends ex.Scene {
//   public bgSceneToRender?: ex.Scene;

//   public onPreDraw(ctx: ex.CanvasRenderingContext2D, delta: number) {
//     // Draw the last scene before the current scene is drawn
//     this.bgSceneToRender?.draw(ctx, delta);
//   }
// }
// Resume the game: Add logic to your PauseScene to return to the GameScene when the user unpauses.
// typescript
// export class PauseScene extends ex.Scene {
//   //...
//   public onInitialize(engine: ex.Engine) {
//     engine.input.keyboard.on('press', (evt) => {
//       if (evt.key === ex.Input.Keys.P) {
//         engine.goToScene('game');
//       }
//     });
//   }
// }