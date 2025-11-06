import { Engine, Scene } from "excalibur";
import { TimelineScheduler } from "@/core/timeline-scheduler";

export abstract class GameOrchestration {
  protected engine: Engine;
  protected scene: Scene;
  protected timeline?: TimelineScheduler;
  protected isRunning = false;

  constructor(engine: Engine, scene: Scene) {
    this.engine = engine;
    this.scene = scene;
  }

  abstract start(): void;
  abstract play(): void;
  abstract end(): void;
}
