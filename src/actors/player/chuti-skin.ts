import { vec, Animation, AnimationStrategy } from "excalibur";
import { PlayerSkin } from "@/actors/player/player-skin";
import { PlayerBodyIndexChuti, PlayerBodySheet } from "@/sprite-sheets/player-body-sheet";
import { ChutiHeadSheet } from "@/sprite-sheets/player-head-sheets";

export const ChutiSkin: PlayerSkin = {
  character: "chuti",

  bodyAnimations: {
    idle: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.idle, 180, AnimationStrategy.Loop),
    walk: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.walkRun, 120, AnimationStrategy.Loop),
    run: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.walkRun, 85, AnimationStrategy.Loop),
    jump: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.jump, 180, AnimationStrategy.Freeze),
    celebrate: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.celebrate, 160, AnimationStrategy.Loop),
    "tennis-idle": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.tennisIdle, 280, AnimationStrategy.Loop),
    "tennis-walk": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.tennisRun, 120, AnimationStrategy.Loop),
    "tennis-run": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.tennisRun, 90, AnimationStrategy.Loop),
    "tennis-swing": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexChuti.tennisSwing, 125, AnimationStrategy.End)
  },

  headSheet: ChutiHeadSheet,

  defaultHeadPivot: {
    headOffset: vec(0, -46),
    hatOffsetRight: vec(0, 0),
    hatOffsetLeft: vec(0, 0),
  },

  headPivotsByAnimation: {
    idle: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -72), hatOffsetLeft: vec(7, -72) },
    walk: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -74), hatOffsetLeft: vec(7, -74) },
    run: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -74), hatOffsetLeft: vec(7, -74) },
    jump: { headOffset: vec(0, -44), hatOffsetRight: vec(-10, -72), hatOffsetLeft: vec(7, -72) },

    "tennis-idle": { headOffset: vec(0, -44) },
    "tennis-walk": { headOffset: vec(0, -42) },
    "tennis-run": { headOffset: vec(0, -42) },
    "tennis-swing": { headOffset: vec(0, -44) },
  }
};