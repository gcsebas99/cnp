import { CollisionType, Engine, vec, Vector } from "excalibur";
import { BasketDashCollisionGroups } from "@/config/collision-groups";
import { Tool } from "@/actors/tools/tool";
import { Player } from "@/actors/player/player";
import { Basket as BasketSprite } from "@/sprite-sheets/basket";

const BASKET_RIGHT_OFFSET = new Vector(74, 64);
const BASKET_LEFT_OFFSET  = new Vector(0, 64);
const BASKET_WIDTH = 96;
const BASKET_HEIGHT = 86;

export class Basket extends Tool {
  public side: "left" | "right" = "left";

  constructor(player: Player) {
    super({
      name: "Basket",
      width: BASKET_WIDTH,
      height: BASKET_HEIGHT,
      pos: BASKET_LEFT_OFFSET,
      anchor: vec(1, 0.5)//Vector.Half, // left middle pivot
    });
    this.body.collisionType = CollisionType.Passive;
    this.body.group = BasketDashCollisionGroups.Basket;

    this.addTag("basket");
  }

  onInitialize() {
    this.graphics.use(BasketSprite);
    // initial collider offset for left side
    this.updateColliderOffset();
  }

  onPreUpdate(engine: Engine, delta: number) {
    //
  }

  public use(action: string, now?: number) {
    if (action === "facing-left") {
      this.setBasketOnSide("left");
    }
    if (action === "facing-right") {
      this.setBasketOnSide("right");
    }
  }

  private setBasketOnSide(side: "left" | "right") {
    this.side = side;
    if (side === "left") {
      this.anchor = vec(1, 0.5);
      this.pos = BASKET_LEFT_OFFSET;
    } else {
      this.anchor = vec(0, 0.5);
      this.pos = BASKET_RIGHT_OFFSET;
    }
    this.updateColliderOffset();
  }

  public updateColliderOffset() {
    // Collider always centered relative to Actor pos,
    // but offset relative to anchor pivot
    if (this.side === "left") {
      // Anchor on right → collider extends left
      const collider = this.collider.get();
      if (collider) {
        collider.offset = vec(0, 0);
      }
    } else {
      // Anchor on left → collider extends right
      const collider = this.collider.get();
      if (collider) {
        collider.offset = vec(this.width, 0);
      }
    }
  }
}
