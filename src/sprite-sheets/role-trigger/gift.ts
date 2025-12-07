import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const GiftSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.GiftTrigger,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 98,
    spriteHeight: 96
  }
});

export const GiftSprite = {
  default: GiftSheet.getSprite(0, 0)!,
  highlight: GiftSheet.getSprite(1, 0)!
};