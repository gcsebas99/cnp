// puff-vfx.ts
import { Vector } from "excalibur";
import { VFX } from "@/actors/vfx/vfx";
import { PuffPlayerSheet } from "@/sprite-sheets/puff-player";
import { SoundManager } from "@/managers/sound-manager";
import { Resources } from "@/resources";

export class PlayerPuffVFX extends VFX {
  constructor(pos: Vector, onSpawnPlayer?: () => void) {
    super(pos, {
      spriteSheet: PuffPlayerSheet,
      frameDuration: 80,
      scale: 2.5,
      z: 10,
    });

    if (onSpawnPlayer) {
      SoundManager.instance.playOnce(Resources.PlayerPuff, 0.8);
      this.onFrame(4, onSpawnPlayer);
    }
  }
}
