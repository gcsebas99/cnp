import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export const BasketDashTreeSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.TreeLeaves,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 32,
    spriteHeight: 32
  }
});

export const BasketDashTreeLeaves = [
  BasketDashTreeSheet.getSprite(0, 0)!,
  BasketDashTreeSheet.getSprite(1, 0)!,
  BasketDashTreeSheet.getSprite(2, 0)!,
  BasketDashTreeSheet.getSprite(3, 0)!,
  BasketDashTreeSheet.getSprite(4, 0)!,
  BasketDashTreeSheet.getSprite(5, 0)!
];