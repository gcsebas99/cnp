import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const RoleRushDoorSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.Door,
  grid: {
    rows: 4,
    columns: 1,
    spriteWidth: 264,
    spriteHeight: 264
  }
});