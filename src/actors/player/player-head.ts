
import { Actor, CollisionType, SpriteSheet, vec, Vector } from "excalibur";

export class PlayerHead extends Actor {
  private sheet: SpriteSheet;

  constructor(sheet: SpriteSheet, scaleVec = vec(1, 1), scaleInverse = false) {
    super({
      name: "PlayerHead",
      width: 74,
      height: 84,
      anchor: vec(0.5, 1), // bottom-center
      collisionType: CollisionType.PreventCollision,
      z: 20,
      scale: scaleInverse ? vec(1/scaleVec.x, 1/scaleVec.y) : scaleVec,
    });

    this.sheet = sheet;
  }

  onInitialize() {
    this.setFace(1);
  }

  setAttachment(headPos: Vector) {
    this.pos = headPos;
  }

  setFace(index: number) {
    this.graphics.use(this.sheet.getSprite(index, 0)!);
  }

  flip(facingLeft: boolean) {
    this.graphics.flipHorizontal = facingLeft;
  }

  rescale(scaleVec: Vector) {
    this.scale = scaleVec;
  }

  shake(amount = 0.05, duration = 200) {
    const start = this.rotation;
    this.actions
      .rotateTo(start + amount, duration / 2)
      .rotateTo(start - amount, duration / 2)
      .rotateTo(start, duration / 2);
  }
}
