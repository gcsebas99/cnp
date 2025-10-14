import { ImageSource, Sound } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import terrainUrl from "@/assets/role-rush/RoleRushTerrain (64x64).png";
import bgBlueUrl from "@/assets/role-rush/bg/Blue.png";
import bgBrownUrl from "@/assets/role-rush/bg/Brown.png";
import doorUrl from "@/assets/role-rush/door-264-1056.png";
import invertedFanUrl from "@/assets/role-rush/inverted-fan.png";
import elevatorMarkerUrl from "@/assets/role-rush/elevator-marker.png";
import doorOpenMp3 from "@/assets/role-rush/sfx/door-open.mp3";
import doorCloseMp3 from "@/assets/role-rush/sfx/door-close.mp3";
import fanUpMp3 from "@/assets/role-rush/sfx/fan-up.mp3";
import fanDownMp3 from "@/assets/role-rush/sfx/fan-down.mp3";

const RoleRushMapUrl = getLdtkMapPath("role-rush.ldtk");

export const Resources = {
  Terrain: new ImageSource(terrainUrl),
  BgBlue: new ImageSource(bgBlueUrl),
  BgBrown: new ImageSource(bgBrownUrl),
  //
  Door: new ImageSource(doorUrl),
  InvertedFan: new ImageSource(invertedFanUrl),
  ElevatorMarker: new ImageSource(elevatorMarkerUrl),
  // sfx
  DoorOpenSfx: new Sound(doorOpenMp3),
  DoorCloseSfx: new Sound(doorCloseMp3),
  FanUpSfx: new Sound(fanUpMp3),
  FanDownSfx: new Sound(fanDownMp3),
};

export const RoleRushMap = new LdtkResource(RoleRushMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(RoleRushMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
