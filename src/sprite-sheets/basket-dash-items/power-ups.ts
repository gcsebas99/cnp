import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { HighlightSprite } from "@/types/highlight-sprite";

export const PowerUpsSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.Powerups,
  grid: {
    rows: 2,
    columns: 2,
    spriteWidth: 56,
    spriteHeight: 56
  }
});

export const PowerUps:HighlightSprite[] = [
  {
    default: PowerUpsSheet.getSprite(0, 0)!,
    highlight: PowerUpsSheet.getSprite(1, 0)!
  },
  {
    default: PowerUpsSheet.getSprite(0, 1)!,
    highlight: PowerUpsSheet.getSprite(1, 1)!
  },
];