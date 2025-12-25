import { Actor, CollisionType, Sprite, Vector, vec } from "excalibur";

export interface HatConfig {
  sprite: Sprite;
  offset?: Vector;      // fine positioning on head
  scale?: Vector;
  rotationRight?: number;
  rotationLeft?: number;
  z?: number;
  rightIncrement?: Vector;
  leftIncrement?: Vector;
}

export class Hat extends Actor {
  private facingRightOffset: Vector = vec(0, 0);
  private facingLeftOffset: Vector = vec(0, 0);
  private facingRightRotation: number = 0;
  private facingLeftRotation: number = 0;

  private offsetIncrementRight: Vector = vec(0, 0);
  private offsetIncrementLeft: Vector = vec(0, 0);

  constructor(cfg: HatConfig) {
    super({
      name: "Hat",
      width: cfg.sprite.width,
      height: cfg.sprite.height,
      anchor: vec(0.5, 1), // bottom-center
      collisionType: CollisionType.PreventCollision,
      z: cfg.z ?? 30,
      scale: cfg.scale ?? vec(1, 1),
      rotation: cfg.rotationRight ?? 0,
    });

    this.facingRightRotation = cfg.rotationRight ?? 0;
    this.facingLeftRotation = cfg.rotationLeft ?? 0;
    this.offsetIncrementRight = cfg.rightIncrement ?? vec(0, 0);
    this.offsetIncrementLeft = cfg.leftIncrement ?? vec(0, 0);

    this.graphics.use(cfg.sprite);

    if (cfg.offset) {
      this.pos = cfg.offset.clone();
    }
  }

  setConfig(rightOffset: Vector, leftOffset: Vector) {
    this.facingRightOffset = rightOffset.clone();
    this.facingLeftOffset = leftOffset.clone();
    if (this.graphics.flipHorizontal) {
      this.pos = vec(this.facingLeftOffset.x + this.offsetIncrementLeft.x, this.facingLeftOffset.y + this.offsetIncrementLeft.y);
      this.rotation = this.facingLeftRotation;
    } else {
      this.pos = vec(this.facingRightOffset.x + this.offsetIncrementRight.x, this.facingRightOffset.y + this.offsetIncrementRight.y);
      this.rotation = this.facingRightRotation;
    }
    return this.pos;
  }

  setOffset(offset: Vector) {
    this.pos = offset.clone();
  }

  setScale(scale: Vector) {
    this.scale = scale.clone();
  }

  setRotation(rad: number) {
    this.rotation = rad;
  }

  flip(facingLeft: boolean) {
    this.graphics.flipHorizontal = facingLeft;
    this.pos = facingLeft ?
                  vec(this.facingLeftOffset.x + this.offsetIncrementLeft.x, this.facingLeftOffset.y + this.offsetIncrementLeft.y)
                  : vec(this.facingRightOffset.x + this.offsetIncrementRight.x, this.facingRightOffset.y + this.offsetIncrementRight.y);
    this.rotation = facingLeft ? this.facingLeftRotation : this.facingRightRotation;
  }
}
