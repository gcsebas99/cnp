import { Player } from "@/actors/player/player";

export interface Controller {
  update(player: Player, engine: ex.Engine, delta: number): void;
}
