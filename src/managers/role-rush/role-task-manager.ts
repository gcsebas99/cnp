import { Scene, Timer, Vector } from "excalibur";

export type RoleName =
  | "doctor"
  | "santa"
  | "soccer"
  | "mario"
  | "musician"
  | "chef";

export interface TaskChance {
  name: RoleName;
  chance: number; // 0–1 normalized
}

interface TaskSpot {
  spotIndex: number;
  task: string | null;
  spot: Vector;
  taken: boolean;
}

export interface RoleTaskManagerOptions {
  availableSpots: Vector[];
  tasks: RoleName[];
  minSpawnTime?: number; // seconds
  maxSpawnTime?: number; // seconds

  onTriggerSpawn: (task: RoleName, pos: Vector) => void;
  onTargetSpawn?: (task: RoleName, pos: Vector) => void;
}

export class RoleTaskManager {
  private scene: Scene;
  private timer!: Timer;

  private taskSpots: TaskSpot[] = [];

  // private availableSpots: Vector[] = [];
  // private inUseSpots: Vector[] = [];

  private availableTasks: TaskChance[] = [];
  private activeTasks: RoleName[] = [];

  private minSpawnTime: number;
  private maxSpawnTime: number;

  private running = false;

  private options: RoleTaskManagerOptions;

  constructor(scene: Scene, options: RoleTaskManagerOptions) {
    this.scene = scene;
    this.options = options;

    this.minSpawnTime = options.minSpawnTime ?? 3;
    this.maxSpawnTime = options.maxSpawnTime ?? 5;

    this.taskSpots = options.availableSpots.map((spot, index) => ({
      spotIndex: index,
      task: null,
      spot,
      taken: false,
    }));

    //this.availableSpots = [...options.availableSpots];

    const equalChance = 1 / options.tasks.length;
    this.availableTasks = options.tasks.map((t) => ({
      name: t,
      chance: equalChance,
    }));

    this.scene.on("trigger:touched", (evt: any) => {
      console.log("trigger:touched EVENT 1");
      const task = evt.task;
      this.notifyTriggerTouched(task);
    });

    this.scene.on("target:touched", (evt: any) => {
      const task = evt.task;
      this.resolveTask(task);
    });
  }

  // ---------------------------
  // Public API
  // ---------------------------

  start() {
    if (this.running) return;
    this.running = true;

    this.setupTimer();
    this.scene.addTimer(this.timer);
    this.timer.start();
  }

  stop() {
    if (!this.running) return;
    this.running = false;

    this.timer?.cancel();
  }

  /**
   * Called when player finishes task:
   * - task is removed from activeTasks
   * - task is returned to availableTasks with 5% base chance
   */
  resolveTask(taskName: RoleName) {
    this.releaseSpot(`target-${taskName}`);

    this.activeTasks = this.activeTasks.filter((t) => t !== taskName);

    const equalChance = 1 / this.options.tasks.length;

    this.availableTasks.push({
      name: taskName,
      chance: equalChance * 0.05, // 5% of normal chance
    });
  }

  /**
   * Called when player touches trigger:
   * - block new triggers
   * - spawn target
   */
  notifyTriggerTouched(task: RoleName) {
    this.releaseSpot(`trigger-${task}`);
    this.spawnTargetFor(task);
  }

  // ---------------------------
  // Timer Loop
  // ---------------------------

  private setupTimer() {
    this.timer = new Timer({
      interval: this.randomInterval(),
      fcn: () => {
        this.timer.interval = this.randomInterval();
        this.attemptScheduleNewTask();
      },
      repeats: true,
    });
  }

  private randomInterval() {
    return (
      1000 *
      (this.minSpawnTime +
        Math.random() * (this.maxSpawnTime - this.minSpawnTime))
    );
  }

  // ---------------------------
  // Scheduling logic
  // ---------------------------

  private attemptScheduleNewTask() {
    // Recovery system: increase chance of neglected tasks
    this.recoverTaskChances();

    const active = this.activeTasks.length;

    // Scheduling limits:
    if (active === 3) return; // full capacity
    if (active === 2) {
      if (Math.random() > 0.5) return; // 50% chance
    }
    // if 0 or 1 active => always schedule

    this.scheduleTask();
  }

  private scheduleTask() {
    if (this.availableTasks.length === 0) return;

    const task = this.weightedRandomTask();
    if (!task) return;

    // Remove from availableTasks
    this.availableTasks = this.availableTasks.filter(
      (t) => t.name !== task.name
    );
    this.activeTasks.push(task.name);

    // Select placement spot
    const availableSpots = this.getAvailableSpots();
    const randIndex = Math.floor(Math.random() * availableSpots.length);
    const spot = this.takeSpot(`trigger-${task.name}`, availableSpots[randIndex].spotIndex);

    // Spawn trigger actor through user callback
    this.options.onTriggerSpawn(task.name, spot);
  }

  private weightedRandomTask(): TaskChance | null {
    const sum = this.availableTasks.reduce((acc, t) => acc + t.chance, 0);
    if (sum <= 0) return null;

    let r = Math.random() * sum;
    for (const task of this.availableTasks) {
      if (r < task.chance) return task;
      r -= task.chance;
    }
    return this.availableTasks[0];
  }

  // ---------------------------
  // Chance Recovery
  // ---------------------------

  /**
   * After each scheduler attempt, all tasks grow +10% of normal chance
   * until they match the standard level.
   */
  private recoverTaskChances() {
    const standard = 1 / this.options.tasks.length;

    this.availableTasks = this.availableTasks.map((t) => {
      if (t.chance < standard) {
        t.chance = Math.min(standard, t.chance + standard * 0.1);
      }
      return t;
    });
  }

  // ---------------------------
  // Target Spawn
  // ---------------------------

  private spawnTargetFor(task: RoleName) {
    if (!this.options.onTargetSpawn) return;

    const availableSpots = this.getAvailableSpots();
    if (availableSpots.length === 0) return;

    const randIndex = Math.floor(Math.random() * availableSpots.length);
    const spot = this.takeSpot(`target-${task}`, availableSpots[randIndex].spotIndex);
    this.options.onTargetSpawn(task, spot);
  }

  private takeSpot(task: string, spotIndex: number): Vector {
    this.taskSpots = this.taskSpots.map((s) => {
      if (s.spotIndex === spotIndex) {
        s.taken = true;
        s.task = task;
        return s;
      }
      return s;
    });
    return this.taskSpots[spotIndex].spot;
  }

  private releaseSpot(task: string) {
    this.taskSpots = this.taskSpots.map((s) => {
      if (s.task === task) {
        s.taken = false;
        s.task = null;
        return s;
      }
      return s;
    });
  }

  private getAvailableSpots(): TaskSpot[] {
    return this.taskSpots.filter((s) => !s.taken);
  }
}
