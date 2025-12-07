import { Color, Engine, ExcaliburGraphicsContext, vec } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "@/core/base-ldtk-scene";
import { Resources } from "@/resources";
import { InputTestActor } from "@/actors/player/input-test-actor";
import { PopupManager } from "@/managers/popup-manager";
import { animStartSprite } from "@/sprite-sheets/start";
import { AutumnTree } from "@/actors/objects/autumn-tree";
import { MovingBackground } from "@/actors/objects/moving-background";
import { Frog } from "@/actors/npcs/frog";
import { Fruits } from "@/sprite-sheets/basket-dash-items/fruits";
import { RottenFruits } from "@/sprite-sheets/basket-dash-items/rotten-fruits";
import { PowerUps } from "@/sprite-sheets/basket-dash-items/power-ups";
import { Trash } from "@/sprite-sheets/basket-dash-items/trash";
import { Player } from "@/actors/player/player";
import { BasketDashController } from "@/controllers/basket-dash-controller";
import { SolidWall } from "@/actors/objects/solid-wall";
import { Basket } from "@/actors/tools/basket";
import { ObstacleManager } from "@/managers/basket-dash/obstacle-manager";
import { TreeItemsManager } from "@/managers/basket-dash/tree-items-manager";
import { ScoreManager } from "@/managers/score-manager";
import { GuiManager } from "@/managers/gui-manager";
import { GameState } from "@/types/game-state";
import { BasketDashOrchestration } from "@/scenes/basket-dash/basket-dash-orchestration";

const GAME_TIME_MS = 60 * 1000; // 1 minute

export class BasketDashScene extends BaseLdtkScene {
  private orchestration!: BasketDashOrchestration;
  private sky?: MovingBackground;
  private tree?: AutumnTree;
  private player?: Player;
  private obstacleManager?: ObstacleManager;
  private treeItemsManager?: TreeItemsManager;

  private testActor?: InputTestActor;

  private state: GameState = GameState.Waiting;

  constructor() {
    super("basketDash");
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {
    ldtk.registerEntityIdentifierFactory("LevelBorder", (props) => {
      const levelWall = new SolidWall(props.worldPos.x, props.worldPos.y, props.entity.width, props.entity.height, `Wall-${props.entity.width}x${props.entity.height}`);
      return levelWall;
    });

    ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
      this.player = new Player("chuti", props.worldPos.x, props.worldPos.y, vec(props.entity.__pivot[0],props.entity.__pivot[1]));
      this.player.controller = new BasketDashController();
      const basket = new Basket(this.player);
      this.player.equipTool(basket, vec(64, 64));
      basket.use("facing-right");
      return this.player;
    });

  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.scoreManager = new ScoreManager(engine, 0, GAME_TIME_MS);
    this.registerScore();
    this.initGameGraphics(engine);

    this.obstacleManager = new ObstacleManager(engine, this, {
      startPositions: [ vec(-100, 1152), vec(2404, 1152) ],
      targetPositions: [ vec(300, 1152), vec(700, 1152), vec(1100, 1152), vec(1700, 1152), vec(1900, 1152) ],
      playerRef: this.player!
    });

    this.treeItemsManager = new TreeItemsManager({
      tree: this.tree!,
      engine: engine,
      fruits: Fruits,
      rottenFruits: RottenFruits,
      trash: Trash,
      powerUps: PowerUps
    });

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

    // const animStartSprite = PopupManager.createAnimatedSprite(
    //   StartSpriteSheet,
    //   [0, 1],
    //   300,
    //   true
    // );

    // PopupManager.instance.show({
    //   text: "Start!",
    //   duration: 1500,
    //   soundAppear: Resources.ReadyStartSfx,
    //   sprite: animStartSprite,
    //   animationDelay: 800,
    //   soundAppearDelay: 500,
    // });


    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;

    const frog = new Frog(600, 1000);
    this.add(frog);


    this.orchestration = new BasketDashOrchestration(engine, this);
    this.orchestration.devStart();
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
    this.tree = new AutumnTree(this.engine, 127, -54, -2);
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

  onPostDraw(ctx: ExcaliburGraphicsContext, elapsed: number) {
    this.testActor?.draw(ctx);
  }

  private registerScore() {
    this.on("item:picked", (evt:any) => {
      if (evt.points) {
        if (evt.points > 0) {
          this.scoreManager?.add(evt.points);
          Resources.ScoreUpSfx.play();
          GuiManager.instance.updateScore(this.scoreManager!.getScore(), true);
        } else {
          this.scoreManager?.subtract(-evt.points);
          GuiManager.instance.updateScore(this.scoreManager!.getScore(), true);
        }
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
    GuiManager.instance.show(Color.Blue, Color.Green, Color.Blue, Color.Green);
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
    this.obstacleManager?.start();
    this.treeItemsManager?.start();
  }

  public endGame() {
    this.state = GameState.Finished;
    this.obstacleManager?.stop();
    this.treeItemsManager?.stop();
    this.orchestration.end();
  }
}