import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const InjectionSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.InjectionTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 33,
    spriteHeight: 96
  }
});

export const InjectionSprite = {
  default: InjectionSheet.getSprite(0, 0)!,
  highlight: InjectionSheet.getSprite(1, 0)!
};