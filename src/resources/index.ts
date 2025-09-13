import { ImageSource, Sound } from "excalibur";
import { CustomLoader } from "../loaders/custom-loader";

// It is convenient to put your resources in one place
export const Resources = {
  // images
  Splash: new ImageSource("./src/assets/splash/splash.png"),
  Buttons: new ImageSource("./src/assets/ui/buttons.png"),
  Cursor: new ImageSource("./src/assets/ui/cursor.png"),
  // music
  MenuMusic: new Sound("./src/assets/music/3min-sample.mp3"),
} as const; // the "as const" is a neat typescript trick to get strong typing on your resources.

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new CustomLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
