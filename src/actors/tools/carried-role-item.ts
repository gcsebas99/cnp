// CarriedItem.ts
import { Actor, Engine, vec, Sprite, Vector, CollisionType } from "excalibur";

export class CarriedRoleItem extends Actor {
  private owner!: Actor;
  private sprite: Sprite;
  //private offset: Vector;

  constructor(sprite: Sprite, scale = 0.6, offset: Vector = vec(20, 20)) {
    super({
      width: sprite.width * scale,
      height: sprite.height * scale,
      collisionType: CollisionType.PreventCollision,
    });

    sprite.scale = vec(scale, scale);
    this.sprite = sprite;
    this.offset = offset;
  }

  onInitialize(engine: Engine) {
    this.graphics.use(this.sprite);
  }

  attachTo(player: Actor) {
    this.owner = player;
  }

  onPreUpdate(_engine: Engine, _delta: number) {
    if (!this.owner) return;
    this.pos = this.owner.pos.add(this.offset);
  }
}
