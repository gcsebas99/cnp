//import { ImageSource } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import { ImageSource } from "excalibur";
import skyCloudsUrl from "@/assets/basket-dash/sky-with-clouds.jpg";
import treeUrl from "@/assets/basket-dash/autumn-tree.png";
import treeLeavesUrl from "@/assets/basket-dash/autumn-leaves.png";
import ballUrl from "@/assets/tennis/tennis-ball.png";

const BasketDashMapUrl = getLdtkMapPath("basket-dash.ldtk");

export const Resources = {
  SkyClouds: new ImageSource(skyCloudsUrl),
  Tree: new ImageSource(treeUrl),
  TreeLeaves: new ImageSource(treeLeavesUrl),
  Ball: new ImageSource(ballUrl),
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
