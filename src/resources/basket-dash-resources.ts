import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import { ImageSource, Sound } from "excalibur";
import skyCloudsUrl from "@/assets/basket-dash/sky-with-clouds.jpg";
import treeUrl from "@/assets/basket-dash/autumn-tree.png";
import treeLeavesUrl from "@/assets/basket-dash/autumn-leaves.png";
import frogUrl from "@/assets/basket-dash/frog.png";
import appleUrl from "@/assets/basket-dash/apple.png";
import branch1Url from "@/assets/basket-dash/branch-1.png";
import branch2Url from "@/assets/basket-dash/branch-2.png";
import branch3Url from "@/assets/basket-dash/branch-3.png";
import branch4Url from "@/assets/basket-dash/branch-4.png";
import fruitsUrl from "@/assets/basket-dash/fruits.png";
import rottenFruitsUrl from "@/assets/basket-dash/rotten-fruits.png";
import trashUrl from "@/assets/basket-dash/trash.png";
import powerupsUrl from "@/assets/basket-dash/powerups.png";
import basketUrl from "@/assets/basket-dash/basket.png";
import barrelUrl from "@/assets/basket-dash/barrel.png";
import box1Url from "@/assets/basket-dash/box-1.png";
import box2Url from "@/assets/basket-dash/box-2.png";
import hayBaleUrl from "@/assets/basket-dash/hay.png";
import basketDashMusicMp3 from "@/assets/music/basket-dash.mp3";
import bushShakeMp3 from "@/assets/basket-dash/sfx/bush-shake.mp3";
import powerUpMp3 from "@/assets/basket-dash/sfx/power-up.mp3";
import introMp3 from "@/assets/basket-dash/sfx/bd-intro.mp3";
import startMp3 from "@/assets/basket-dash/sfx/bd-start.mp3";
import cheering2Mp3 from "@/assets/tennis/sfx/sfx-cheering-2.mp3";

const BasketDashMapUrl = getLdtkMapPath("basket-dash.ldtk");

export const Resources = {
  SkyClouds: new ImageSource(skyCloudsUrl),
  Tree: new ImageSource(treeUrl),
  TreeLeaves: new ImageSource(treeLeavesUrl),
  Frog: new ImageSource(frogUrl),
  //branches
  Branch1: new ImageSource(branch1Url),
  Branch2: new ImageSource(branch2Url),
  Branch3: new ImageSource(branch3Url),
  Branch4: new ImageSource(branch4Url),
  //fruits
  Apple: new ImageSource(appleUrl),
  Fruits: new ImageSource(fruitsUrl),
  RottenFruits: new ImageSource(rottenFruitsUrl),
  Trash: new ImageSource(trashUrl),
  Powerups: new ImageSource(powerupsUrl),
  Basket: new ImageSource(basketUrl),
  Barrel: new ImageSource(barrelUrl),
  Box1: new ImageSource(box1Url),
  Box2: new ImageSource(box2Url),
  HayBale: new ImageSource(hayBaleUrl),
  // sfx
  BushShake: new Sound(bushShakeMp3),
  PowerUp: new Sound(powerUpMp3),
  IntroSfx: new Sound(introMp3),
  StartSfx: new Sound(startMp3),
  Cheering2Sfx: new Sound(cheering2Mp3),
  // music
  BasketDashMusic: new Sound(basketDashMusicMp3),
};

export const BasketDashMap = new LdtkResource(BasketDashMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(BasketDashMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
