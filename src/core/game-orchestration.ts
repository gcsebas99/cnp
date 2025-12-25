import { Engine, Scene } from "excalibur";
import { TimelineScheduler } from "@/core/timeline-scheduler";
import { Player } from "@/actors/player/player";

export abstract class GameOrchestration {
  protected engine: Engine;
  protected scene: Scene;
  protected player: Player;
  protected timeline?: TimelineScheduler;
  protected isRunning = false;

  constructor(engine: Engine, scene: Scene, player: Player) {
    this.engine = engine;
    this.scene = scene;
    this.player = player;
  }

  abstract start(): void;
  abstract play(): void;
  abstract end(): void;
}
