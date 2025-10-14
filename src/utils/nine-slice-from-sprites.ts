// utils/nine-slice.ts
import { Sprite, GraphicsGroup, Vector, vec } from "excalibur";

export function nineSliceFromSprites({
  sprites,
  width,
  height,
  tileSize,
}: {
  sprites: {
    tl: Sprite;
    t: Sprite;
    tr: Sprite;
    l: Sprite;
    c: Sprite;
    r: Sprite;
    bl: Sprite;
    b: Sprite;
    br: Sprite;
  };
  width: number;
  height: number;
  tileSize: number;
}): GraphicsGroup {
  const tiles: { graphic: Sprite; offset: Vector }[] = [];

  const wTiles = Math.max(1, Math.floor(width / tileSize));
  const hTiles = Math.max(1, Math.floor(height / tileSize));

  for (let y = 0; y < hTiles; y++) {
    for (let x = 0; x < wTiles; x++) {
      const isTop = y === 0;
      const isBottom = y === hTiles - 1;
      const isLeft = x === 0;
      const isRight = x === wTiles - 1;

      let sprite: Sprite;

      if (isTop && isLeft) sprite = sprites.tl;
      else if (isTop && isRight) sprite = sprites.tr;
      else if (isBottom && isLeft) sprite = sprites.bl;
      else if (isBottom && isRight) sprite = sprites.br;
      else if (isTop) sprite = sprites.t;
      else if (isBottom) sprite = sprites.b;
      else if (isLeft) sprite = sprites.l;
      else if (isRight) sprite = sprites.r;
      else sprite = sprites.c;

      tiles.push({
        graphic: sprite.clone(),
        offset: vec(x * tileSize, y * tileSize),
      });
    }
  }

  return new GraphicsGroup({
    //useAnchor: false,
    members: tiles,
  });
}
