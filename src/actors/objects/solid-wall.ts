import { Actor, CollisionType, vec, Vector } from "excalibur";

// simple invisible wall to block user movement
export class SolidWall extends Actor {

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    name: string = "SolidWall",
    z: number = 0
  ) {
    super({
      name,
      pos: vec(x, y),
      width,
      height,
      anchor: Vector.Zero,
      collisionType: CollisionType.Fixed,
      z,
    });
  }
}
