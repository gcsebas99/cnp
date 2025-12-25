import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const PuffHatSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.HatPuffVfx,
  grid: {
    rows: 1,
    columns: 11,
    spriteWidth: 64,
    spriteHeight: 64
  }
});