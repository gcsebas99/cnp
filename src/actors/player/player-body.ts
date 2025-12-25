import { AnimationComponent } from "@/core/components/animation-component"
import { Actor, CollisionType, vec, Engine, Vector } from "excalibur"
import { PlayerAnimationKey, PlayerSkin } from "@/actors/player/player-skin"
import { PlayerHead } from "@/actors/player/player-head"
import { Hat } from "@/actors/wearables/hat";
import { HatPuffVFX } from "@/actors/vfx/hat-puff-vfx";
import { SoundManager } from "@/managers/sound-manager";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export class PlayerBody extends Actor {
  public animation: AnimationComponent<PlayerAnimationKey>;
  public head!: PlayerHead;
  private hat?: Hat;
  private skin: PlayerSkin;

  constructor(skin: PlayerSkin, scaleVec = vec(1, 1)) {
    super({
      name: "PlayerBody",
      anchor: vec(0.5, 1), // bottom center
      scale: scaleVec,
      collisionType: CollisionType.PreventCollision,
      z: 18
    });

    this.skin = skin;

    this.animation = new AnimationComponent(skin.bodyAnimations);
    this.addComponent(this.animation);

    this.head = new PlayerHead(skin.headSheet, scaleVec, true);
  }

  onInitialize(engine: Engine) {
    this.addChild(this.head);
  }

  setFace(index: number) {
    this.head.setFace(index);
  }

  setHeadAttachment(headPos: Vector) {
    this.head.setAttachment(headPos);
  }

  setHatConfig(rightOffset: Vector, leftOffset: Vector) {
    if(this.hat) {
      this.hat.setConfig(rightOffset, leftOffset);
    }
  }

  flip(facingLeft: boolean) {
    this.graphics.flipHorizontal = facingLeft;
    this.head.flip(facingLeft);
    this.hat?.flip(facingLeft);
  }

  rescaleHead(scaleVec: Vector) {
    this.head.rescale(scaleVec);
  }

  shakeHead(amount = 0.05, duration = 200) {
    this.head.shake(amount, duration);
  }

  attachHat(hat: Hat, animation: PlayerAnimationKey) {
    this.removeHat();
    this.hat = hat;
    const cfg = this.skin.headPivotsByAnimation?.[animation] ?? this.skin.defaultHeadPivot;
    const pos = this.hat.setConfig(cfg.hatOffsetRight || Vector.Zero, cfg.hatOffsetLeft || Vector.Zero);


    const puff = new HatPuffVFX(pos, () => {
      if (!this.hat) return;
      this.addChild(this.hat);
      SoundManager.instance.playOnce(RoleRushResources.HatPuff, 0.8);
    });

    this.addChild(puff);
  }

  removeHat() {
    if (this.hat) {
      this.hat.kill();
      this.hat = undefined;
    }
  }
}