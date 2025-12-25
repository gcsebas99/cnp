import { Player } from "@/actors/player/player";
import { Actor, vec, Vector } from "excalibur";

const RACKET_RIGHT_OFFSET = new Vector(32, 0);
const RACKET_LEFT_OFFSET  = new Vector(-32, 0);
const RACKET_RIGHT_ROTATION = Math.PI / 2;
const RACKET_LEFT_ROTATION  = -RACKET_RIGHT_ROTATION;

export class RacketPivot extends Actor {
  private racket!: Actor;
  public side: "left" | "right" = "left";

  constructor(player: Player, racket: Actor, side?: "left" | "right") {
    super({
      name: "RacketPivot",
      pos: vec(player.width / 2, player.height / 2), // center relative to top-left anchor
      anchor: vec(0.5, 0.5),
    });
    this.racket = racket;
    if (side) {
      this.setRacketOnSide(side);
    } else {
      this.setRacketOnSide("left");
    }
  }

  public switchHand(side?: "left" | "right") {
    if (!side) {
      this.setRacketOnSide(this.side === "left" ? "right" : "left");
    } else {
      if (side !== this.side) {
        this.setRacketOnSide(side);
      }
    }
  }

  public setRacketOnSide(side: "left" | "right") {
    this.side = side;
    if (side === "left") {
      this.racket.pos = RACKET_LEFT_OFFSET;
      this.racket.rotation = RACKET_LEFT_ROTATION;
    } else {
      this.racket.pos = RACKET_RIGHT_OFFSET;
      this.racket.rotation = RACKET_RIGHT_ROTATION;
    }
  }

  public getRacketSide(): "left" | "right" {
    return this.side;
  }
}
