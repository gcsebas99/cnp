import { BasketDashTreeParts } from "@/sprite-sheets/basket-dash-tree";
import { Actor, CollisionType, vec, Vector } from "excalibur";

export class AutumnTree extends Actor {

  constructor(
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

  }

  onInitialize() {
    this.graphics.use(BasketDashTreeParts.trunk);
  }
}