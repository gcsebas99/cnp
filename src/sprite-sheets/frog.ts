import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export const FrogSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.Frog,
  grid: {
    rows: 1,
    columns: 14,
    spriteWidth: 27,
    spriteHeight: 20
  }
});
