import { Actor, Animation, AnimationStrategy, Engine, SpriteSheet, Vector } from "excalibur";

type VFXOptions = {
  spriteSheet: SpriteSheet;
  frameDuration?: number;
  scale?: number;
  onComplete?: () => void;
  autoRemove?: boolean;
  z?: number;
};

export class VFX extends Actor {
  private animation: Animation;
  private onComplete?: () => void;
  private autoRemove: boolean;
  private frameCallbacks: Map<number, () => void> = new Map();

  constructor(pos: Vector, options: VFXOptions) {
    super({
      pos,
      anchor: Vector.Half,
      z: options.z ?? 2000,
      name: "VFX",
    });

    const totalFrames = options.spriteSheet.sprites.length;
    this.animation = Animation.fromSpriteSheet(
      options.spriteSheet,
      Array.from({ length: totalFrames }, (_, i) => i),
      options.frameDuration ?? 100
    );
    this.animation.strategy = AnimationStrategy.Freeze;

    this.onComplete = options.onComplete;
    this.autoRemove = options.autoRemove ?? true;
    this.scale = new Vector(options.scale ?? 1, options.scale ?? 1);
  }

  /**
   * Register a callback for a single frame index (0-based)
   */
  public onFrame(frameIndex: number, callback: () => void) {
    this.frameCallbacks.set(frameIndex, callback);
    return this;
  }

  /**
   * Register multiple frame callbacks at once.
   * Example:
   *   vfx.onFrames({
   *     3: () => console.log("poof small"),
   *     6: () => console.log("spawn"),
   *     12: () => console.log("fade out"),
   *   });
   */
  public onFrames(callbacks: Record<number, () => void>) {
    for (const [frameStr, fn] of Object.entries(callbacks)) {
      const frame = Number(frameStr);
      if (!Number.isNaN(frame)) {
        this.frameCallbacks.set(frame, fn);
      }
    }
    return this;
  }

  onInitialize(engine: Engine) {
    this.graphics.use(this.animation);

    this.animation.events.on("end", () => {
      if (this.onComplete) this.onComplete();
      if (this.autoRemove) {
        this.kill();
      }
    });

    this.animation.events.on("frame", (evt) => {
      const cb = this.frameCallbacks.get(evt.frameIndex);
      if (cb) cb();
    });
  }
}
