import { DisplayMode, Engine } from "excalibur";
import { loader } from "@/resources";
import { loader as endGameLoader } from "@/resources/end-game-resources";
import { InputManager } from "@/managers/input-manager";
import { PersistentGameStateManager } from "@/managers/persistent-game-state-manager";
//
import { SplashScene } from "@/scenes/splash-scene";
import { MenuScene } from "@/scenes/menu-scene";
import { PauseScene } from "@/scenes/pause-scene";
import { EndGameScene } from "@/scenes/end-game-scene";
//
import { PHYSICS_CONFIG } from "@/config/physiscs";
import { PopupManager } from "@/managers/popup-manager";
import { GuiManager } from "@/managers/gui-manager";
import { PauseManager } from "@/managers/pause-manager";
import { SceneManager } from "@/managers/scene-manager";
import { FullscreenManager } from "@/managers/fullscreen-manager";
import { EndGameManager } from "@/managers/end-game-manager";
import { disposeAllManagers } from "@/managers/dispose-all-managers";

// Goal is to keep main.ts small and just enough to configure the engine

//dispose all managers first when reloading the game
disposeAllManagers();


const game = new Engine({
  width: 2304,
  height: 1280,
  displayMode: DisplayMode.FitScreen,
  pixelRatio: 1, //TODO: check warning and test (antialiasing: true)
  pixelArt: true,
  suppressPlayButton: true,
  scenes: {
    splash: SplashScene,
    pause: PauseScene,
    menu: MenuScene,
    endgame: {scene: EndGameScene, loader: endGameLoader},
  },
});

window.addEventListener("beforeunload", () => {
  console.log("||--Disposing Excalibur engine before reload...");
  if (game && !game.isDisposed()) {
      game.dispose();
      console.log("||--ENGINE DISPOSED!!!!!");
  }
  window.removeEventListener("beforeunload", () => {});
});


SceneManager.init(game)
SceneManager.instance.addGameScenes();
FullscreenManager.init(game);
InputManager.init(game);
GuiManager.init(game);
PopupManager.init(game);
PauseManager.init(game);
PersistentGameStateManager.init();
EndGameManager.init(game);

game.physics.gravity = PHYSICS_CONFIG.gravity;

game.start("splash", {loader}).then(() => {

});
