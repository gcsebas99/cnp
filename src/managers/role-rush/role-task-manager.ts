import { Player } from "@/actors/player/player";
import { Hats } from "@/actors/wearables/hats-factory";
import { Scene, Timer, Vector } from "excalibur";
import { SoundManager } from "@/managers/sound-manager";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

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

  private availableTasks: TaskChance[] = [];
  private activeTasks: RoleName[] = [];

  private minSpawnTime: number;
  private maxSpawnTime: number;

  private running = false;

  private options: RoleTaskManagerOptions;

  private currentTask: RoleName | null = null;
  private taskStartTime: number = 0;


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
      const task = evt.task;
      const player = evt.player as Player;
      this.notifyTriggerTouched(task);

      switch (task) {
        case "chef":
          player.equipHat(Hats.Chef());
          break;
        case "doctor":
          player.equipHat(Hats.Doctor());
          break;
        case "musician":
          player.equipHat(Hats.Mozart());
          break;
        case "mario":
          player.equipHat(Hats.Mario());
          break;
        case "santa":
          player.equipHat(Hats.Santa());
          break;
        case "soccer":
          player.equipHat(Hats.Soccer());
          break;
      }
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
    if (this.currentTask !== taskName) return;

    this.releaseSpot(`target-${taskName}`);
    this.activeTasks = this.activeTasks.filter((t) => t !== taskName);

    // ---- SCORE CALCULATION ----
    const elapsed = (performance.now() - this.taskStartTime) / 1000;
    let points = 1;
    if (elapsed < 2) points = 4;
    else if (elapsed < 3) points = 3;
    else if (elapsed < 5) points = 2;

    this.scene.emit("task:completed", { task: taskName, elapsed, points });
    this.scene.emit("player:remove-hat");

    this.playTargetSfx(taskName);

    // ---- RESTORE SYSTEM ----
    this.currentTask = null;
    this.taskStartTime = 0;

    this.scene.emit("task:unlocked");

    // Return task with lowered chance
    const equalChance = 1 / this.options.tasks.length;
    this.availableTasks.push({ name: taskName, chance: equalChance * 0.05 });
  }

  playTargetSfx(taskName: RoleName) {
    switch (taskName) {
      case "chef":
        SoundManager.instance.playOnce(RoleRushResources.TargetChefSfx, 0.8);
        break;
      case "doctor":
        SoundManager.instance.playOnce(RoleRushResources.TargetDoctorSfx, 0.8);
        break;
      case "musician":
        SoundManager.instance.playOnce(RoleRushResources.TargetMusicianSfx, 0.8);
        break;
      case "mario":
        SoundManager.instance.playOnce(RoleRushResources.TargetMarioSfx, 0.8);
        break;
      case "santa":
        SoundManager.instance.playOnce(RoleRushResources.TargetSantaSfx, 0.8);
        break;
      case "soccer":
        SoundManager.instance.playOnce(RoleRushResources.TargetSoccerSfx, 0.8);
        break;
    }
  }

  /**
   * Called when player touches trigger:
   * - block new triggers
   * - spawn target
   */
  notifyTriggerTouched(task: RoleName) {
    // already doing a task → ignore
    if (this.currentTask) return;

    this.currentTask = task;
    this.taskStartTime = performance.now();

    // Make other triggers inactive
    this.scene.emit("task:locked", { activeTask: task });

    this.spawnTargetFor(task);
    this.scene.engine.clock.schedule(() => {
      this.releaseSpot(`trigger-${task}`);
    }, 150);
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

  public hasActiveTask(): boolean {
    return this.currentTask !== null;
  }
}
