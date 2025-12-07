import { Actor, Vector } from "excalibur";
import { Player } from "@/actors/player/player";

export abstract class Tool extends Actor {
  protected player!: Player;

  /** Called when this tool is equipped by a player */
  public attachTo(player: Player, attachmentPoint?: Vector) {
    this.player = player;
    if(attachmentPoint) {
      this.pos = attachmentPoint;
    }
    player.addChild(this); // attach to player
  }

  public getPlayer(): Player {
    return this.player;
  }

  /** Called when input requests an action */
  public abstract use(action: string, now?: number): void;
}