import { Engine, DefaultLoader } from "excalibur";

export class CustomLoader extends DefaultLoader {
  override onUpdate(engine: Engine, elapsedMilliseconds: number): void {
    // Perform something every tick, for example collect time elapsed or check
    // what file names have been loaded for drawing!
  }
  override onDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Returns the progress of the loader as a number between [0, 1] inclusive.
    //console.log("||--Progress", this.progress);
  }
  override async onUserAction(): Promise<void> {
    console.log("||--onUserAction", this.progress);
    // Return a promise that resolves when the user interacts with the loading screen in some way,
    // usually a click.
    //
    // It's important to implement this in order to unlock the audio context in the browser.
    // Browsers automatically prevent audio from playing until the user performs an action.

  }
  override async onBeforeLoad(): Promise<void> {
    // Overrideable lifecycle method, called directly before loading starts
    // Useful if you need to do anything to the screen/viewport
  }
  override async onAfterLoad(): Promise<void> {
    // Overrideable lifecycle method, called after loading has completed
    // Useful if you need to do anything to the screen/viewport
  }
}