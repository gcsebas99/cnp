import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";
import { HighlightSprite } from "@/types/highlight-sprite";

export const TrashSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.Trash,
  grid: {
    rows: 6,
    columns: 2,
    spriteWidth: 56,
    spriteHeight: 56
  }
});

export const Trash:HighlightSprite[] = [
  {
    default: TrashSheet.getSprite(0, 0)!,
    highlight: TrashSheet.getSprite(1, 0)!
  },
  {
    default: TrashSheet.getSprite(0, 1)!,
    highlight: TrashSheet.getSprite(1, 1)!
  },
  {
    default: TrashSheet.getSprite(0, 2)!,
    highlight: TrashSheet.getSprite(1, 2)!
  },
  {
    default: TrashSheet.getSprite(0, 3)!,
    highlight: TrashSheet.getSprite(1, 3)!
  },
  {
    default: TrashSheet.getSprite(0, 4)!,
    highlight: TrashSheet.getSprite(1, 4)!
  },
  {
    default: TrashSheet.getSprite(0, 5)!,
    highlight: TrashSheet.getSprite(1, 5)!
  },
];
