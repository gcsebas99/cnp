import { Player } from "@/actors/player/player";

export interface Controller {
  update(player: Player, engine: ex.Engine, delta: number): void;
  performAction(player: Player, action: string, options?: any): void;
}
