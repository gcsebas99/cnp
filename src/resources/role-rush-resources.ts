//import { ImageSource } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";

const RoleRushMapUrl = getLdtkMapPath("role-rush.ldtk");

export const Resources = {
  // BgTennisGrassCourt: new ImageSource(tennisGrassUrl),
  // BgSkyClouds: new ImageSource(skyCloudsUrl),
  // BgSkyNightClouds: new ImageSource(skyNightCloudsUrl),
  // RacketRed: new ImageSource(racketRedUrl),
  // RacketBlue: new ImageSource(racketBlueUrl),
};

export const RoleRushMap = new LdtkResource(RoleRushMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(RoleRushMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
