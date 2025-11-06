import { Engine, DefaultLoader } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { GameScene } from "@/core/game-scene";

export abstract class BaseLdtkScene extends GameScene {
  protected ldtk?: LdtkResource;

  override onPreLoad(loader: DefaultLoader) {
    this.ldtk = loader.resources.find(
      r => r instanceof LdtkResource
    ) as LdtkResource;
  }

  override onInitialize(engine: Engine) {
    if (!this.ldtk) {
      console.warn("No LDtk resource found for scene:", this.constructor.name);
      return;
    }

    this.registerFactories(engine, this.ldtk);
    this.ldtk.addToScene(this);
  }

  /** Subclasses override this to define factories */
  protected abstract registerFactories(engine: Engine, ldtk: LdtkResource): void;
}
