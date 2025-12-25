import { range, SpriteSheet } from "excalibur";
import { Resources } from "@/resources";

export const PlayerBodySheet = SpriteSheet.fromImageSource({
  image: Resources.PlayerBody,
  grid: {
    rows: 14,
    columns: 7,
    spriteWidth: 74,
    spriteHeight: 74
  }
});

export const PlayerBodyIndexNeiti = {
  tennisIdle: range((0 * 7), (0 * 7) + 5),
  tennisRun: range((2 * 7), (2 * 7) + 4),
  tennisSwing: range((4 * 7), (4 * 7) + 3),
  idle: range((6 * 7), (6 * 7) + 6),
  walkRun: range((8 * 7), (8 * 7) + 5),
  jump: range((10 * 7), (10 * 7) + 3),
  celebrate: range((12 * 7), (12 * 7) + 4)
};

export const PlayerBodyIndexChuti = {
  tennisIdle: range((1 * 7), (1 * 7) + 5),
  tennisRun: range((3 * 7), (3 * 7) + 4),
  tennisSwing: range((5 * 7), (5 * 7) + 3),
  idle: range((7 * 7), (7 * 7) + 6),
  walkRun: range((9 * 7), (9 * 7) + 5),
  jump: range((11 * 7), (11 * 7) + 3),
  celebrate: range((13 * 7), (13 * 7) + 4)
};