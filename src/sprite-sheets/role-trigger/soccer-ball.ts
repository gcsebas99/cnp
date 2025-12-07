import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const SoccerBallSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.SoccerBallTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 96,
    spriteHeight: 96
  }
});

export const SoccerBallSprite = {
  default: SoccerBallSheet.getSprite(0, 0)!,
  highlight: SoccerBallSheet.getSprite(1, 0)!
};