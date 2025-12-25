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
import cheering1Mp3 from "@/assets/tennis/sfx/sfx-cheering-1.mp3";
import cheering2Mp3 from "@/assets/tennis/sfx/sfx-cheering-2.mp3";
import cheering3Mp3 from "@/assets/tennis/sfx/sfx-cheering-3.mp3";
import welcomeChutiMp3 from "@/assets/tennis/sfx/sfx-welcome-chuti.mp3";
import welcomeNeitiMp3 from "@/assets/tennis/sfx/sfx-welcome-neiti.mp3";
import helloMp3 from "@/assets/tennis/sfx/hello.mp3";
import puffPlayerUrl from "@/assets/vfx/puff-player-2x.png";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import tennisOpponentPng from "@/assets/tennis/tennis-opponent-spritesheet.png";

const TennisMapUrl = getLdtkMapPath("tennis.ldtk");

export const Resources = {
  BgTennisGrassCourt: new ImageSource(tennisGrassUrl),
  BgSkyClouds: new ImageSource(skyCloudsUrl),
  BgSkyNightClouds: new ImageSource(skyNightCloudsUrl),
  RacketRed: new ImageSource(racketRedUrl),
  RacketBlue: new ImageSource(racketBlueUrl),
  Ball: new ImageSource(ballUrl),
  TennisOpponent: new ImageSource(tennisOpponentPng),
  // sfx
  BounceSfx: new Sound(bounceMp3),
  BallHitSfx: new Sound(hitMp3),
  BallSolidHitSfx: new Sound(solidHitMp3),
  Cheering1Sfx: new Sound(cheering1Mp3),
  Cheering2Sfx: new Sound(cheering2Mp3),
  Cheering3Sfx: new Sound(cheering3Mp3),
  WelcomeChutiSfx: new Sound(welcomeChutiMp3),
  WelcomeNeitiSfx: new Sound(welcomeNeitiMp3),
  HelloMusic: new Sound(helloMp3),
  //vfx
  PuffPlayer: new ImageSource(puffPlayerUrl),
};

export const TennisMap = new LdtkResource(TennisMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(TennisMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
