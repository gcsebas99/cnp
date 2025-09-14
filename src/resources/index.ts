import { ImageSource, Sound } from "excalibur";
import { CustomLoader } from "@/loaders/custom-loader";
import splashPng from "@/assets/splash/splash.png";
import buttonsPng from "@/assets/ui/buttons.png";
import cursorPng from "@/assets/ui/cursor.png";
import sampleMusicMp3 from "@/assets/music/3min-sample.mp3";

// It is convenient to put your resources in one place
export const Resources = {
  // images
  Splash: new ImageSource(splashPng),
  Buttons: new ImageSource(buttonsPng),
  Cursor: new ImageSource(cursorPng),
  // music
  MenuMusic: new Sound(sampleMusicMp3),
} as const; // the "as const" is a neat typescript trick to get strong typing on your resources.

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new CustomLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
