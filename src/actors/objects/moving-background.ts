import { Actor, Engine, GraphicsGroup, Sprite, vec, Vector } from "excalibur";

type Direction =
  | "left"
  | "right"
  | "up"
  | "down"
  | "diagonal-to-topleft"
  | "diagonal-to-topright"
  | "diagonal-to-bottomleft"
  | "diagonal-to-bottomright";

export class MovingBackground extends Actor {
  private sprite: Sprite;
  private spriteSize: number;
  private direction: Direction;
  private speed: number;
  private group!: GraphicsGroup;
  private bgPosition = new Vector(0, 0);

  constructor({
    width,
    height,
    sprite,
    spriteSize,
    direction = "left",
    speed = 0.02,
    name = "MovingBackground",
    z = -3,
  }: {
    width: number;
    height: number;
    sprite: Sprite;
    spriteSize: number;
    direction?: Direction;
    speed?: number;
    name?: string;
    z?: number;
  }) {
    super({
      name: name,
      pos: vec(0, 0),
      anchor: Vector.Zero,
      width,
      height,
    });
    this.direction = direction;
    const { horizontal: reqH, vertical: reqV } = this.requireOffset();
    const pos = vec((reqH ? -spriteSize : 0), (reqV ? -spriteSize : 0));
    this.pos = pos;
    this.bgPosition = pos;
    this.sprite = sprite;
    this.spriteSize = spriteSize;
    this.speed = speed;
    this.z = z;
  }

  override onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.buildTiles();
  }

  private requireOffset() {
    const requireOffsetHorizontal = this.direction === "left" || this.direction === "right" || this.direction.startsWith("diagonal");
    const requireOffsetVertical = this.direction === "up" || this.direction === "down" || this.direction.startsWith("diagonal");
    return { horizontal: requireOffsetHorizontal, vertical: requireOffsetVertical };
  }

  private buildTiles() {
    const { horizontal: reqH, vertical: reqV } = this.requireOffset();
    const tiles: { graphic: Sprite; offset: Vector }[] = [];
    const cols = Math.ceil(this.width / this.spriteSize) + (reqH ? 2 : 0);
    const rows = Math.ceil(this.height / this.spriteSize) + (reqV ? 2 : 0);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        tiles.push({
          graphic: this.sprite.clone(),
          offset: new Vector(x * this.spriteSize, y * this.spriteSize),
        });
      }
    }
    this.group = new GraphicsGroup({
      members: tiles,
      useAnchor: false,
    });
    this.graphics.use(this.group);
  }

  override onPreUpdate(_engine: Engine, delta: number) {
    const moveAmount = delta * this.speed;
    const movement = new Vector(0, 0);

    // Move offset based on direction
    switch (this.direction) {
      case "left":
        movement.x -= moveAmount;
        break;
      case "right":
        movement.x += moveAmount;
        break;
      case "up":
        movement.y -= moveAmount;
        break;
      case "down":
        movement.y += moveAmount;
        break;
      case "diagonal-to-topleft":
        movement.x -= moveAmount;
        movement.y -= moveAmount;
        break;
      case "diagonal-to-topright":
        movement.x += moveAmount;
        movement.y -= moveAmount;
        break;
      case "diagonal-to-bottomleft":
        movement.x -= moveAmount;
        movement.y += moveAmount;
        break;
      case "diagonal-to-bottomright":
        movement.x += moveAmount;
        movement.y += moveAmount;
        break;
    }

    // Apply offset
    this.pos.x += movement.x;
    this.pos.y += movement.y;

    //this.pos.x += this.movingOffset.x;
    if (Math.abs(this.pos.x - this.bgPosition.x) >= this.spriteSize) {
      //this.pos.x = this.bgPosition.x;
      this.pos.x = this.bgPosition.x + ((this.pos.x - this.bgPosition.x) % this.spriteSize);
    }
    //this.pos.y += this.movingOffset.y;
    if (Math.abs(this.pos.y - this.bgPosition.y) >= this.spriteSize) {
      //this.pos.y = this.bgPosition.y;
      this.pos.y = this.bgPosition.y + ((this.pos.y - this.bgPosition.y) % this.spriteSize);
    }
  }

  public changeAnimation(direction: Direction, speed: number) {
    this.direction = direction;
    this.speed = speed;
    this.buildTiles();
  }
}
