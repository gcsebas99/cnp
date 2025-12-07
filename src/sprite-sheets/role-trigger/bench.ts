import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const BenchSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.BenchTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 134,
    spriteHeight: 96
  }
});

export const BenchSprite = {
  default: BenchSheet.getSprite(0, 0)!,
  highlight: BenchSheet.getSprite(1, 0)!
};