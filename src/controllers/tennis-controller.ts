// tennis-controller.ts
import { Engine, Keys } from "excalibur";
import { Player } from "../actors/player/player";

export class TennisController {
  speed = 150; // adjust as needed

  update(player: Player, engine: Engine, delta: number) {
    const input = engine.input.keyboard;

    let dir = 0;
    if (input.isHeld(Keys.ArrowLeft) || input.isHeld(Keys.A)) {
      dir = -1;
    } else if (input.isHeld(Keys.ArrowRight) || input.isHeld(Keys.D)) {
      dir = 1;
    }

    player.vel.x = dir * this.speed;

    if (dir === 0) {
      player.graphics.use("idle");
    } else {
      player.graphics.use("walk");
      player.graphics.flipHorizontal = dir < 0;
    }
  }
}
