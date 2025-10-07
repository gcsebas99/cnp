import { Engine, Scene } from "excalibur";

export abstract class GameOrchestration {
  protected engine: Engine;
  protected scene: Scene;
  protected isRunning = false;

  constructor(engine: Engine, scene: Scene) {
    this.engine = engine;
    this.scene = scene;
  }

  abstract start(): void;
  abstract end(): void;
}
