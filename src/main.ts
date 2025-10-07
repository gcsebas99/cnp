import { DisplayMode, Engine } from "excalibur";
import { loader } from "@/resources";
import { InputManager } from "@/managers/input-manager";
import { PersistentGameStateManager } from "@/managers/persistent-game-state-manager";
//
import { SplashScene } from "@/scenes/splash-scene";
import { MenuScene } from "@/scenes/menu-scene";
import { TennisScene } from "@/scenes/tennis/tennis-scene";
import { loader as tennisLoader } from "@/resources/tennis-resources";
import { BasketDashScene } from "@/scenes/basket-dash/basket-dash-scene";
import { loader as basketDashLoader } from "@/resources/basket-dash-resources";
import { RoleRushScene } from "./scenes/role-rush/role-rush-scene";
import { loader as roleRushLoader } from "@/resources/role-rush-resources";
import { LevelOneScene } from "@/scenes/adventure/level-one-scene";
//
import { PHYSICS_CONFIG } from "@/config/physiscs";
import { PopupManager } from "@/managers/popup-manager";
import { GuiManager } from "@/managers/gui-manager";
import { PauseManager } from "@/managers/pause-manager";

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
    levelOne: LevelOneScene,
    tennis: {
      scene: TennisScene,
      loader: tennisLoader
    },
    basketDash: {
      scene: BasketDashScene,
      loader: basketDashLoader
    },
    roleRush: {
      scene: RoleRushScene,
      loader: roleRushLoader
    }
  },
});

game.physics.gravity = PHYSICS_CONFIG.gravity;

InputManager.init(game);
GuiManager.init(game);
PopupManager.init(game);
PauseManager.init(game);
PersistentGameStateManager.init();

game.start("splash", {loader}).then(() => {

});
