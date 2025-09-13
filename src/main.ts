import { DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { SplashScene } from "./scenes/splash-scene";
import { MenuScene } from "./scenes/menu-scene";
import { InputManager } from "./managers/input-manager";
import { TennisScene } from "./scenes/tennis/tennis-scene";
import { FruitPickerScene } from "./scenes/fruit-picker/fruit-picker-scene";
import { LevelOneScene } from "./scenes/adventure/level-one-scene";
import { PersistentGameStateManager } from "./managers/persistent-game-state-manager";


import { loader as tennisLoader } from "./resources/tennis-resources";

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
    menu: MenuScene,
    fruitPicker: FruitPickerScene,
    levelOne: LevelOneScene,
    tennis: {
      scene: TennisScene,
      loader: tennisLoader
    }
  },
});
InputManager.init(game);
PersistentGameStateManager.init();

game.start("splash", {loader}).then(() => {

});
