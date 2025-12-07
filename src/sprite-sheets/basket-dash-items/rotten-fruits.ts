import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { HighlightSprite } from "@/types/highlight-sprite";

export const RottenFruitsSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.RottenFruits,
  grid: {
    rows: 3,
    columns: 2,
    spriteWidth: 56,
    spriteHeight: 56
  }
});

export const RottenFruits:HighlightSprite[] = [
  {
    default: RottenFruitsSheet.getSprite(0, 0)!,
    highlight: RottenFruitsSheet.getSprite(1, 0)!
  },
  {
    default: RottenFruitsSheet.getSprite(0, 1)!,
    highlight: RottenFruitsSheet.getSprite(1, 1)!
  },
  {
    default: RottenFruitsSheet.getSprite(0, 2)!,
    highlight: RottenFruitsSheet.getSprite(1, 2)!
  },
];