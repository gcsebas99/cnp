import { Color, Engine, Timer, vec, Vector } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { JTPlatform } from "@/actors/objects/jt-platform";
import { RoleRushTerrainGrid } from "@/sprite-sheets/role-rush-terrain";
import { Direction, MovingBackground } from "@/actors/objects/moving-background";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
import { Player } from "@/actors/player/player";
import { RoleRushController } from "@/controllers/role-rush-controller";
import { SolidWall } from "@/actors/objects/solid-wall";
import { RoleRushDoor } from "@/actors/objects/role-rush-door";
import { PlatformWithFan } from "@/actors/objects/platform-with-fan";
import { SoundManager } from "@/managers/sound-manager";
import { RoleTrigger } from "@/actors/objects/role-trigger";
import { InjectionSprite } from "@/sprite-sheets/role-trigger/injection";
import { BenchSprite } from "@/sprite-sheets/role-trigger/bench";
import { GiftSprite } from "@/sprite-sheets/role-trigger/gift";
import { SoccerBallSprite } from "@/sprite-sheets/role-trigger/soccer-ball";
import { SpoonSprite } from "@/sprite-sheets/role-trigger/spoon";
import { StarSprite } from "@/sprite-sheets/role-trigger/star";
import { RoleTarget } from "@/actors/objects/role-target";
import { RoleName, RoleTaskManager } from "@/managers/role-rush/role-task-manager";
import { ScoreManager } from "@/managers/score-manager";
import { PopupManager } from "@/managers/popup-manager";
import { GuiManager } from "@/managers/gui-manager";
import { animStartSprite } from "@/sprite-sheets/start";
import { GameState } from "@/types/game-state";
import { RoleRushOrchestration } from "@/scenes/role-rush/role-rush-orchestration";
import { PersistentGameStateManager } from "@/managers/persistent-game-state-manager";
import { InputManager } from "@/managers/input-manager";
import { PlayerPuffVFX } from "@/actors/vfx/player-puff-vfx";

const ROLE_RUSH_BACKGROUNDS = [
  RoleRushResources.BgBlue,
  RoleRushResources.BgBrown,
  RoleRushResources.BgGray,
  RoleRushResources.BgGreen,
  RoleRushResources.BgPink,
  RoleRushResources.BgPurple,
  RoleRushResources.BgYellow,
];

const ROLE_RUSH_DIRECTIONS: Direction[] = [
  "left",
  "right",
  "up",
  "down",
  "diagonal-to-topleft",
  "diagonal-to-topright",
  "diagonal-to-bottomleft",
  "diagonal-to-bottomright",
];

const GAME_TIME_MS = 90 * 1000; // 1.5 minutes

export class RoleRushScene extends BaseLdtkScene {
  private orchestration!: RoleRushOrchestration;
  private door?: RoleRushDoor;
  private elevator?: PlatformWithFan;
  private roleSpawn?: Vector[] = [];
  private roleTaskManager?: RoleTaskManager;
  private roleTriggers: RoleTrigger[] = [];

  private background?: MovingBackground;
  private backgroundTimer?: Timer;

  //player
  private player?: Player;

  private state: GameState = GameState.Waiting;

  constructor() {
    super("roleRush");
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {

    ldtk.registerEntityIdentifierFactory("JumpThroughPlatform", (props) => {
      const jtPlatform = new JTPlatform(props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, RoleRushTerrainGrid.groundPink, 64, `JTP-${props.entity.width}x${props.entity.height}`, -2);
      return jtPlatform;
    });

    ldtk.registerEntityIdentifierFactory("LevelBorder", (props) => {
      const levelWall = new SolidWall(props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, `Wall-${props.entity.width}x${props.entity.height}`);
      return levelWall;
    });

    ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
      const playerId = PersistentGameStateManager.getSelectedPlayer() || "chuti";
      this.player = new Player(playerId, props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
      this.player.controller = new RoleRushController();
      return undefined;
    });

    ldtk.registerEntityIdentifierFactory("RoleSpawnMarker", (props) => {
      this.roleSpawn?.push(vec(props.worldPos.x, props.worldPos.y));
      return undefined;
    });

  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);

