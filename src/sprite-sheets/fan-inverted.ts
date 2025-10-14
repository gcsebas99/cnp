import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const InvertedFanSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.InvertedFan,
  grid: {
    rows: 1,
    columns: 4,
    spriteWidth: 64,
    spriteHeight: 21
  }
});