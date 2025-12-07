import { SpriteSheet } from "excalibur";
import { Resources as BasketDashResources } from "@/resources/basket-dash-resources";

export const FruitsSheet = SpriteSheet.fromImageSource({
  image: BasketDashResources.Fruits,
  grid: {
    rows: 1,
    columns: 20,
    spriteWidth: 48,
    spriteHeight: 48
  }
});

export const Fruits = [
  FruitsSheet.getSprite(0, 0)!,
  FruitsSheet.getSprite(1, 0)!,
  FruitsSheet.getSprite(2, 0)!,
  FruitsSheet.getSprite(3, 0)!,
  FruitsSheet.getSprite(4, 0)!,
  FruitsSheet.getSprite(5, 0)!,
  FruitsSheet.getSprite(6, 0)!,
  FruitsSheet.getSprite(7, 0)!,
  FruitsSheet.getSprite(8, 0)!,
  FruitsSheet.getSprite(9, 0)!,
  FruitsSheet.getSprite(10, 0)!,
  FruitsSheet.getSprite(11, 0)!,
  FruitsSheet.getSprite(12, 0)!,
  FruitsSheet.getSprite(13, 0)!,
  FruitsSheet.getSprite(14, 0)!,
  FruitsSheet.getSprite(15, 0)!,
  FruitsSheet.getSprite(16, 0)!,
  FruitsSheet.getSprite(17, 0)!,
  FruitsSheet.getSprite(18, 0)!,
  FruitsSheet.getSprite(19, 0)!,
];