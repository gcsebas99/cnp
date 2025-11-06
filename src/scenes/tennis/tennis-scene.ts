import { Engine, Actor, vec, CollisionType, Vector } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { Resources as TennisResources } from "@/resources/tennis-resources";
import { Player } from "@/actors/player/player";
import { BallManager } from "@/managers/tennis/ball-manager";
import { TennisCollisionGroups } from "@/config/collision-groups";
import { TennisController } from "@/controllers/tennis-controller";
import { Racket } from "@/actors/tools/racket";
import { TennisOrchestration } from "@/scenes/tennis/tennis-orchestration";
import { GuiManager } from "@/managers/gui-manager";
import { MovingBackground } from "@/actors/objects/moving-background";
import { TennisOpponent } from "@/actors/npcs/tennis-opponent";
import { PlayerPuffVFX } from "@/actors/vfx/player-puff-vfx";
import { SolidWall } from "@/actors/objects/solid-wall";
import { PopupManager } from "@/managers/popup-manager";
import { animStartSprite } from "@/sprite-sheets/start";
import { GameState } from "@/types/game-state";
import { ServiceArea } from "@/actors/objects/service-area";
import { BounceTrapezoidPoints } from "@/types/bounce-trapezoid-points";

export class TennisScene extends BaseLdtkScene {
  private orchestration!: TennisOrchestration;
  private clouds?: MovingBackground;
  //
  private bouncePlayerPoints: BounceTrapezoidPoints = { topLeft: Vector.Zero, topRight: Vector.Zero, middleLeft: Vector.Zero, middleRight: Vector.Zero, bottomLeft: Vector.Zero, bottomRight: Vector.Zero };
  private bounceOpponentPoints: BounceTrapezoidPoints = { topLeft: Vector.Zero, topRight: Vector.Zero, middleLeft: Vector.Zero, middleRight: Vector.Zero, bottomLeft: Vector.Zero, bottomRight: Vector.Zero };
  private winnerBouncePlayerPoints: { left: Vector[]; right: Vector[] } = { left: [], right: [] };
  private winnerBounceOpponentPoints: { left: Vector[]; right: Vector[] } = { left: [], right: [] };
  //
  private pointWonActors: Actor[] = [];
  private pointLostActors: Actor[] = [];
  //
  private playerServiceMarkers: ServiceArea[] = [];
  private opponentServiceMarkers: ServiceArea[] = [];
  //
  private player?: Player;
  private opponent?: TennisOpponent;
  public ballManager?: BallManager;

  // game state
  private timeLeftMs: number = 2 * 60 * 1000; // 2 minutes
  private score: number = 0;
  //private isGameRunning: boolean = false;
  private state: GameState = GameState.Waiting;

  constructor() {
    super("tennis");
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {

    ldtk.registerEntityIdentifierFactory("LevelBorder", (props) => {
      const levelWall = new SolidWall(props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, `Wall-${props.entity.width}x${props.entity.height}`);
      return levelWall;
    });

    ldtk.registerEntityIdentifierFactory("ServiceMarker", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      let area:ServiceArea;
      if(courtSideValue === "player") {
        area = new ServiceArea(vec(props.worldPos.x, props.worldPos.y), "player");
        this.playerServiceMarkers.push(area);
      } else {
        area = new ServiceArea(vec(props.worldPos.x, props.worldPos.y), "opponent");
        this.opponentServiceMarkers.push(area);
      }
      //added to scene by ldtk
      return area;
    });

    ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
      this.player = new Player("neiti", props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
      this.player.controller = new TennisController();
      //add racket
      const racket = new Racket(this.player);
      this.player.equipTool(racket);
      return undefined;
    });

    ldtk.registerEntityIdentifierFactory("OpponentSpawn", (props) => {
      const opponent = new TennisOpponent(vec(props.worldPos.x, props.worldPos.y), vec(props.worldPos.x, props.worldPos.y));
      this.opponent = opponent;
      return opponent;
    });

