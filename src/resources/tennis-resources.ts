import { ImageSource, Loader } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import tennisGrassUrl from "../assets/tennis/tennis-grass.png";
import skyCloudsUrl from "../assets/tennis/clouds.jpg";
import skyNightCloudsUrl from "../assets/tennis/night-clouds.jpg";
import { CustomLoader } from "../loaders/custom-loader";
// // import chutiUrl from "../assets/chuti.png";
// // import neitiUrl from "../assets/neiti.png";

const TennisMapUrl = "src/../ldtk-workspace/tennis.ldtk";

export const Resources = {
  BgTennisGrassCourt: new ImageSource(tennisGrassUrl),
  BgSkyClouds: new ImageSource(skyCloudsUrl),
  BgSkyNightClouds: new ImageSource(skyNightCloudsUrl),
  // Chuti: new ImageSource(chutiUrl),
  // Neiti: new ImageSource(neitiUrl),
};

export const TennisMap = new LdtkResource(TennisMapUrl, {
  strict: false
});
export const loader = new CustomLoader(); // Loader([TennisMap]);
loader.addResource(TennisMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
