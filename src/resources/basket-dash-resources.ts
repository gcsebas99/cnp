//import { ImageSource } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";

const BasketDashMapUrl = getLdtkMapPath("basket-dash.ldtk");

export const Resources = {
  // BgTennisGrassCourt: new ImageSource(tennisGrassUrl),
  // BgSkyClouds: new ImageSource(skyCloudsUrl),
  // BgSkyNightClouds: new ImageSource(skyNightCloudsUrl),
  // RacketRed: new ImageSource(racketRedUrl),
  // RacketBlue: new ImageSource(racketBlueUrl),
};

export const BasketDashMap = new LdtkResource(BasketDashMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(BasketDashMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
