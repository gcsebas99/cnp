import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";

export const ButtonSheet = SpriteSheet.fromImageSource({
  image: Resources.Buttons,
  grid: {
    rows: 3,
    columns: 2,
    spriteWidth: 16,
    spriteHeight: 16
  }
});

export const Buttons = {
  blue: {
    default: ButtonSheet.getSprite(0, 0)!,
    pressed: ButtonSheet.getSprite(1, 0)!
  },
  red: {
    default: ButtonSheet.getSprite(0, 1)!,
    pressed: ButtonSheet.getSprite(1, 1)!
  },
  yellow: {
    default: ButtonSheet.getSprite(0, 2)!,
    pressed: ButtonSheet.getSprite(1, 2)!
  }
};
