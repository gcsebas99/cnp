import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";

export const CursorSheet = SpriteSheet.fromImageSource({
  image: Resources.Cursor,
  grid: {
    rows: 1,
    columns: 1,
    spriteWidth: 30,
    spriteHeight: 30
  }
});
