import { ImageSource, Sound } from "excalibur";
import { CustomLoader } from "@/loaders/custom-loader";
import tennisEndJpg from "@/assets/tennis/tennis-score.jpg";
import basketDashEndJpg from "@/assets/basket-dash/basket-score.jpg";
import roleRushEndJpg from "@/assets/role-rush/role-score.jpg";
import endGame1Mp3 from "@/assets/sfx/sfx-endgame-1.mp3";
import endGame2Mp3 from "@/assets/sfx/sfx-endgame-2.mp3";
import endGame3Mp3 from "@/assets/sfx/sfx-endgame-3.mp3";

export const Resources = {
  TennisEndBg: new ImageSource(tennisEndJpg),
  BasketDashEndBg: new ImageSource(basketDashEndJpg),
  RoleRushEndBg: new ImageSource(roleRushEndJpg),
  // music
  EndGameMusic1: new Sound(endGame1Mp3),
  EndGameMusic2: new Sound(endGame2Mp3),
  EndGameMusic3: new Sound(endGame3Mp3),
} as const;

export const loader = new CustomLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
