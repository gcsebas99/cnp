import { SpriteSheet } from "excalibur";
import { Resources  } from "@/resources";

export const ChutiWalkingSheet = SpriteSheet.fromImageSource({
  image: Resources.ChutiWalking,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 74,
    spriteHeight: 138
  }
});
