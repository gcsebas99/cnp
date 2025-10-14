import { Engine, vec } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { JTPlatform } from "@/actors/objects/jt-platform";
import { RoleRushTerrainGrid } from "@/sprite-sheets/role-rush-terrain";
import { MovingBackground } from "@/actors/objects/moving-background";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
import { Player } from "@/actors/player/player";
import { RoleRushController } from "@/controllers/role-rush-controller";
import { GuiManager } from "@/managers/gui-manager";
import { SolidWall } from "@/actors/objects/solid-wall";
import { RoleRushDoor } from "@/actors/objects/role-rush-door";
import { PlatformWithFan } from "@/actors/objects/platform-with-fan";

export class RoleRushScene extends BaseLdtkScene {
  private background?: MovingBackground;
  private door?: RoleRushDoor;
  private elevator?: PlatformWithFan;

  //player
  private player?: Player;

  // private ballSpawns: Area[] = [];
  // private opponentSpawns: Area[] = [];
  // private bouncePlayerArea: Area|null = null;
  // private bounceOpponentArea: Area|null = null;
  // private pointWonActors: Actor[] = [];
  // private pointLostActors: Actor[] = [];

  // public ballManager?: BallManager;

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
    GuiManager.instance.show();
    GuiManager.instance.setTimer(3 * 60 * 1000);

    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.15;
  }

  onActivate() {
    super.onActivate();
    //InputManager.instance.updateConnectedGamepads();
    Resources.MenuMusic.play();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    //InputManager.instance.update();
    super.onPreUpdate(engine, delta);
    GuiManager.instance.tick(delta);

  }
}
