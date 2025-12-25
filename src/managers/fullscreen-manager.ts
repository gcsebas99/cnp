import { Engine } from "excalibur";

export class FullscreenManager {
  private static _instance: FullscreenManager | undefined = undefined;
  private engine!: Engine;
  private isFullscreen: boolean = false;

  public static dispose() {
    FullscreenManager._instance = undefined;
    // Remove any static listeners or references
  }

  private constructor(engine: Engine) {
    this.engine = engine;
  }

  public static init(engine: Engine) {
    if (!FullscreenManager._instance) {
      FullscreenManager._instance = new FullscreenManager(engine);
    }
    return FullscreenManager._instance;
  }

  public static get instance() {
    if (!FullscreenManager._instance) {
      throw new Error("FullscreenManager not initialized. Call FullscreenManager.init(engine) first.");
    }
    return FullscreenManager._instance;
  }

  public toggleFullscreen() {
    if (!this.isFullscreen) {
      this.engine.screen.enterFullscreen();
      this.isFullscreen = true;
    } else {
      this.engine.screen.exitFullscreen();
      this.isFullscreen = false;
    }
  }

}
