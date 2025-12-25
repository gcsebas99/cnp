import { EndGameManager } from './end-game-manager';
import { SceneManager } from './scene-manager';
import { SoundManager } from './sound-manager';
import { PopupManager } from './popup-manager';
import { InputManager } from './input-manager';
import { FullscreenManager } from './fullscreen-manager';
import { GuiManager } from './gui-manager';
import { PauseManager } from './pause-manager';
import { PersistentGameStateManager } from './persistent-game-state-manager';

export function disposeAllManagers() {
  console.log("||--Disposing all managers...");
  EndGameManager.dispose?.();
  SceneManager.dispose?.();
  SoundManager.dispose?.();
  PopupManager.dispose?.();
  InputManager.dispose?.();
  FullscreenManager.dispose?.();
  GuiManager.dispose?.();
  PauseManager.dispose?.();
  PersistentGameStateManager.dispose?.();
}
