import { Engine, FadeInOut, Color } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { InputManager } from "@/managers/input-manager";

export class RoleRushScene extends BaseLdtkScene {
  // private clouds?: Actor;

  // private ballSpawns: Area[] = [];
  // private opponentSpawns: Area[] = [];
  // private bouncePlayerArea: Area|null = null;
  // private bounceOpponentArea: Area|null = null;
  // private pointWonActors: Actor[] = [];
  // private pointLostActors: Actor[] = [];

  // public ballManager?: BallManager;

  constructor() {
    super();
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {

    // ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
    //   //console.log("PlayerSpawn at", props.worldPos.x, props.worldPos.y);
    //   const player = new Player("neiti", props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
    //   return player;
    // });

    // ldtk.registerEntityIdentifierFactory("BallSpawn", (props) => {
    //   const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
    //   const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
    //   const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height, side: courtSideValue as "player" | "opponent" };
    //   //console.log("BallSpawn rect", rect);
    //   this.ballSpawns.push(rect);
    //   return undefined;
    // });

    // ldtk.registerEntityIdentifierFactory("OpponentSpawn", (props) => {
    //   const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height };
    //   //console.log("OpponentSpawn rect", rect);
    //   this.opponentSpawns.push(rect);

    //   const actor = new Actor({
    //     name: "OpponentArea",
    //     pos: vec(props.worldPos.x, props.worldPos.y),
    //     anchor: vec(props.entity.__pivot[0],props.entity.__pivot[1]),
    //     width: props.entity.width,
    //     height: props.entity.height,
    //   });
    //   actor.body.group = TennisCollisionGroups.Opponent;
    //   actor.body.collisionType = CollisionType.Fixed;
    //   return actor;
    // });

    // ldtk.registerEntityIdentifierFactory("Goal", (props) => {
    //   const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
    //   const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
    //   const actor = new Actor({
    //     name: "Goal-" + courtSideValue,
    //     pos: vec(props.worldPos.x, props.worldPos.y),
    //     anchor: vec(props.entity.__pivot[0],props.entity.__pivot[1]),
    //     width: props.entity.width,
    //     height: props.entity.height,
    //   });
    //   actor.addTag(courtSideValue);
    //   actor.body.group = TennisCollisionGroups.Goal;
    //   actor.body.collisionType = CollisionType.Fixed;
    //   if(courtSideValue === "player") {
    //     this.pointLostActors.push(actor);
    //   } else {
    //     this.pointWonActors.push(actor);
    //   }

    //   //console.log("GOAL", props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, actor);
    //   return actor;
    // });

    // ldtk.registerEntityIdentifierFactory("BounceArea", (props) => {
    //   const courtSide = props.entity.fieldInstances.find((f) => f.__identifier === "CourtSide");
    //   const courtSideValue = (courtSide?.__value as string).toLowerCase() ?? "player";
    //   const rect:Area = { x: props.worldPos.x, y: props.worldPos.y, width: props.entity.width, height: props.entity.height, side: courtSideValue as "player" | "opponent" };
    //   if(courtSideValue === "player") {
    //     this.bouncePlayerArea = rect;
    //   } else {
    //     this.bounceOpponentArea = rect;
    //   }
    //   //console.log("BounceArea rect", rect);
    //   return undefined;
    // });

    // // timeout for now, it actually should wait for registerEntityIdentifierFactory calls to finish
    // setTimeout(() => {
    //   this.ballManager = new BallManager(this);
    //   this.ballManager.registerAreas({
    //     ballSpawnRects: this.ballSpawns,
    //     opponentSpawnRects: this.opponentSpawns,
    //     pointWonActors: this.pointWonActors,
    //     pointLostActors: this.pointLostActors,
    //     bouncePlayer: this.bouncePlayerArea!,
    //     bounceOpponent: this.bounceOpponentArea!
    //   });
    //   console.log("||--Initial serve by opponent!!!!!!!");
    //   this.ballManager.serveBy("opponent");
    // }, 1200);

  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);



    // // Grass court background
    // const tennisGrassCourt = new Actor({
    //   pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
    //   anchor: vec(0.5, 0.5)
    // });
    // tennisGrassCourt.graphics.use(TennisResources.BgTennisGrassCourt.toSprite());
    // tennisGrassCourt.z = -2; // behind everything
    // this.add(tennisGrassCourt);

    // // Sky background
    // const skyChoice = Math.random() > 0.5 ? TennisResources.BgSkyClouds : TennisResources.BgSkyNightClouds;
    // const skySprite = skyChoice.toSprite();
    // // We'll make an actor that tiles its sprite across the width of the game
    // this.clouds = new Actor({
    //   pos: vec(0, 0),
    //   anchor: vec(0, 0),
    //   width: engine.drawWidth,
    //   height: engine.drawHeight / 2, // top half of screen
    // });
    // this.clouds.z = -3; // even farther back
    // // Tile horizontally across width
    // const tileWidth = skySprite.width;
    // const neededTiles = Math.ceil(engine.drawWidth / tileWidth) + 1;
    // const tile = skyChoice.toSprite();
    // const layout = [];
    // for (let i = 0; i < neededTiles; i++) {
    //   layout.push({
    //     graphic: tile,
    //     offset: vec(i * tileWidth, 0)
    //   });
    // }
    // const cloudsGroup = new GraphicsGroup({
    //   useAnchor: false,
    //   members: layout
    // });
    // this.clouds.graphics.use(cloudsGroup);
    // this.add(this.clouds);


    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    //Resources.MenuMusic.play();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
    InputManager.instance.clearAllListeners();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    // super.onPreUpdate(engine, delta);

    // // Animate clouds slowly to the left
    // if (this.clouds) {
    //   this.clouds.pos.x -= delta * 0.025; // move clouds left
    //   const tileWidth = ((this.clouds.graphics.current as GraphicsGroup).members[0] as GraphicsGrouping).graphic.width;
    //   // wrap when scrolled past one tile
    //   if (this.clouds.pos.x <= -tileWidth) {
    //     this.clouds.pos.x = 0;
    //   }
    // }
  }

  onTransition(direction: "in" | "out") {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}
