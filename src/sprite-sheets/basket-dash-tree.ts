import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export const BasketDashTreeSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.Tree,
  grid: {
    rows: 2,
    columns: 1,
    spriteWidth: 2050,
    spriteHeight: 1206
  }
});

export const BasketDashTreeParts = {
  trunk: BasketDashTreeSheet.getSprite(0, 0)!,
  foliage: BasketDashTreeSheet.getSprite(0, 1)!
};