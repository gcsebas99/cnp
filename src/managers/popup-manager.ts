import { Color, Engine, Graphic, ScreenElement, Sound, vec, Vector, Text, AnimationStrategy, Animation, SpriteSheet } from "excalibur";
import { SoundManager } from "@/managers/sound-manager";

type PopupOptions = {
  duration?: number;         // ms to stay visible
  soundAppear?: Sound;       // optional sound when appearing
  soundVanish?: Sound;       // optional sound when vanishing
  soundAppearDelay?: number; // ms delay before playing sound
  animationDelay?: number;   // ms delay before starting appear animation
  pos?: Vector;              // viewport position (defaults to center)
  size?: Vector;             // final size
  sprite?: Graphic;          // sprite or image
  text?: string;             // optional fallback for simple text popup
};

export class PopupManager {
  private static _instance: PopupManager | undefined = undefined;
  private engine!: Engine;


  private constructor(engine: Engine) {
    this.engine = engine;
  }

  /** Initialize singleton instance */
  public static init(engine: Engine) {
    if (!PopupManager._instance) {
      PopupManager._instance = new PopupManager(engine);
    }
    return PopupManager._instance;
  }

  /** Access singleton */
  public static get instance() {
    if (!PopupManager._instance) {
      throw new Error("PopupManager not initialized. Call PopupManager.init(engine) first.");
    }
    return PopupManager._instance;
  }

  /**
   * Show a popup with appear/vanish animations
   */
  public show(options: PopupOptions) {
    const {
      duration = 1500,
      pos,
      size,
      sprite,
      text,
      soundAppear,
      soundVanish,
      soundAppearDelay = 0,
      animationDelay = 0
    } = options;

    // Center in viewport by default
    const position = pos ? this.engine.screen.worldToScreenCoordinates(pos) : this.engine.screen.center;

    // Create actor in screen-space
    const popup = new ScreenElement({
      name: "popup",
      pos: position,
      anchor: Vector.Half,
      z: 1000 // always on top
    });

    // Use sprite or text
    if (sprite) popup.graphics.use(sprite);
    else if (text) popup.graphics.use(new Text({ text, color: Color.Red }));

    this.engine.currentScene.add(popup);

    // Sound appear (with optional delay)
    if (soundAppear) {
      this.engine.clock.schedule(() => SoundManager.instance.playOnce(soundAppear), soundAppearDelay);
    }

    // Appear animation (with optional delay)
    popup.scale = vec(0, 0);
    //popup.actions.scaleTo({scale: size ?? vec(1, 1), duration: 500});
    popup.actions.delay(animationDelay).scaleTo({ scale: size ?? vec(1, 1), duration: 500});

    // Stay for `duration`, then vanish
    popup.actions.delay(duration).callMethod(() => {
      if(soundVanish) {
        SoundManager.instance.playOnce(soundVanish);
      }
    }).fade(0, 300).die();
  }

  /**
   * Helper: Create an animated sprite for popups
   * @param sprites frames of animation
   * @param frameDuration ms per frame
   * @param loop whether to loop (default true)
   */
  public static createAnimatedSprite(spriteSheet: SpriteSheet, spriteSheetIndex: number[], frameDuration: number, loop: boolean = true): Animation {
    const anim = Animation.fromSpriteSheet(spriteSheet, spriteSheetIndex, frameDuration, loop ? AnimationStrategy.Loop : AnimationStrategy.Freeze);
    return anim;
  }

  public static dispose() {
    PopupManager._instance = undefined;
    // Clear any other static properties or listeners here
  }
}
