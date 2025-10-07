import { ImageSource, Sound } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import tennisGrassUrl from "@/assets/tennis/tennis-grass.png";
import skyCloudsUrl from "@/assets/tennis/clouds.jpg";
import skyNightCloudsUrl from "@/assets/tennis/night-clouds.jpg";
import racketRedUrl from "@/assets/tennis/racket-red.png";
import racketBlueUrl from "@/assets/tennis/racket-blue.png";
import ballUrl from "@/assets/tennis/tennis-ball.png";
import bounceMp3 from "@/assets/tennis/sfx/sfx-bouncing-ball.mp3";
import hitMp3 from "@/assets/tennis/sfx/sfx-ball-hit.mp3";
import solidHitMp3 from "@/assets/tennis/sfx/sfx-ball-solid-hit.mp3";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";

const TennisMapUrl = getLdtkMapPath("tennis.ldtk");

export const Resources = {
  BgTennisGrassCourt: new ImageSource(tennisGrassUrl),
  BgSkyClouds: new ImageSource(skyCloudsUrl),
  BgSkyNightClouds: new ImageSource(skyNightCloudsUrl),
  RacketRed: new ImageSource(racketRedUrl),
  RacketBlue: new ImageSource(racketBlueUrl),
  Ball: new ImageSource(ballUrl),
  // sfx
  BounceSfx: new Sound(bounceMp3),
  BallHitSfx: new Sound(hitMp3),
  BallSolidHitSfx: new Sound(solidHitMp3),
};

export const TennisMap = new LdtkResource(TennisMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(TennisMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
