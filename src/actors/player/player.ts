// player.ts
import { Actor, CollisionType, Engine, vec, Vector, Timer } from "excalibur"; // Animation, SpriteSheet,
import { Controller } from "@/controllers/controller";
import { Tool } from "@/actors/tools/tool";
import { TreeItem } from "@/actors/objects/tree-item";
import { BasketDashController } from "@/controllers/basket-dash-controller";
import { Basket } from "../tools/basket";
import { PlayerAnimationKey, PlayerSkin } from "@/actors/player/player-skin";
import { ChutiSkin } from "@/actors/player/chuti-skin";
import { NeitiSkin } from "@/actors/player/neiti-skin";
import { PlayerBody } from "@/actors/player/player-body";
import { FaceMap } from "@/sprite-sheets/player-head-sheets";
import { Racket } from "@/actors/tools/racket";
import { SoundManager } from "@/managers/sound-manager";
import { Resources } from "@/resources";
import { Hat } from "@/actors/wearables/hat";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export type Character = "chuti" | "neiti";
export type TennisState = "idle" | "walk" | "run" | "swing";
export type BasketDashState = "idle" | "walk" | "run" | "jump";
export type RoleRushState = "idle" | "walk" | "run" | "jump";


export class Player extends Actor {
  public character: Character;
  public controller!: Controller;
  public tool?: Tool;

  //skin
  public skin: PlayerSkin;
  public bodyActor!: PlayerBody;
  private currentAnimationKey: PlayerAnimationKey = "idle";

  //hurt
  private isHurt = false;
  //power-ups
  private hasPowerup = false;
  private originalSpeed = 0;

  private bodyScale: Vector = vec(1.8, 1.8);

  // celebrate
  private celebrateTimer?: Timer;
  private celebrateIteration = 0;
  // private celebrateBaseY = 0;


  constructor(character: Character, x: number, y: number, anchor: Vector = Vector.Half) {
    const skin = character === "chuti" ? ChutiSkin : NeitiSkin;

    super({
      pos: vec(x, y), //vec(x, y - 10),
      name: "Player-" + character,
      anchor: anchor, //vec(0.5, 1),//
      width: 74,//64,
      height: 138,//128,
      collisionType: CollisionType.Active
    });
    this.character = character;
    this.skin = skin;

    this.bodyActor = new PlayerBody(skin, this.bodyScale);
    this.bodyActor.pos = vec(37, 138); //moved from 0,0 to bottom-center

    this.addTag("player");
    this.addTag("activate-platforms");
    this.addChild(this.bodyActor)
  }

  onInitialize(engine: Engine) {

    this.bodyActor.animation.set("idle");
    this.updateHeadPivot("idle");

    engine.clock.schedule(() => {
      this.bodyActor.setFace(FaceMap.SIDE_HAPPY_1);
    }, 500);

    // engine.clock.schedule(() => {
    //   this.bodyActor.shakeHead(0.15, 3200);
    // }, 3000);
  }

  setBodyAnimation(key: PlayerAnimationKey) {
    this.bodyActor.animation.set(key);
    this.updateHeadPivot(key);
    this.updateHatPivot(key);
    this.currentAnimationKey = key;
  }

  updateHeadPivot(animation: PlayerAnimationKey) {
    const cfg =
      this.skin.headPivotsByAnimation?.[animation] ??
      this.skin.defaultHeadPivot;
    this.bodyActor.setHeadAttachment(cfg.headOffset.clone());
  }

  updateHatPivot(animation: PlayerAnimationKey) {
    const cfg =
      this.skin.headPivotsByAnimation?.[animation] ??
      this.skin.defaultHeadPivot;
    this.bodyActor.setHatConfig(cfg.hatOffsetRight || Vector.Zero, cfg.hatOffsetLeft || Vector.Zero);
  }

  setFace(faceIndex: number) {
    this.bodyActor.setFace(faceIndex);
  }

  setFacing(left: boolean) {
    this.bodyActor.flip(left);
  }

  public equipHat(hat: Hat) {
    this.bodyActor.attachHat(hat, this.currentAnimationKey);
  }

  public removeHat() {
    this.bodyActor.removeHat();
  }

  setBodyAndHead(key: PlayerAnimationKey, faceIndex: number, headScale?: Vector) {
    this.setBodyAnimation(key);
    this.setFace(faceIndex);
    if(headScale) {
      this.bodyActor.rescaleHead(headScale);
    } else {
      this.bodyActor.rescaleHead(vec(1/this.bodyScale.x, 1/this.bodyScale.y));
    }
  }

  public equipTool(tool: Tool, equipPosition?: Vector) {
    this.tool = tool;
    if (tool.name === "Racket") { //racket has its own attachment logic
      tool.attachTo(this);
      return;
    }
    const handRight = vec(64, 32); // default attachment point - TODO: define attachment points
    tool.attachTo(this, equipPosition ?? handRight);
  }

  public getEquippedTool(): Tool | undefined {
    return this.tool;
  }

  public performAction(action: string, options?: any) {
    this.controller.performAction(this, action, options);
  }

  public getCustomData(prop: string): any {
    switch (prop) {
      case "tennis-serve-ball-position":
        return vec(this.pos.x + (this.width / 2), this.pos.y - 40);
      default:
        return null;
    }
  }

  public onPreUpdate(engine: Engine, delta: number) {
    this.controller.update(this, engine, delta);
    this.tool?.update(engine, delta);
  }

