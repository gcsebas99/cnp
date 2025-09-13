import { Engine, FadeInOut, Color, Actor, vec, GraphicsGroup, GraphicsGrouping } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { BaseLdtkScene } from "../../core/base-ldtk-scene";
import { Resources } from "../../resources";
import { Resources as TennisResources } from "../../resources/tennis-resources";

export class TennisScene extends BaseLdtkScene {
  private clouds?: Actor;

  constructor() {
    super();
  }

  protected override registerFactories(engine: Engine, ldtk: LdtkResource) {
    ldtk.registerEntityIdentifierFactory("PlayerSpawn", (props) => {
      console.log("PlayerSpawn at", props.worldPos.x, props.worldPos.y);
      return undefined;
    });
  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);

    // Grass court background
    const tennisGrassCourt = new Actor({
      pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
      anchor: vec(0.5, 0.5)
    });
    tennisGrassCourt.graphics.use(TennisResources.BgTennisGrassCourt.toSprite());
    tennisGrassCourt.z = -2; // behind everything
    this.add(tennisGrassCourt);

    // Sky background
    const skyChoice = Math.random() > 0.5 ? TennisResources.BgSkyClouds : TennisResources.BgSkyNightClouds;
    const skySprite = skyChoice.toSprite();
    // We'll make an actor that tiles its sprite across the width of the game
    this.clouds = new Actor({
      pos: vec(0, 0),
      anchor: vec(0, 0),
      width: engine.drawWidth,
      height: engine.drawHeight / 2, // top half of screen
    });
    this.clouds.z = -3; // even farther back
    // Tile horizontally across width
    const tileWidth = skySprite.width;
    const neededTiles = Math.ceil(engine.drawWidth / tileWidth) + 1;
    const tile = skyChoice.toSprite();
    const layout = [];
    for (let i = 0; i < neededTiles; i++) {
      layout.push({
        graphic: tile,
        offset: vec(i * tileWidth, 0)
      });
    }
    const cloudsGroup = new GraphicsGroup({
      useAnchor: false,
      members: layout
    });
    this.clouds.graphics.use(cloudsGroup);
    this.add(this.clouds);


    Resources.MenuMusic.loop = true;
    Resources.MenuMusic.volume = 0.2;
  }

  onActivate() {
    Resources.MenuMusic.play();
  }

  onDeactivate() {
    Resources.MenuMusic.stop();
  }

  override onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);

    // Animate clouds slowly to the left
    if (this.clouds) {
      this.clouds.pos.x -= delta * 0.025; // move clouds left
      const tileWidth = ((this.clouds.graphics.current as GraphicsGroup).members[0] as GraphicsGrouping).graphic.width;
      // wrap when scrolled past one tile
      if (this.clouds.pos.x <= -tileWidth) {
        this.clouds.pos.x = 0;
      }
    }
  }

  onTransition(direction: "in" | "out") {
    return new FadeInOut({
      direction,
      color: Color.Black,
      duration: 500
    });
  }
}