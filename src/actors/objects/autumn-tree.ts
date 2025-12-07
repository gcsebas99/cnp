import { BasketDashTreeParts } from "@/sprite-sheets/basket-dash-tree";
import { Actor, CollisionType, Engine, vec, Vector } from "excalibur";
import { LeafEmitter } from "@/actors/emitters/leaf-emitter";
import { AutumnTreeBranch } from "@/actors/objects/autumn-tree-branch";
import { TreeItemConfig } from "@/actors/objects/tree-item";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export class AutumnTree extends Actor {
  private branches: AutumnTreeBranch[] = [];
  private leaves: LeafEmitter[] = [];
  private engine: Engine;

  constructor(
    e: Engine,
    x: number,
    y: number,
    z: number = 0
  ) {
    super({
      name: "AutumnTree",
      pos: vec(x, y),
      width: 2050,
      height: 1206,
      anchor: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
      z,
    });

    this.engine = e;
  }

  onInitialize() {
    this.graphics.use(BasketDashTreeParts.trunk);
    this.leaves.push(new LeafEmitter(vec(this.pos.x + 200, this.pos.y + 500), 0.25));
    this.leaves.push(new LeafEmitter(vec(this.pos.x + 700, this.pos.y + 500), 0.25));
    this.leaves.push(new LeafEmitter(vec(this.pos.x + 1200, this.pos.y + 500), 0.25));
    this.leaves.push(new LeafEmitter(vec(this.pos.x + 1600, this.pos.y + 500), 0.25));
    for (const leafEmitter of this.leaves) {
      this.addChild(leafEmitter);
    }

    this.branches.push(new AutumnTreeBranch(this, this.engine.currentScene, vec(470, 400), 20, BasketDashResources.Branch1.toSprite()));
    this.branches.push(new AutumnTreeBranch(this, this.engine.currentScene, vec(800, 300), 20, BasketDashResources.Branch2.toSprite()));
    this.branches.push(new AutumnTreeBranch(this, this.engine.currentScene, vec(1250, 220), 20, BasketDashResources.Branch3.toSprite()));
    this.branches.push(new AutumnTreeBranch(this, this.engine.currentScene, vec(1550, 400), 20, BasketDashResources.Branch4.toSprite()));
    for (const branch of this.branches) {
      this.addChild(branch);
    }
  }

  public shakeBranch(index: number) {
    const branch = this.branches[index];
    branch?.shake(this.engine, 30);
  }

  public spawnItemFromBranch(index: number, config: TreeItemConfig) {
    const branch = this.branches[index];
    branch?.dropItem(this.engine, config);
  }

  public getBranches() {
  return this.branches;
}
}