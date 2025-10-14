import { Sprite, SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const PlatformWithFanSprite = Sprite.from(RoleRushResources.Terrain, {sourceView: {x: 1088, y: 64, width: 192, height: 21}});

export const RoleRushTerrainSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.Terrain,
  grid: {
    rows: 11,
    columns: 22,
    spriteWidth: 64,
    spriteHeight: 64
  }
});

export const RoleRushTerrainGrid = {
  groundGreen: {
    tl: RoleRushTerrainSheet.getSprite(6, 0)!,
    t: RoleRushTerrainSheet.getSprite(7, 0)!,
    tr: RoleRushTerrainSheet.getSprite(8, 0)!,
    l: RoleRushTerrainSheet.getSprite(6, 1)!,
    c: RoleRushTerrainSheet.getSprite(7, 1)!,
    r: RoleRushTerrainSheet.getSprite(8, 1)!,
    bl: RoleRushTerrainSheet.getSprite(6, 2)!,
    b: RoleRushTerrainSheet.getSprite(7, 2)!,
    br: RoleRushTerrainSheet.getSprite(8, 2)!
  },
  groundOrange: {
    tl: RoleRushTerrainSheet.getSprite(6, 4)!,
    t: RoleRushTerrainSheet.getSprite(7, 4)!,
    tr: RoleRushTerrainSheet.getSprite(8, 4)!,
    l: RoleRushTerrainSheet.getSprite(6, 5)!,
    c: RoleRushTerrainSheet.getSprite(7, 5)!,
    r: RoleRushTerrainSheet.getSprite(8, 5)!,
    bl: RoleRushTerrainSheet.getSprite(6, 6)!,
    b: RoleRushTerrainSheet.getSprite(7, 6)!,
    br: RoleRushTerrainSheet.getSprite(8, 6)!
  },
  groundPink: {
    tl: RoleRushTerrainSheet.getSprite(6, 8)!,
    t: RoleRushTerrainSheet.getSprite(7, 8)!,
    tr: RoleRushTerrainSheet.getSprite(8, 8)!,
    l: RoleRushTerrainSheet.getSprite(6, 9)!,
    c: RoleRushTerrainSheet.getSprite(7, 9)!,
    r: RoleRushTerrainSheet.getSprite(8, 9)!,
    bl: RoleRushTerrainSheet.getSprite(6, 10)!,
    b: RoleRushTerrainSheet.getSprite(7, 10)!,
    br: RoleRushTerrainSheet.getSprite(8, 10)!
  },
};
