import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";
import { PopupManager } from "@/managers/popup-manager";

export const TimesUpSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.TimesUp,
  grid: {
    rows: 2,
    columns: 1,
    spriteWidth: 512,
    spriteHeight: 96
  }
});

export const animTimesUpSprite = PopupManager.createAnimatedSprite(
  TimesUpSpriteSheet,
  [0, 1],
  300,
  true
);