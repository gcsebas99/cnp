import { SpriteSheet } from "excalibur";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";

export const ElevatorMarkerSheet = SpriteSheet.fromImageSource({
  image: RoleRushResources.ElevatorMarker,
  grid: {
    rows: 1,
    columns: 2,
    spriteWidth: 64,
    spriteHeight: 64
  }
});