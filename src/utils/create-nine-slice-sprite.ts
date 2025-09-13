import { Sprite } from "excalibur";

export const createNineSliceSprites = (buttonSprite: Sprite, spriteSize = 16, sliceSize = 4) => {
  const img = buttonSprite.image;
  const base = buttonSprite.sourceView;

  const size = spriteSize;
  const slice = sliceSize;

  const make = (x: number, y: number, w: number, h: number) => {
    const s = new Sprite({
      image: img,
      sourceView: {
        x: base.x + x,
        y: base.y + y,
        width: w,
        height: h
      },
    });
    //s.image.smoothing = false;
    return s;
  };

  return {
    tl: make(0, 0, slice, slice),
    top: make(slice, 0, size - slice * 2, slice),
    tr: make(size - slice, 0, slice, slice),
    left: make(0, slice, slice, size - slice * 2),
    center: make(slice, slice, size - slice * 2, size - slice * 2),
    right: make(size - slice, slice, slice, size - slice * 2),
    bl: make(0, size - slice, slice, slice),
    bottom: make(slice, size - slice, size - slice * 2, slice),
    br: make(size - slice, size - slice, slice, slice),
  };
};
