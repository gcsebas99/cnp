// puff-vfx.ts
import { Vector } from "excalibur";
import { VFX } from "@/actors/vfx/vfx";
import { PuffPlayerSheet } from "@/sprite-sheets/puff-player";

export class PlayerPuffVFX extends VFX {
  constructor(pos: Vector, onSpawnPlayer?: () => void) {
    super(pos, {
      spriteSheet: PuffPlayerSheet,
      frameDuration: 80,
      scale: 2.5,
      z: 10,
    });

    if (onSpawnPlayer) {
      this.onFrame(4, onSpawnPlayer);
    }
  }
}
