// player.ts
import { Actor, Animation, CollisionType, Engine, SpriteSheet, vec } from "excalibur";
//import { Resources } from "./resources"; // assumes you have chuti.png, neiti.png
import { TennisController } from "../../controllers/tennis-controller";

export type Character = "chuti" | "neiti";

export class Player extends Actor {
  controller: TennisController;
  character: Character;

  constructor(character: Character, x: number, y: number) {
    super({
      pos: vec(x, y),
      width: 16,
      height: 32,
      collisionType: CollisionType.Active
    });
    this.character = character;
    this.controller = new TennisController();
  }

  onInitialize(engine: Engine) {
    // Pick sprite based on character
    // const sheet = this.character === "chuti"
    //   ? SpriteSheet.fromImageSource({
    //       image: Resources.Chuti,
    //       grid: { rows: 1, columns: 3, spriteWidth: 16, spriteHeight: 32 }
    //     })
    //   : SpriteSheet.fromImageSource({
    //       image: Resources.Neiti,
    //       grid: { rows: 1, columns: 3, spriteWidth: 16, spriteHeight: 32 }
    //     });

    // const idle = new Animation({
    //   frames: [sheet.getSprite(0, 0)!],
    //   frameDuration: 200
    // });
    // const walk = new Animation({
    //   frames: [sheet.getSprite(0, 1)!, sheet.getSprite(0, 2)!],
    //   frameDuration: 120
    // });

    // this.graphics.add("idle", idle);
    // this.graphics.add("walk", walk);
    // this.graphics.use("idle");
  }

  onPreUpdate(engine: Engine, delta: number) {
    this.controller.update(this, engine, delta);
  }
}
