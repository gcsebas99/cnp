import { Engine, Actor, vec, CollisionType } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { Resources as TennisResources } from "@/resources/tennis-resources";
import { Player } from "@/actors/player/player";
import { Area } from "@/types/area";
import { BallManager } from "@/managers/tennis/ball-manager";
import { TennisCollisionGroups } from "@/config/collision-groups";
import { TennisController } from "@/controllers/tennis-controller";
import { Racket } from "@/actors/tools/racket";
//import { TennisOrchestration } from "@/scenes/tennis/tennis-orchestration";
import { GuiManager } from "@/managers/gui-manager";
import { MovingBackground } from "@/actors/objects/moving-background";

export class TennisScene extends BaseLdtkScene {
  //private orchestration!: TennisOrchestration;
  private clouds?: MovingBackground;

  private ballSpawns: Area[] = [];
  private opponentSpawns: Area[] = [];
  private bouncePlayerArea: Area|null = null;
  private bounceOpponentArea: Area|null = null;
  private pointWonActors: Actor[] = [];
  private pointLostActors: Actor[] = [];

  private player?: Player;
  public ballManager?: BallManager;

  constructor() {
    super("tennis");
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {

    ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
      this.player = new Player("neiti", props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
      this.player.controller = new TennisController();
      //add racket
      const racket = new Racket(this.player);
      this.player.equipTool(racket);
      return this.player;
    });

    ldtk.registerEntityIdentifierFactory("BallSpawn", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height, side: courtSideValue as "player" | "opponent" };
      //console.log("BallSpawn rect", rect);
      this.ballSpawns.push(rect);
      return undefined;
    });

    ldtk.registerEntityIdentifierFactory("OpponentSpawn", (props) => {
      const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height };
      //console.log("OpponentSpawn rect", rect);
      this.opponentSpawns.push(rect);

      const actor = new Actor({
        name: "OpponentArea",
        pos: vec(props.worldPos.x, props.worldPos.y),
        anchor: vec(props.entity.__pivot[0],props.entity.__pivot[1]),
        width: props.entity.width,
        height: props.entity.height,
      });
      actor.body.group = TennisCollisionGroups.Opponent;
      actor.body.collisionType = CollisionType.Fixed;
      return actor;
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

      //console.log("GOAL", props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, actor);
      return actor;
    });

    ldtk.registerEntityIdentifierFactory("BounceArea", (props) => {
      const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
      const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
      const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height, side: courtSideValue as "player" | "opponent" };
      if(courtSideValue === "player") {
        this.bouncePlayerArea = rect;
      } else {
        this.bounceOpponentArea = rect;
      }
      //console.log("BounceArea rect", rect);
      return undefined;
    });

    // timeout for now, it actually should wait for registerEntityIdentifierFactory calls to finish
    setTimeout(() => {
      this.ballManager = new BallManager(this, this.player!);
      this.ballManager.registerAreas({
        ballSpawnRects: this.ballSpawns,
        opponentSpawnRects: this.opponentSpawns,
        pointWonActors: this.pointWonActors,
        pointLostActors: this.pointLostActors,
        bouncePlayer: this.bouncePlayerArea!,
        bounceOpponent: this.bounceOpponentArea!
      });
      console.log("||--Initial serve by opponent!!!!!!!");
      this.ballManager.serveBy("opponent");
    }, 1200);

  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);
    //this.orchestration = new TennisOrchestration(engine, this);

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




    // move to game orchestration
    GuiManager.instance.show();
    GuiManager.instance.setTimer(2 * 60 * 1000);


    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    super.onActivate();
    //InputManager.instance.updateConnectedGamepads();
    //Resources.MenuMusic.play();
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
    GuiManager.instance.tick(delta);
  }

  // override onPostUpdate(engine: ex.Engine, delta: number) {
  //   InputManager.instance.update();
  // }
}