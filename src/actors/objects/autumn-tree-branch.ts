// branch.ts
import { Actor, Color, Engine, vec, Vector, RotationType, Rectangle, Graphic, Scene } from "excalibur";
import { TreeItem, TreeItemConfig } from "@/actors/objects/tree-item";
import { AutumnTree } from "@/actors/objects/autumn-tree";
import { SoundManager } from "@/managers/sound-manager";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export class AutumnTreeBranch extends Actor {
  private treeScene: Scene;
  private tree: AutumnTree;
  private localPos: Vector;
  private graphic?: Graphic;

  constructor(
    tree: AutumnTree,
    scene: Scene,
    localPos: Vector, // position relative to tree
    zIndex: number = 10,
    graphic?: Graphic,
  ) {
    super({
      name: "AutumnTreeBranch",
      pos: localPos.clone(),
      width: graphic ? graphic.width : 180,
      height: graphic ? graphic.height : 80,
      anchor: Vector.Half,
      z: zIndex,
      scale: new Vector(1.5, 1.5),
    });
    this.tree = tree;
    this.localPos = localPos;
    this.graphic = graphic;
    this.treeScene = scene;
  }

  onInitialize() {
    if (this.graphic) {
      this.graphics.use(this.graphic);
    } else {
      this.graphics.use(
        new Rectangle({
          width: this.width,
          height: this.height,
          color: Color.Blue,
        })
      );
    }
  }

  // --------------------------
  // SHAKING ANIMATION
  // --------------------------
  shake(engine: Engine, duration = 600) {
    // small rapid rotation animation
    const shakePower = 0.2; // ~1.7 degrees

    this.actions.clearActions();

    SoundManager.instance.playOnce(BasketDashResources.BushShake, 0.9);

    this.actions
      .rotateTo(shakePower, duration * 0.16, RotationType.Clockwise)
      .rotateTo(-shakePower, duration * 0.16, RotationType.CounterClockwise)
      .rotateTo(shakePower, duration * 0.16, RotationType.Clockwise)
      .rotateTo(-shakePower, duration * 0.16, RotationType.CounterClockwise)
      .rotateTo(shakePower, duration * 0.16, RotationType.Clockwise)
      .rotateTo(0, duration * 0.2, RotationType.CounterClockwise)
  }

  // --------------------------
  // DROP ITEM
  // --------------------------
  dropItem(engine: Engine, config: TreeItemConfig) {
    const item = new TreeItem({
      ...config,
      startPosition: this.getWorldPos(),
      initialZ: this.z - 1, // under the branch while spawning
    });

    this.treeScene.add(item);

    return item;
  }

  // Gets world position of branch
  private getWorldPos(): Vector {
    return vec(this.tree.pos.x + this.localPos.x, this.tree.pos.y + this.localPos.y);
  }
}
