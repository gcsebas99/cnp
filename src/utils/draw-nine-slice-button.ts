import { ExcaliburGraphicsContext, vec } from "excalibur";
import { createNineSliceSprites } from "./create-nine-slice-sprite";

export const drawNineSliceButton = (
  ctx: ExcaliburGraphicsContext,
  nine: ReturnType<typeof createNineSliceSprites>,
  x: number,
  y: number,
  width: number,
  height: number,
  sliceSize: number = 4,
) => {
  const slice = sliceSize;
  const w = width;
  const h = height;

  // --- CORNERS (fixed) ---
  nine.tl.draw(ctx, x, y);
  nine.tr.draw(ctx, x + w - slice, y);
  nine.bl.draw(ctx, x, y + h - slice);
  nine.br.draw(ctx, x + w - slice, y + h - slice);

  // --- EDGES (stretched) ---
  nine.top.scale = vec((w - slice * 2) / nine.top.width, 1);
  nine.top.draw(ctx, x + slice, y);

  nine.bottom.scale = vec((w - slice * 2) / nine.bottom.width, 1);
  nine.bottom.draw(ctx, x + slice, y + h - slice);

  nine.left.scale = vec(1, (h - slice * 2) / nine.left.height);
  nine.left.draw(ctx, x, y + slice);

  nine.right.scale = vec(1, (h - slice * 2) / nine.right.height);
  nine.right.draw(ctx, x + w - slice, y + slice);

  // --- CENTER (stretched) ---
  nine.center.scale = vec(
    (w - slice * 2) / nine.center.width,
    (h - slice * 2) / nine.center.height
  );
  nine.center.draw(ctx, x + slice, y + slice);
};
