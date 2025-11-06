import { Engine, ExcaliburGraphicsContext, vec } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { InputTestActor } from "@/actors/player/input-test-actor";
import { PopupManager } from "@/managers/popup-manager";
import { StartSpriteSheet } from "@/sprite-sheets/start";
import { LeafEmitter } from "@/actors/emitters/leaf-emitter";
import { AutumnTree } from "@/actors/objects/autumn-tree";
import { MovingBackground } from "@/actors/objects/moving-background";

export class BasketDashScene extends BaseLdtkScene {
  private sky?: MovingBackground;
  private tree?: AutumnTree;
  private testActor?: InputTestActor;


  constructor() {
    super("basketDash");
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {


  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.initGameGraphics(engine);

    // this.testActor = new InputTestActor(engine.halfDrawWidth, engine.halfDrawHeight, 300, 200);
    // this.add(this.testActor);
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

    const animStartSprite = PopupManager.createAnimatedSprite(
      StartSpriteSheet,
      [0, 1],
      300,
      true
    );

    PopupManager.instance.show({
      text: "Start!",
      duration: 1500,
      soundAppear: Resources.ReadyStartSfx,
      sprite: animStartSprite,
      animationDelay: 800,
      soundAppearDelay: 500,
    });


    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;


    const leaves = new LeafEmitter(vec(960, -100));
    this.add(leaves);
  }

  private initGameGraphics(engine: Engine) {
    // sky with clouds
    this.sky = new MovingBackground({
      width: engine.drawWidth,
      height: 1152,
      sprite: BasketDashResources.SkyClouds.toSprite(),
      spriteSize: 2304,
      direction: "left",
      speed: 0.015,
    });
    this.add(this.sky);

    // tree
    this.tree = new AutumnTree(127, -54);
    this.add(this.tree);
  }

  onActivate() {
    super.onActivate();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
    //InputManager.instance.update();

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

  // override onPostUpdate(engine: ex.Engine, delta: number) {
  //   InputManager.instance.update();
  // }

  onPostDraw(ctx: ExcaliburGraphicsContext, elapsed: number) {
    this.testActor?.draw(ctx);
  }
}