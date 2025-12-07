// obstacle-manager.ts
import { Engine, Scene, Vector } from "excalibur";
import { BasketDashObstacles } from "@/sprite-sheets/basket-dash-obstacles";
import { BasketObstacle } from "@/actors/objects/basket-obstacle";
import { Player } from "@/actors/player/player";

interface ObstacleManagerConfig {
  startPositions: Vector[];
  targetPositions: Vector[];
  playerRef: Player;
  minDistanceFromPlayer?: number;
}

export class ObstacleManager {
  private scene: Scene;
  private engine: Engine;
  private config: ObstacleManagerConfig;

  private readonly obstacleLifetimeMs = 7500;
  private readonly startDelayMs = 5000;
  private readonly delayBetweenIterationsMs = 13000;
  private readonly delaySecondObstacleMs = 3000;

  private availableObstacles: (keyof typeof BasketDashObstacles)[] = [];
  private availableTargets: Vector[] = [];

  private isRunning = false;
  private nextIterationTime: number | null = null; // used to prevent further scheduling

  constructor(engine: Engine, scene: Scene, config: ObstacleManagerConfig) {
    this.engine = engine;
    this.scene = scene;
    this.config = {
      minDistanceFromPlayer: 400,
      ...config
    };

    this.availableTargets = [...config.targetPositions];
    this.availableObstacles = Object.keys(BasketDashObstacles) as (keyof typeof BasketDashObstacles)[];
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Start after 5 seconds
    this.scheduleNextIteration(this.startDelayMs);
  }

  stop() {
    this.isRunning = false;
    this.nextIterationTime = null;
  }

  /** Schedules the next manager iteration */
  private scheduleNextIteration(delayMs: number) {
    if (!this.isRunning) return;

    const scheduledAt = this.engine.clock.now();
    this.nextIterationTime = scheduledAt + delayMs;

    this.engine.clock.schedule(() => {
      // If stopped after scheduling, prevent execution
      if (!this.isRunning) return;

      // If nextIterationTime was cleared or mismatch, do not run
      if (this.nextIterationTime !== scheduledAt + delayMs) return;

      this.runIteration();
    }, delayMs);
  }

  /** Main logic executed every cycle */
  private runIteration() {
    if (!this.isRunning) return;

    this.spawnOneObstacle();

    // 40% chance to spawn a second obstacle
    if (Math.random() < 0.4) {
      this.engine.clock.schedule(() => {
        if (!this.isRunning) return;
        this.spawnOneObstacle();
      }, this.delaySecondObstacleMs);
    }

    this.scheduleNextIteration(this.delayBetweenIterationsMs);
  }

  private spawnOneObstacle() {
    if (this.availableObstacles.length === 0) return;
    if (this.availableTargets.length === 0) return;

    const obstacleKey = this.pickRandom(this.availableObstacles);
    const sprite = BasketDashObstacles[obstacleKey];

    const startPos = this.pickRandom(this.config.startPositions);
    const targetPos = this.pickValidTarget();
    if (!targetPos) return;

    const obstacle = new BasketObstacle({
      sprite,
      startPos,
      targetPos,
      arcHeight: 350,
      flightDuration: 2000,
      lifetime: this.obstacleLifetimeMs,
    });

    obstacle.on("obstacle-removed", () => {
      this.availableObstacles.push(obstacleKey);
      this.availableTargets.push(targetPos);
    });

    // Mark selections as used
    this.availableObstacles = this.availableObstacles.filter(k => k !== obstacleKey);
    this.availableTargets = this.availableTargets.filter(pos => pos !== targetPos);

    this.scene.add(obstacle);
  }

  private pickValidTarget(): Vector | null {
    const { playerRef, minDistanceFromPlayer } = this.config;

    const valid = this.availableTargets.filter(
      spot => spot.distance(playerRef.pos) >= minDistanceFromPlayer!
    );

    if (valid.length === 0) return null;
    return this.pickRandom(valid);
  }

  private pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
