import { Vector } from "excalibur";
import { VFX } from "@/actors/vfx/vfx";
import { PuffHatSheet } from "@/sprite-sheets/puff-hat";

export class HatPuffVFX extends VFX {
  constructor(pos: Vector, onSpawnHat?: () => void) {
    super(pos, {
      spriteSheet: PuffHatSheet,
      frameDuration: 80,
      scale: 2,
      z: 35,
    });

    if (onSpawnHat) {
      this.onFrame(2, onSpawnHat);
    }
  }
}