    ldtk.registerEntityIdentifierFactory("Goal", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      const actor = new Actor({
        name: "Goal-" + courtSideValue,
        pos: vec(props.worldPos.x, props.worldPos.y),
        anchor: vec(props.entity.__pivot[0],props.entity.__pivot[1]),
        width: props.entity.width,
        height: props.entity.height,
      });
      actor.addTag(courtSideValue);
      actor.body.group = TennisCollisionGroups.Goal;
      actor.body.collisionType = CollisionType.Fixed;
      if(courtSideValue === "player") {
        this.pointLostActors.push(actor);
      } else {
        this.pointWonActors.push(actor);
      }
      return actor;
    });

    ldtk.registerEntityIdentifierFactory("BounceAreaMarker", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      const bounceMarkerId = props.entity.fieldInstances.find((f) => f.__identifier === "BounceMarkerId");
      const bounceMarkerIdValue = (bounceMarkerId?.__value as string) ?? "TopLeft";
      const bounceMarkerIdValueCamel = bounceMarkerIdValue.charAt(0).toLowerCase() + bounceMarkerIdValue.slice(1);
      if(courtSideValue === "player") {
        (this.bouncePlayerPoints as any)[bounceMarkerIdValueCamel] = vec(props.worldPos.x, props.worldPos.y);
      } else {
        (this.bounceOpponentPoints as any)[bounceMarkerIdValueCamel] = vec(props.worldPos.x, props.worldPos.y);
      }
      return undefined;
    });

    ldtk.registerEntityIdentifierFactory("WinnerAreaMarker", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      const markerSide = props.entity.fieldInstances.find((f) => f.__identifier === "WinnerMarkerSide");
      const markerSideValue = (markerSide?.__value as string).toLowerCase() ?? "left";
      if(courtSideValue === "player") {
        (this.winnerBouncePlayerPoints as any)[markerSideValue].push(vec(props.worldPos.x, props.worldPos.y));
      } else {
        (this.winnerBounceOpponentPoints as any)[markerSideValue].push(vec(props.worldPos.x, props.worldPos.y));
      }
      return undefined;
    });
  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.initGameGraphics(engine);
    this.state = GameState.Waiting;

    this.orchestration = new TennisOrchestration(engine, this);

    this.initBallManager();
    this.registerScore();


    //this.orchestration.start();
    this.orchestration.devStart();
  }

  private initGameGraphics(engine: Engine) {
    // Grass court background
    const tennisGrassCourt = new Actor({
      pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
      anchor: vec(0.5, 0.5)
    });
    tennisGrassCourt.graphics.use(TennisResources.BgTennisGrassCourt.toSprite());
    tennisGrassCourt.z = -2; // behind everything
    this.add(tennisGrassCourt);

    // Sky background
    // const skyChoice = Math.random() > 0.5 ? TennisResources.BgSkyClouds : TennisResources.BgSkyNightClouds;
    this.clouds = new MovingBackground({
      width: engine.drawWidth,
      height: engine.drawHeight,
      sprite: TennisResources.BgSkyNightClouds.toSprite(),
      spriteSize: 400,
      direction: "left",
      speed: 0.012,
    });
    this.add(this.clouds);
  }

  private initBallManager() {
    this.ballManager = new BallManager(this, this.player!, this.opponent!);
    this.ballManager.registerAreas({
      pointWonActors: this.pointWonActors,
      pointLostActors: this.pointLostActors,
      playerBouncePoints: this.bouncePlayerPoints,
      playerWinnerBouncePoints: this.winnerBouncePlayerPoints,
      opponentBouncePoints: this.bounceOpponentPoints,
      opponentWinnerBouncePoints: this.winnerBounceOpponentPoints,
      playerService: this.playerServiceMarkers,
      opponentService: this.opponentServiceMarkers,
    });
  }

  private registerScore() {
    this.on("tennis:point", (evt:any) => {
      if (evt.who === "player") {
        this.addScore(1);
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
    GuiManager.instance.show();
    GuiManager.instance.updateTimer(this.timeLeftMs);
    GuiManager.instance.updateScore(this.score);
  }

  public addPlayerToScene() {
    if (!this.player) return;
    const puff = new PlayerPuffVFX(this.player.pos, () => {
      if (!this.player) return;
      this.add(this.player);
    });

    this.add(puff);
  }

  public startGame() {
    this.state = GameState.Running;
    this.ballManager?.startFirstServe();
  }

  public endGame() {
    this.state = GameState.Finished;
    this.orchestration.end();
  }

  onActivate() {
    super.onActivate();
    // setTimeout(() => {
    //   InputManager.instance.disableExceptPause();
    // }, 5000);
    // setTimeout(() => {
    //   InputManager.instance.enable();
    // }, 10000);
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    this.orchestration.update(delta);
    //GuiManager.instance.tick(delta);

    if (this.state === GameState.Running) {
      // Decrease time
      this.timeLeftMs = Math.max(0, this.timeLeftMs - delta);
      GuiManager.instance.updateTimer(this.timeLeftMs);
    }

    if (this.timeLeftMs <= 0 && this.state === GameState.Running) {
      this.endGame();
    }
  }

  public addScore(points = 1) {
    this.score += points;
    Resources.ScoreUpSfx.play();
    GuiManager.instance.updateScore(this.score, true);
  }

  public getScore(): number {
    return this.score;
  }

}