  public applyHurt() {
    if (this.isHurt) return; // already invulnerable

    this.isHurt = true;

    // BLINK
    const blink = new Timer({
      interval: 120,
      repeats: true,
      fcn: () => {
        this.graphics.opacity = this.graphics.opacity === 1 ? 0.3 : 1;
      }
    });

    if (this.scene) {
      this.scene.addTimer(blink);
      blink.start();
      SoundManager.instance.playOnce(this.character === "chuti" ? Resources.ChutiAuAuSfx : Resources.NeitiAuAuSfx, 1);
    }

    // End hurt in 3s
    if (this.scene && this.scene.engine) {
      this.scene.engine.clock.schedule(() => {
        blink.cancel();
        this.graphics.opacity = 1;
        this.isHurt = false;
        this.body.collisionType = CollisionType.Active;
      }, 3000);
    }
  }


  public applyPowerup(item: TreeItem, powerUpId: number) {
    if (this.hasPowerup) return; // Ignore duplicates

    this.hasPowerup = true;

    const controller = this.controller as BasketDashController;
    const basket = this.tool as Basket;

    // Save originals
    this.originalSpeed = controller.baseSpeed;

    if (powerUpId === 0) {
      // Speed boost
      controller.baseSpeed *= 1.8;
    }

    if (powerUpId === 1) {
      // Basket widen
      //basket.scale.setTo(1.5, 1);
      basket.actions.scaleTo({scale: vec(1.5, 1), duration: 300});
      if (this.scene && this.scene.engine) {
        this.scene.engine.clock.schedule(() => {
          basket.updateColliderOffset();
        }, 300);
      }
    }

    SoundManager.instance.playOnce(BasketDashResources.PowerUp, 0.9);

    // Powerup duration
    if (this.scene && this.scene.engine) {
      this.scene.engine.clock.schedule(() => {
        // restore
        controller.baseSpeed = this.originalSpeed;
        //basket.scale.setTo(1, 1);
        basket.actions.scaleTo({scale: vec(1, 1), duration: 300});

        this.hasPowerup = false;
      }, 6000);
    }
  }

  public isPlayerHurt(): boolean {
    return this.isHurt;
  }


  // for tennis
  setTennisState(state: TennisState) {
    switch (state) {
      case "idle":
        this.setBodyAndHead("tennis-idle", FaceMap.HAIR);
        this.setFacing((this.tool as Racket)?.getRacketSide() === "left");
        break;

      case "walk":
        this.setBodyAndHead("tennis-walk", this.character === "chuti" ? FaceMap.SIDE_HAPPY_1 : FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : undefined);
        break;

      case "run":
        this.setBodyAndHead("tennis-run", this.character === "chuti" ? FaceMap.SIDE_HAPPY_1 : FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : undefined);
        break;

      case "swing":
        this.setBodyAndHead("tennis-swing", FaceMap.HAIR);
        break;
    }
  }

  //for basket dash
  setBasketDashState(state: BasketDashState) {
    switch (state) {
      case "idle":
        this.setBodyAndHead("idle", FaceMap.SIDE_HAPPY_1);
        break;

      case "walk":
        this.setBodyAndHead("tennis-walk", FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : vec(0.65, 0.65));
        break;

      case "run":
        this.setBodyAndHead("tennis-run", FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : vec(0.65, 0.65));
        break;

      case "jump":
        this.setBodyAndHead("jump", FaceMap.SIDE_HAPPY_1);
        break;
    }
  }

  //for role rush
  setRoleRushState(state: RoleRushState) {
    switch (state) {
      case "idle":
        this.setBodyAndHead("idle", FaceMap.SIDE_HAPPY_1);
        break;

      case "walk":
        this.setBodyAndHead("walk", FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : vec(0.65, 0.65));
        break;

      case "run":
        this.setBodyAndHead("run", FaceMap.SIDE_HAPPY_2, this.character === "neiti" ? vec(0.7, 0.7) : vec(0.65, 0.65));
        break;

      case "jump":
        this.setBodyAndHead("jump", FaceMap.SIDE_HAPPY_1);
        break;
    }
  }

  celebrate() {
    this.stopCelebrate(); // safety reset

    this.removeHat();

    this.celebrateIteration = 0;
    // this.celebrateBaseY = this.pos.y;

    this.setBodyAnimation("celebrate");
    this.setFace(FaceMap.FRONT_HAPPY_2);

    this.celebrateTimer = new Timer({
      interval: 800,
      repeats: true,
      fcn: () => this.runCelebrateIteration(),
    });

    if (this.scene) {
      this.scene.addTimer(this.celebrateTimer);
      this.celebrateTimer.start();
    }
  }

  private runCelebrateIteration() {
    if (this.celebrateIteration === 0) {
      SoundManager.instance.playOnce(this.character === "chuti" ? Resources.ChutiWooHooSfx : Resources.NeitiWooHooSfx, 1);
    }

    if (this.celebrateIteration === 3) {
      SoundManager.instance.playOnce(this.character === "chuti" ? Resources.ChutiSiSfx : Resources.NeitiSiSfx, 1);
    }

    this.celebrateIteration++;

    // Alternate face
    const face =
      this.celebrateIteration % 2 === 0
        ? FaceMap.FRONT_HAPPY_2
        : FaceMap.FRONT_YELL;

    this.setFace(face);

    // Alternate facing
    this.setFacing(this.celebrateIteration % 2 === 0);

    // Jump animation
    //this.playCelebrateJump();
  }

  // private playCelebrateJump() {
  //   const jumpHeight = 30;
  //   const upTime = 220;
  //   const downTime = 220;

  //   this.actions
  //     .delay(160)
  //     .moveBy(0, -jumpHeight, upTime)
  //     .moveBy(0, jumpHeight, downTime);
  // }

  private stopCelebrate() {
    this.celebrateTimer?.cancel();
    this.celebrateTimer = undefined;
    this.actions.clearActions();
  }

  onPreKill() {
    this.stopCelebrate();
  }

  onRemove() {
    this.stopCelebrate();
  }
}
