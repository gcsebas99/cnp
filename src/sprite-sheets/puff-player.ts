import { SpriteSheet } from "excalibur";
import { Resources as TennisResources } from "@/resources/tennis-resources";

export const PuffPlayerSheet = SpriteSheet.fromImageSource({
  image: TennisResources.PuffPlayer,
  grid: {
    rows: 1,
    columns: 13,
    spriteWidth: 128,
    spriteHeight: 128
  }
});