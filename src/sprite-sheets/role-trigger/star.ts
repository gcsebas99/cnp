import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const StarSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.StarTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 96,
    spriteHeight: 96
  }
});

export const StarSprite = {
  default: StarSheet.getSprite(0, 0)!,
  highlight: StarSheet.getSprite(1, 0)!
};