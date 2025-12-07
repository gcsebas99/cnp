import { Color, Engine, vec, Vector } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { JTPlatform } from "@/actors/objects/jt-platform";
import { RoleRushTerrainGrid } from "@/sprite-sheets/role-rush-terrain";
import { MovingBackground } from "@/actors/objects/moving-background";
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

const GAME_TIME_MS = 60 * 1000; // 1 minute

export class RoleRushScene extends BaseLdtkScene {
  private orchestration!: RoleRushOrchestration;
  private background?: MovingBackground;
  private door?: RoleRushDoor;
  private elevator?: PlatformWithFan;
  private roleSpawn?: Vector[] = [];
  private roleTaskManager?: RoleTaskManager;

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
      this.player = new Player("chuti", props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
      this.player.controller = new RoleRushController();
      return this.player;
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

    this.background = new MovingBackground({
      width: engine.drawWidth,
      height: engine.drawHeight,
      sprite: RoleRushResources.BgBlue.toSprite(),
      spriteSize: 64,
      direction: "down",
      speed: 0.05,
    });
    this.add(this.background);

    //add a door
    this.door = new RoleRushDoor(1088, 696);
    this.add(this.door);

    //add an elevator
    this.elevator = new PlatformWithFan(1856, 1150, 1856, 320);
    this.add(this.elevator);


    //this is just for bg testing
    setTimeout(() => {
      if(this.background) {
        this.background.actions.fade(0, 500).callMethod(() => {
          if(this.background) {
            this.background.kill();
            this.background = undefined;
          }
        });
        //add a new background with different settings
        const background2 = new MovingBackground({
          width: engine.drawWidth,
          height: engine.drawHeight,
          sprite: RoleRushResources.BgBrown.toSprite(),
          spriteSize: 64,
          direction: "up",
          speed: 0.1,
          z: -4
        });
        this.add(background2);
      }
    }, 3000);


    // move to game orchestration
    //GuiManager.instance.show();
    //GuiManager.instance.setTimer(3 * 60 * 1000);

    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.15;

    this.initRoleTaskManager();

    this.orchestration = new RoleRushOrchestration(engine, this);
    this.orchestration.devStart();
  }

  onActivate() {
    super.onActivate();
    SoundManager.instance.playOnce(Resources.MenuMusic, 0.8);
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  private initRoleTaskManager() {
    this.roleTaskManager = new RoleTaskManager(this, {
      availableSpots: this.roleSpawn ?? [],
      tasks: ["doctor", "chef", "musician", "soccer", "mario", "santa"],
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
    // this.ballManager.registerAreas({
    //   pointWonActors: this.pointWonActors,
    //   pointLostActors: this.pointLostActors,
    //   playerBouncePoints: this.bouncePlayerPoints,
    //   playerWinnerBouncePoints: this.winnerBouncePlayerPoints,
    //   opponentBouncePoints: this.bounceOpponentPoints,
    //   opponentWinnerBouncePoints: this.winnerBounceOpponentPoints,
    //   playerService: this.playerServiceMarkers,
    //   opponentService: this.opponentServiceMarkers,
    // });
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

  // private addRoleTask() {
  //   // const targetYAdjustment = {
  //   //   Patient: 0,
  //   //   ToadAndToadette: 0,
  //   //   ChristmasTree: -16,
  //   //   Piano: -8,
  //   //   SoccerGoal: 16,
  //   //   Stove: 16,
  //   // };

  //   // const pos11 = this.roleSpawn?.[10];

  //   // const roleTrigger1 = new RoleTrigger(InjectionSprite.default, InjectionSprite.highlight, 1280, 1088);
  //   // this.add(roleTrigger1);

  //   // const roleTrigger2 = new RoleTrigger(BenchSprite.default, BenchSprite.highlight, 1408, 1088);
  //   // this.add(roleTrigger2);

  //   // const roleTrigger3 = new RoleTrigger(GiftSprite.default, GiftSprite.highlight, 1536, 1088);
  //   // this.add(roleTrigger3);

  //   // const roleTrigger4 = new RoleTrigger(SoccerBallSprite.default, SoccerBallSprite.highlight, 1664, 1088);
  //   // this.add(roleTrigger4);

  //   // const roleTrigger5 = new RoleTrigger(SpoonSprite.default, SpoonSprite.highlight, 1792, 1088);
  //   // this.add(roleTrigger5);

  //   // const roleTrigger6 = new RoleTrigger(StarSprite.default, StarSprite.highlight, 1920, 1088);
  //   // this.add(roleTrigger6);


  //   // const roleTarget1 = new RoleTarget(RoleRushResources.PatientTarget.toSprite(), 256, 1072, targetYAdjustment.Patient);
  //   // this.add(roleTarget1);

  //   // const roleTarget2 = new RoleTarget(RoleRushResources.ToadAndToadetteTarget.toSprite(), 512, 1072, targetYAdjustment.ToadAndToadette, 0.9);
  //   // this.add(roleTarget2);

  //   // const roleTarget3 = new RoleTarget(RoleRushResources.ChristmasTreeTarget.toSprite(), 768, 1072, targetYAdjustment.ChristmasTree, 1.2);
  //   // this.add(roleTarget3);

  //   // const roleTarget4 = new RoleTarget(RoleRushResources.PianoTarget.toSprite(), pos11?.x ?? 128, pos11?.y ?? 880, targetYAdjustment.Piano, 0.9);
  //   // this.add(roleTarget4);

  //   // const roleTarget5 = new RoleTarget(RoleRushResources.SoccerGoalTarget.toSprite(), 320, 880, targetYAdjustment.SoccerGoal, 0.7);
  //   // this.add(roleTarget5);

  //   // const roleTarget6 = new RoleTarget(RoleRushResources.StoveTarget.toSprite(), 576, 880, targetYAdjustment.Stove, 0.8);
  //   // this.add(roleTarget6);
  // }

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
      }
    });
  }

  public showStartPromptAndGUI() {
    PopupManager.instance.show({
      text: "Start!",
      duration: 1500,
      soundAppear: Resources.ReadyStartSfx,
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
    // if (!this.player) return;
    // const puff = new PlayerPuffVFX(this.player.pos, () => {
    //   if (!this.player) return;
    //   this.add(this.player);
    // });

    // this.add(puff);
  }

  public startGame() {
    this.state = GameState.Running;
    this.roleTaskManager?.start();
    //this.ballManager?.startFirstServe();
  }

  public endGame() {
    this.state = GameState.Finished;
    this.roleTaskManager?.stop();
    this.orchestration.end();
  }
}
