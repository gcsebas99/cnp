import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const SpoonSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.SpoonTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 83,
    spriteHeight: 96
  }
});

export const SpoonSprite = {
  default: SpoonSheet.getSprite(0, 0)!,
  highlight: SpoonSheet.getSprite(1, 0)!
};