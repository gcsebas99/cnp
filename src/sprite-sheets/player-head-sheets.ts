import { SpriteSheet } from "excalibur";
import { Resources } from "@/resources";

export const ChutiHeadSheet = SpriteSheet.fromImageSource({
  image: Resources.ChutiFaces,
  grid: {
    rows: 1,
    columns: 10,
    spriteWidth: 74,
    spriteHeight: 84
  }
});

export const NeitiHeadSheet = SpriteSheet.fromImageSource({
  image: Resources.NeitiFaces,
  grid: {
    rows: 1,
    columns: 10,
    spriteWidth: 74,
    spriteHeight: 84
  }
});

export const FaceMap = {
  HAIR: 0,
  FRONT_HAPPY_1: 1,
  FRONT_HAPPY_2: 2,
  FRONT_OH: 3,
  FRONT_YELL: 4,
  FRONT_SAD: 5,
  LOOK_UP: 6,
  SIDE_HAPPY_1: 7,
  SIDE_YELL: 8,
  SIDE_HAPPY_2: 9
} as const;