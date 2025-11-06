import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";
import { PopupManager } from "@/managers/popup-manager";

export const StartSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.Start,
  grid: {
    rows: 2,
    columns: 1,
    spriteWidth: 466,
    spriteHeight: 131
  }
});

export const animStartSprite = PopupManager.createAnimatedSprite(
  StartSpriteSheet,
  [0, 1],
  300,
  true
);