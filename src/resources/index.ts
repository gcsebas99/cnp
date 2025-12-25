import { ImageSource, Sound } from "excalibur";
import { CustomLoader } from "@/loaders/custom-loader";
import splashJpg from "@/assets/splash/cyn-splash.jpg";
import cynLogoPng from "@/assets/ui/cyn-logo.png";
import buttonsPng from "@/assets/ui/buttons.png";
import cursorPng from "@/assets/ui/cursor.png";
import startPng from "@/assets/popup/start-sprite-466-262.png";
import timesUpPng from "@/assets/popup/times-up-512-192.png";
import menuMusicMp3 from "@/assets/music/menu-2.mp3";
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
import bgBluePng from "@/assets/menu-bg/Blue.png";
import bgBrownPng from "@/assets/menu-bg/Brown.png";
import bgGrayPng from "@/assets/menu-bg/Gray.png";
import bgGreenPng from "@/assets/menu-bg/Green.png";
import bgPinkPng from "@/assets/menu-bg/Pink.png";
import bgPurplePng from "@/assets/menu-bg/Purple.png";
import bgYellowPng from "@/assets/menu-bg/Yellow.png";
import chutiPickerPng from "@/assets/ui/chuti-picker.png";
import neitiPickerPng from "@/assets/ui/neiti-picker.png";

//chuti sfx
import chutiMiTurnoMp3 from "@/assets/sfx/player-sfx/chuti/mi-turno.mp3";
import chutiVoyYoMp3 from "@/assets/sfx/player-sfx/chuti/voy-yo.mp3";
import chutiSiMp3 from "@/assets/sfx/player-sfx/chuti/si.mp3";
import chutiOhNoMp3 from "@/assets/sfx/player-sfx/chuti/oh-no.mp3";
import chutiApureMp3 from "@/assets/sfx/player-sfx/chuti/apure.mp3";
import chutiMmQueRicoMp3 from "@/assets/sfx/player-sfx/chuti/mm-que-rico.mp3";
import chutiWaaMp3 from "@/assets/sfx/player-sfx/chuti/waa.mp3";
import chutiWooHooMp3 from "@/assets/sfx/player-sfx/chuti/woo-hoo.mp3";
import chutiOtraVezMp3 from "@/assets/sfx/player-sfx/chuti/otra-vez.mp3";
import chutiAuAuMp3 from "@/assets/sfx/player-sfx/chuti/au-au.mp3";
import chutiEsoNoEraMp3 from "@/assets/sfx/player-sfx/chuti/eso-no-era.mp3";
import chutiJaJa1Mp3 from "@/assets/sfx/player-sfx/chuti/ja-ja-1.mp3";
import chutiJaJa2Mp3 from "@/assets/sfx/player-sfx/chuti/ja-ja-2.mp3";
//neiti sfx
import neitiMiTurnoMp3 from "@/assets/sfx/player-sfx/neiti/mi-turno.mp3";
import neitiVoyYoMp3 from "@/assets/sfx/player-sfx/neiti/voy-yo.mp3";
import neitiSiMp3 from "@/assets/sfx/player-sfx/neiti/si.mp3";
import neitiOhNoMp3 from "@/assets/sfx/player-sfx/neiti/oh-no.mp3";
import neitiApureMp3 from "@/assets/sfx/player-sfx/neiti/apure.mp3";
import neitiMmQueRicoMp3 from "@/assets/sfx/player-sfx/neiti/mm-que-rico.mp3";
import neitiWaaMp3 from "@/assets/sfx/player-sfx/neiti/waa.mp3";
import neitiWooHooMp3 from "@/assets/sfx/player-sfx/neiti/woo-hoo.mp3";
import neitiOtraVezMp3 from "@/assets/sfx/player-sfx/neiti/otra-vez.mp3";
import neitiAuAuMp3 from "@/assets/sfx/player-sfx/neiti/au-au.mp3";
import neitiEsoNoEraMp3 from "@/assets/sfx/player-sfx/neiti/eso-no-era.mp3";
import neitiJaJa1Mp3 from "@/assets/sfx/player-sfx/neiti/ja-ja-1.mp3";
import neitiJaJa2Mp3 from "@/assets/sfx/player-sfx/neiti/ja-ja-2.mp3";
//player sprites
import playerBodyPng from "@/assets/player/player-body-74x74.png";
import chutiFacesPng from "@/assets/player/chuti-head-74x84x10.png";
import neitiFacesPng from "@/assets/player/neiti-head-74x84x10.png";