    this.scoreManager = new ScoreManager(engine, 0, GAME_TIME_MS);
    this.registerScore();

    this.startBackgroundCycle(engine);

    //add a door
    this.door = new RoleRushDoor(1088, 696);
    this.add(this.door);

    //add an elevator
    this.elevator = new PlatformWithFan(1856, 1150, 1856, 320);
    this.add(this.elevator);

    this.initRoleTaskManager();

    this.orchestration = new RoleRushOrchestration(engine, this, this.player!);
    this.orchestration.start();
  }

  onActivate() {
    super.onActivate();
  }

  onDeactivate() {
    SoundManager.instance.stopAll();

    this.backgroundTimer?.cancel();
    this.backgroundTimer = undefined;

    if (this.background) {
      this.background.kill();
      this.background = undefined;
    }
  }

  private startBackgroundCycle(engine: Engine) {
    // spawn initial background immediately
    this.spawnRandomBackground(engine);

    this.backgroundTimer = new Timer({
      interval: 15000,
      repeats: true,
      fcn: () => this.spawnRandomBackground(engine),
    });

    this.addTimer(this.backgroundTimer);
    this.backgroundTimer.start();
  }

  private spawnRandomBackground(engine: Engine) {
    const bgResource = ROLE_RUSH_BACKGROUNDS[Math.floor(Math.random() * ROLE_RUSH_BACKGROUNDS.length)];

    const direction = ROLE_RUSH_DIRECTIONS[Math.floor(Math.random() * ROLE_RUSH_DIRECTIONS.length)];

    const newBg = new MovingBackground({
      width: engine.drawWidth,
      height: engine.drawHeight,
      sprite: bgResource.toSprite(),
      spriteSize: 64,
      direction,
      speed: 0.05 + Math.random() * 0.05, // subtle variation
      z: -5,
    });

    // Fade out old background
    if (this.background) {
      const oldBg = this.background;
      oldBg.actions.fade(0, 600).callMethod(() => oldBg.kill());
    }

    newBg.graphics.opacity = 0;
    this.add(newBg);
    newBg.actions.fade(1, 600);

    this.background = newBg;
  }

  private initRoleTaskManager() {
    this.roleTaskManager = new RoleTaskManager(this, {
      availableSpots: this.roleSpawn ?? [],
      tasks: ["santa", "doctor", "chef", "musician", "soccer", "mario"],
      // minSpawnTime: 4,
      // maxSpawnTime: 7,
      onTriggerSpawn: (task: RoleName, pos: Vector) => {
        console.log(`Spawn Role Trigger: ${task} at (${pos.x}, ${pos.y})`);
        this.spawnRoleTrigger(task, pos);
      },
      onTargetSpawn: (task: RoleName, pos: Vector) => {
        console.log(`Spawn Role Target: ${task} at (${pos.x}, ${pos.y})`);
        this.spawnRoleTarget(task, pos);
      }
    });
    this.roleTriggers = [];

    this.on("task:locked", (event: unknown) => {
      const evt = event as { activeTask: RoleName };
      //remove from roleTriggers where t.taskName === evt.activeTask
      this.roleTriggers = this.roleTriggers.filter(t => t.taskName !== evt.activeTask);

      console.log("||--LOCKING triggers", this.roleTriggers.map(t => t.taskName));
      this.roleTriggers.forEach(t => t.setDisabled(true));
    });

    this.on("task:unlocked", () => {
      console.log("||--UNlocking triggers", this.roleTriggers.map(t => t.taskName));
      this.roleTriggers.forEach(t => t.setDisabled(false));
    });

    this.on("player:remove-hat", () => {
      this.player?.removeHat();
    });
  }

  private spawnRoleTrigger(task: RoleName, pos: Vector) {
    let defaultSprite;
    let outlineSprite;
    switch (task) {
      case "doctor":
        defaultSprite = InjectionSprite.default;
        outlineSprite = InjectionSprite.highlight;
        break;
      case "chef":
        defaultSprite = SpoonSprite.default;
        outlineSprite = SpoonSprite.highlight;
        break;
      case "musician":
        defaultSprite = BenchSprite.default;
        outlineSprite = BenchSprite.highlight;
        break;
      case "soccer":
        defaultSprite = SoccerBallSprite.default;
        outlineSprite = SoccerBallSprite.highlight;
        break;
      case "mario":
        defaultSprite = StarSprite.default;
        outlineSprite = StarSprite.highlight;
        break;
      case "santa":
        defaultSprite = GiftSprite.default;
        outlineSprite = GiftSprite.highlight;
        break;
      default:
        return;
    }
    if (!defaultSprite || !outlineSprite) return;
    const roleTrigger = new RoleTrigger(task, defaultSprite, outlineSprite, pos.x, pos.y);
    roleTrigger.setDisabled(this.roleTaskManager?.hasActiveTask() ?? false);
    this.roleTriggers.push(roleTrigger);
    this.add(roleTrigger);
  }

  private spawnRoleTarget(task: RoleName, pos: Vector) {
    let sprite;
    let yAdjustment = 0;
    let scaleAdjustment = 1.0;
    switch (task) {
      case "doctor":
        sprite = RoleRushResources.PatientTarget.toSprite();
        break;
      case "chef":
        sprite = RoleRushResources.StoveTarget.toSprite();
        yAdjustment = 16;
        scaleAdjustment = 0.8;
        break;
      case "musician":
        sprite = RoleRushResources.PianoTarget.toSprite();
        yAdjustment = -8;
        scaleAdjustment = 0.9;
        break;
      case "soccer":
        sprite = RoleRushResources.SoccerGoalTarget.toSprite();
        yAdjustment = 16;
        scaleAdjustment = 0.7;
        break;
      case "mario":
        sprite = RoleRushResources.ToadAndToadetteTarget.toSprite();
        scaleAdjustment = 0.9;
        break;
      case "santa":
        sprite = RoleRushResources.ChristmasTreeTarget.toSprite();
        yAdjustment = -16;
        scaleAdjustment = 1.2;
        break;
      default:
        return;
    }
    if (!sprite) return;
    const roleTarget = new RoleTarget(task, sprite, pos.x, pos.y, yAdjustment, scaleAdjustment);
    this.add(roleTarget);
  }

  override onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    this.orchestration.update(delta);
    if (this.state === GameState.Running) {
      // Decrease time
      this.scoreManager?.setTimeLeft(delta);
      GuiManager.instance.updateTimer(this.scoreManager!.getTimeLeftMs());
    }

    if (this.scoreManager!.isTimeUp() && this.state === GameState.Running) {
      this.endGame();
    }
  }

  private registerScore() {
    this.on("task:completed", (evt:any) => {
      if (evt.points) {
        this.scoreManager?.add(evt.points);
        GuiManager.instance.updateScore(this.scoreManager!.getScore(), true);
      }
    });
  }

  public showStartPromptAndGUI() {
    PopupManager.instance.show({
      text: "Start!",
      duration: 1500,
      soundAppear: RoleRushResources.StartSfx,
      sprite: animStartSprite,
      animationDelay: 800,
      soundAppearDelay: 500,
    });
    GuiManager.instance.show(Color.Orange, Color.Violet, Color.Orange, Color.Violet);
    GuiManager.instance.updateTimer(this.scoreManager!.getTimeLeftMs());
    GuiManager.instance.updateScore(this.scoreManager!.getScore());
  }

  public getScore(): number {
    return this.scoreManager!.getScore();
  }

  public addPlayerToScene() {
    if (!this.player) return;
    const puff = new PlayerPuffVFX(this.player.pos, () => {
      if (!this.player) return;
      this.player.setFacing(false);
      this.add(this.player);
    });

    this.add(puff);
  }

  public startGame() {
    this.state = GameState.Running;
    this.roleTaskManager?.start();
    InputManager.instance.enable();
  }

  public endGame() {
    this.state = GameState.Finished;
    this.roleTaskManager?.stop();
    this.orchestration.end();
  }
}
