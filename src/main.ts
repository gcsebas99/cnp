import { DisplayMode, Engine } from "excalibur";
import { loader } from "@/resources";
import { InputManager } from "@/managers/input-manager";
import { PersistentGameStateManager } from "@/managers/persistent-game-state-manager";
//
import { SplashScene } from "@/scenes/splash-scene";
import { MenuScene } from "@/scenes/menu-scene";
import { LevelOneScene } from "@/scenes/adventure/level-one-scene";
//
import { PHYSICS_CONFIG } from "@/config/physiscs";
import { PopupManager } from "@/managers/popup-manager";
import { GuiManager } from "@/managers/gui-manager";
import { PauseManager } from "@/managers/pause-manager";
import { PauseScene } from "@/scenes/pause-scene";
import { SceneManager } from "@/managers/scene-manager";

// Goal is to keep main.ts small and just enough to configure the engine

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
    levelOne: LevelOneScene,
  },
});

SceneManager.init(game)
SceneManager.instance.addGameScenes();
InputManager.init(game);
GuiManager.init(game);
PopupManager.init(game);
PauseManager.init(game);
PersistentGameStateManager.init();

game.physics.gravity = PHYSICS_CONFIG.gravity;

game.start("splash", {loader}).then(() => {

});
