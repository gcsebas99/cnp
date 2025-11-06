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
import { SolidWall } from "@/actors/objects/solid-wall";
import { RoleRushDoor } from "@/actors/objects/role-rush-door";
import { PlatformWithFan } from "@/actors/objects/platform-with-fan";
import { SoundManager } from "@/managers/sound-manager";

export class RoleRushScene extends BaseLdtkScene {
  private background?: MovingBackground;
  private door?: RoleRushDoor;
  private elevator?: PlatformWithFan;

  //player
  private player?: Player;


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
    //GuiManager.instance.show();
    //GuiManager.instance.setTimer(3 * 60 * 1000);

    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.15;
  }

  onActivate() {
    super.onActivate();
    SoundManager.instance.playOnce(Resources.MenuMusic, 0.8);
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    //GuiManager.instance.tick(delta);

  }
}
