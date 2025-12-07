import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import { ImageSource } from "excalibur";
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


  //to be integrated in game
  Fruits: new ImageSource(fruitsUrl),
  RottenFruits: new ImageSource(rottenFruitsUrl),
  Trash: new ImageSource(trashUrl),
  Powerups: new ImageSource(powerupsUrl),
  Basket: new ImageSource(basketUrl),
  Barrel: new ImageSource(barrelUrl),
  Box1: new ImageSource(box1Url),
  Box2: new ImageSource(box2Url),
  HayBale: new ImageSource(hayBaleUrl),
};

export const BasketDashMap = new LdtkResource(BasketDashMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(BasketDashMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
