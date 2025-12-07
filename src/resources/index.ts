import { ImageSource, Sound } from "excalibur";
import { CustomLoader } from "@/loaders/custom-loader";
import splashPng from "@/assets/splash/splash.png";
import buttonsPng from "@/assets/ui/buttons.png";
import cursorPng from "@/assets/ui/cursor.png";
import startPng from "@/assets/popup/start-sprite-466-262.png";
import timesUpPng from "@/assets/popup/times-up-512-192.png";
import menuMusicMp3 from "@/assets/music/menu.mp3";
import readyStartMp3 from "@/assets/sfx/sfx-ready-start.mp3";
import timesUpMp3 from "@/assets/sfx/sfx-times-up.mp3";
import scoreUpMp3 from "@/assets/sfx/sfx-score-up.mp3";
import select1Mp3 from "@/assets/sfx/sfx-select-1.mp3";
import select2Mp3 from "@/assets/sfx/sfx-select-2.mp3";
import select3Mp3 from "@/assets/sfx/sfx-select-3.mp3";
import menuBasketJpg from "@/assets/ui/menu-basket.jpg";
import menuRoleJpg from "@/assets/ui/menu-role.jpg";
import menuTennisJpg from "@/assets/ui/menu-tennis.jpg";
import menuFramePng from "@/assets/ui/menu-frame.png";
import menuFrameCursorPng from "@/assets/ui/menu-frame-selected.png";
import chutiWalkingPng from "@/assets/player/c_walk_74x138.png";


// It is convenient to put your resources in one place
export const Resources = {
  // images
  Splash: new ImageSource(splashPng),
  Buttons: new ImageSource(buttonsPng),
  Cursor: new ImageSource(cursorPng),
  Start: new ImageSource(startPng),
  TimesUp: new ImageSource(timesUpPng),
  //menu
  GameBasket: new ImageSource(menuBasketJpg),
  GameRole: new ImageSource(menuRoleJpg),
  GameTennis: new ImageSource(menuTennisJpg),
  MenuFrame: new ImageSource(menuFramePng),
  MenuFrameCursor: new ImageSource(menuFrameCursorPng),
  //player sprites
  ChutiWalking: new ImageSource(chutiWalkingPng),
  // music
  MenuMusic: new Sound(menuMusicMp3),
  // sfx
  ReadyStartSfx: new Sound(readyStartMp3),
  TimesUpSfx: new Sound(timesUpMp3),
  ScoreUpSfx: new Sound(scoreUpMp3),
  Select1Sfx: new Sound(select1Mp3),
  Select2Sfx: new Sound(select2Mp3),
  Select3Sfx: new Sound(select3Mp3),
} as const; // the "as const" is a neat typescript trick to get strong typing on your resources.

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new CustomLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