import playerPuffMp3 from "@/assets/sfx/sfx-player-puff.mp3";


// It is convenient to put your resources in one place
export const Resources = {
  // images
  Splash: new ImageSource(splashJpg),
  CYNLogo: new ImageSource(cynLogoPng),
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
  //menu backgrounds
  MenuBgBlue: new ImageSource(bgBluePng),
  MenuBgBrown: new ImageSource(bgBrownPng),
  MenuBgGray: new ImageSource(bgGrayPng),
  MenuBgGreen: new ImageSource(bgGreenPng),
  MenuBgPink: new ImageSource(bgPinkPng),
  MenuBgPurple: new ImageSource(bgPurplePng),
  MenuBgYellow: new ImageSource(bgYellowPng),
  // player picker
  ChutiPicker: new ImageSource(chutiPickerPng),
  NeitiPicker: new ImageSource(neitiPickerPng),
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
  PlayerPuff: new Sound(playerPuffMp3),
  //chuti sfx
  ChutiMiTurnoSfx: new Sound(chutiMiTurnoMp3),
  ChutiVoyYoSfx: new Sound(chutiVoyYoMp3),
  ChutiSiSfx: new Sound(chutiSiMp3),
  ChutiOhNoSfx: new Sound(chutiOhNoMp3),
  ChutiApureSfx: new Sound(chutiApureMp3),
  ChutiMmQueRicoSfx: new Sound(chutiMmQueRicoMp3),
  ChutiWaaSfx: new Sound(chutiWaaMp3),
  ChutiWooHooSfx: new Sound(chutiWooHooMp3),
  ChutiOtraVezSfx: new Sound(chutiOtraVezMp3),
  ChutiAuAuSfx: new Sound(chutiAuAuMp3),
  ChutiEsoNoEraSfx: new Sound(chutiEsoNoEraMp3),
  ChutiJaJa1Sfx: new Sound(chutiJaJa1Mp3),
  ChutiJaJa2Sfx: new Sound(chutiJaJa2Mp3),
  //neiti sfx
  NeitiMiTurnoSfx: new Sound(neitiMiTurnoMp3),
  NeitiVoyYoSfx: new Sound(neitiVoyYoMp3),
  NeitiSiSfx: new Sound(neitiSiMp3),
  NeitiOhNoSfx: new Sound(neitiOhNoMp3),
  NeitiApureSfx: new Sound(neitiApureMp3),
  NeitiMmQueRicoSfx: new Sound(neitiMmQueRicoMp3),
  NeitiWaaSfx: new Sound(neitiWaaMp3),
  NeitiWooHooSfx: new Sound(neitiWooHooMp3),
  NeitiOtraVezSfx: new Sound(neitiOtraVezMp3),
  NeitiAuAuSfx: new Sound(neitiAuAuMp3),
  NeitiEsoNoEraSfx: new Sound(neitiEsoNoEraMp3),
  NeitiJaJa1Sfx: new Sound(neitiJaJa1Mp3),
  NeitiJaJa2Sfx: new Sound(neitiJaJa2Mp3),
  //player sprites
  PlayerBody: new ImageSource(playerBodyPng),
  ChutiFaces: new ImageSource(chutiFacesPng),
  NeitiFaces: new ImageSource(neitiFacesPng),

} as const; // the "as const" is a neat typescript trick to get strong typing on your resources.

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new CustomLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
