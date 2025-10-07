// player.ts
import { Actor, CollisionType, Color, Engine, Rectangle, vec, Vector } from "excalibur"; // Animation, SpriteSheet,
//import { Resources } from "./resources"; // assumes you have chuti.png, neiti.png
import { Controller } from "@/controllers/controller";
import { Tool } from "@/actors/tools/tool";

export type Character = "chuti" | "neiti";
export class Player extends Actor {
  public character: Character;
  public controller!: Controller;
  public tool?: Tool;

  constructor(character: Character, x: number, y: number, anchor: Vector = Vector.Half) {
    super({
      pos: vec(x, y),
      name: "Player-" + character,
      anchor: anchor,
      width: 64,
      height: 128,
      collisionType: CollisionType.Active
    });
    this.character = character;
  }

  onInitialize(engine: Engine) {

    // TODO: replace with "skin" config class
    const color = this.character === "chuti" ? Color.Red : Color.Blue;
    const body = new Rectangle({
      width: this.width,
      height: this.height,
      color
    });
    this.graphics.use(body);

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

  public equipTool(tool: Tool) {
    this.tool = tool;
    if (tool.name === "Racket") { //racket has its own attachment logic
      tool.attachTo(this);
      return;
    }
    const handRight = vec(64, 32); // default attachment point - TODO: define attachment points
    tool.attachTo(this, handRight);
  }

  public getEquippedTool(): Tool | undefined {
    return this.tool;
  }

  public onPreUpdate(engine: Engine, delta: number) {
    this.controller.update(this, engine, delta);
    this.tool?.update(engine, delta);
  }
}
