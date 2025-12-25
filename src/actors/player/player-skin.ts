import { SpriteSheet, Vector, Animation } from "excalibur";
import { Character } from "./player";

// player-skin.ts
export type PlayerAnimationKey =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "celebrate"
  | "tennis-idle"
  | "tennis-walk"
  | "tennis-run"
  | "tennis-swing";

export type FaceKey =
  | "hair"
  | "happy"
  | "happy2"
  | "oh"
  | "yell"
  | "sad"
  | "up"
  | "happy-side"
  | "yell-side"
  | "happy-side";

export interface HeadPivotConfig {
  headOffset: Vector; // from player origin
  hatOffsetRight?: Vector;  // relative to head
  hatOffsetLeft?: Vector;
}

export interface PlayerSkin {
  character: Character;

  bodyAnimations: Record<PlayerAnimationKey, Animation>;

  headSheet: SpriteSheet;

  /** default pivots */
  defaultHeadPivot: HeadPivotConfig;

  /** optional per-animation overrides */
  headPivotsByAnimation?: Partial<Record<PlayerAnimationKey, HeadPivotConfig>>;
}
