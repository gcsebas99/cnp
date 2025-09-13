import { DefaultLoader, Engine, Keys } from "excalibur";

// TODO: maybe I'm not using DefaultLoader correctly?

export class LoaderScreen extends DefaultLoader {
  private splash?: ex.ImageSource;
  public isLoaded = () => false;
  private elapsed = 0;

  constructor(splash: ex.ImageSource) {
    super();
    this.splash = splash;
  }

  override async onAfterLoad(): Promise<void> {
    // Called after all assets are loaded
    this.isLoaded = () => true;
    console.log("Assets loaded Woooo");
  }

  override async onUserAction(): Promise<void> {
    // Return a promise that resolves when the user interacts with the loading screen in some way,
    // usually a click.
    //
    // It's important to implement this in order to unlock the audio context in the browser.
    // Browsers automatically prevent audio from playing until the user performs an action.

  }

  override onUpdate(engine: ex.Engine, delta: number): void {
    // Breathing effect timing
    this.elapsed += delta;

    // If assets are ready, check for input
    if (this.isLoaded()) {
      const gamepad = this.getGamepad(engine);

      if (
        engine.input.keyboard.wasPressed(Keys.Enter) ||
        engine.input.keyboard.wasPressed(Keys.Space) ||
        engine.input.keyboard.wasPressed(Keys.Escape) ||
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].some(idx => gamepad?.wasButtonPressed(idx))
      ) {
        engine.goToScene("menu");
      }
    }
  }

  override onDraw(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;

    // Draw splash background
    if (this.splash?.isLoaded()) {
      ctx.drawImage(this.splash.image, 0, 0, width, height);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    }

    // Show loading progress until assets are done
    if (!this.isLoaded) {
      ctx.fillStyle = "white";
      ctx.font = "40px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `Cargando... ${(this.progress * 100).toFixed(0)}%`,
        width / 2,
        height - 120
      );
      return;
    }

    // Breathing animation for "Press any key"
    const alpha = 0.5 + 0.5 * Math.sin(this.elapsed / 800);
    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = "white";
    ctx.font = "42px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona cualquier tecla",
      width / 2,
      height - 120
    );

    ctx.restore();
  }

  getGamepad(engine: Engine) {
    return [
      engine.input.gamepads.at(0),
      engine.input.gamepads.at(1),
      engine.input.gamepads.at(2),
      engine.input.gamepads.at(3),
    ].find((g) => g.connected)
  }
}