import { Actor, Engine, vec, Vector, Sprite, CollisionType } from "excalibur";

export class Hat extends Actor {
  private owner!: Actor;
  private sprite: Sprite;
  //private hatOffset: Vector;

  constructor(sprite: Sprite, offset: Vector = vec(0, -50)) {
    super({
      width: sprite.width,
      height: sprite.height,
      collisionType: CollisionType.PreventCollision,
    });

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

    // Attach to owner "head pivot"
    this.pos = this.owner.pos.add(this.offset);

    // Optional: mimic player rotation
    this.rotation = this.owner.rotation * 0.9;
  }
}
