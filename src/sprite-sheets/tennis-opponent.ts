import { range, SpriteSheet } from "excalibur";
import { Resources as TennisResources } from "@/resources/tennis-resources";

export const TennisOpponentSheet = SpriteSheet.fromImageSource({
  image: TennisResources.TennisOpponent,
  grid: {
    rows: 3,
    columns: 4,
    spriteWidth: 70,
    spriteHeight: 78
  }
});

export const TennisOpponentIndex = {
  idle: range((0 * 4), (0 * 4) + 2),
  run: range((1 * 4), (1 * 4) + 3),
  swing: range((2 * 4), (2 * 4) + 3),
};
