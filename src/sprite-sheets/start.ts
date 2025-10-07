import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";

export const StartSSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.Start,
  grid: {
    rows: 2,
    columns: 1,
    spriteWidth: 466,
    spriteHeight: 131
  }
});
