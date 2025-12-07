// player.ts
import { Actor, CollisionType, Engine, vec, Vector, Animation, AnimationStrategy, Timer } from "excalibur"; // Animation, SpriteSheet,
//import { Resources } from "./resources"; // assumes you have chuti.png, neiti.png
import { Controller } from "@/controllers/controller";
import { Tool } from "@/actors/tools/tool";
import { AnimationComponent } from "@/core/components/animation-component";
import { ChutiWalkingSheet } from "@/sprite-sheets/chuti";
import { TreeItem } from "@/actors/objects/tree-item";
import { BasketDashController } from "@/controllers/basket-dash-controller";
import { Basket } from "../tools/basket";

export type Character = "chuti" | "neiti";
export class Player extends Actor {
  public animation = new AnimationComponent({
    idle: Animation.fromSpriteSheet(ChutiWalkingSheet, [2], 500, AnimationStrategy.Freeze),
    walk: Animation.fromSpriteSheet(ChutiWalkingSheet, [0, 1, 2, 3, 4, 5], 120, AnimationStrategy.Loop),
    run: Animation.fromSpriteSheet(ChutiWalkingSheet, [0, 1, 2, 3, 4, 5], 85, AnimationStrategy.Loop),
  });

  public character: Character;
  public controller!: Controller;
  public tool?: Tool;

  //hurt
  private isHurt = false;
  //power-ups
  private hasPowerup = false;
  private originalSpeed = 0;


  constructor(character: Character, x: number, y: number, anchor: Vector = Vector.Half) {
    super({
      pos: vec(x, y - 10),
      name: "Player-" + character,
      anchor: anchor,
      width: 74,//64,
      height: 138,//128,
      collisionType: CollisionType.Active
    });
    this.character = character;

    this.addTag("player");
    this.addTag("activate-platforms");
    this.addComponent(this.animation);
  }

  onInitialize(engine: Engine) {

    // TODO: replace with "skin" config class
    // const color = this.character === "chuti" ? Color.Red : Color.Blue;
    // const body = new Rectangle({
    //   width: this.width,
    //   height: this.height,
    //   color
    // });
    // this.graphics.use(body);
    this.animation.set("idle");

    // Pick sprite based on character
    // const sheet = this.character === "chuti"
    //   ? SpriteSheet.fromImageSource({
    //       image: Resources.Chuti,
    //       grid: { rows: 1, columns: 3, spriteWidth: 16, spriteHeight: 32 }
    //     })
    //   : SpriteSheet.fromImageSource({
    //       image: Resources.Neiti,
    //       grid: { rows: 1, columns: 3, spriteWidth: 16, spriteHeight: 32 }
    //     });

    // const idle = new Animation({
    //   frames: [sheet.getSprite(0, 0)!],
    //   frameDuration: 200
    // });
    // const walk = new Animation({
    //   frames: [sheet.getSprite(0, 1)!, sheet.getSprite(0, 2)!],
    //   frameDuration: 120
    // });

    // this.graphics.add("idle", idle);
    // this.graphics.add("walk", walk);
    // this.graphics.use("idle");
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

}
