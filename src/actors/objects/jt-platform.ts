import { Actor, CollisionType, Side, vec, Vector } from "excalibur";
import { nineSliceFromSprites } from "@/utils/nine-slice-from-sprites";

export class JTPlatform extends Actor {
  private graphicHeight: number;
  private sprites: Parameters<typeof nineSliceFromSprites>[0]["sprites"];
  private tileSize: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    sprites: Parameters<typeof nineSliceFromSprites>[0]["sprites"],
    tileSize: number = 32,
    name: string = "JTPlatform",
    z: number = 0
  ) {
    super({
      name,
      pos: vec(x, y),
      width,
      height,
      anchor: Vector.Zero,
      collisionType: CollisionType.Fixed,
      z,
    });

    this.graphicHeight = height;
    this.sprites = sprites;
    this.tileSize = tileSize;

    // Set collider to top only
    const colliderHeight = 8;
    this.collider.useBoxCollider(width, colliderHeight, Vector.Zero);
  }

  onInitialize() {
    // Build 9-slice graphics
    const group = nineSliceFromSprites({ sprites: this.sprites, width: this.width, height: this.graphicHeight, tileSize: this.tileSize });
    this.graphics.use(group);

    // events
    this.on("precollision", (event) => {
      const other = event.other.owner as Actor;
      if (event.side === Side.Top) {
        if (other && other.vel.y < 0) {
          // moving up — ignore collision
          event.contact.cancel();
        }
        return; // allow contact only if falling
      }
      // cancel all other sides (left/right/bottom)
      event.contact.cancel();
    });
  }
}