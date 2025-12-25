import { vec, Animation, AnimationStrategy } from "excalibur";
import { PlayerSkin } from "@/actors/player/player-skin";
import { PlayerBodyIndexNeiti, PlayerBodySheet } from "@/sprite-sheets/player-body-sheet";
import { NeitiHeadSheet } from "@/sprite-sheets/player-head-sheets";

export const NeitiSkin: PlayerSkin = {
  character: "neiti",

  bodyAnimations: {
    idle: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.idle, 180, AnimationStrategy.Loop),
    walk: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.walkRun, 120, AnimationStrategy.Loop),
    run: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.walkRun, 85, AnimationStrategy.Loop),
    jump: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.jump, 180, AnimationStrategy.Freeze),
    celebrate: Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.celebrate, 160, AnimationStrategy.Loop),
    "tennis-idle": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.tennisIdle, 280, AnimationStrategy.Loop),
    "tennis-walk": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.tennisRun, 120, AnimationStrategy.Loop),
    "tennis-run": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.tennisRun, 90, AnimationStrategy.Loop),
    "tennis-swing": Animation.fromSpriteSheet(PlayerBodySheet, PlayerBodyIndexNeiti.tennisSwing, 125, AnimationStrategy.End)
  },

  headSheet: NeitiHeadSheet,

  defaultHeadPivot: {
    headOffset: vec(0, -46),
    hatOffsetRight: vec(0, 0),
    hatOffsetLeft: vec(0, 0),
  },

  headPivotsByAnimation: {
    idle: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -72), hatOffsetLeft: vec(7, -72) },
    walk: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -74), hatOffsetLeft: vec(7, -74) },
    run: { headOffset: vec(0, -46), hatOffsetRight: vec(-10, -74), hatOffsetLeft: vec(7, -74) },
    jump: { headOffset: vec(0, -40), hatOffsetRight: vec(-10, -72), hatOffsetLeft: vec(7, -70) },

    "tennis-idle": { headOffset: vec(0, -44) },
    "tennis-walk": { headOffset: vec(0, -44) },
    "tennis-run": { headOffset: vec(0, -44) },
    "tennis-swing": { headOffset: vec(0, -44) },
  }
};