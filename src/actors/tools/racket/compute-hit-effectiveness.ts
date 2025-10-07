
export function computeHitEffectiveness(info: { phase: string; elapsed: number }) {
  const baseSpeedMult = 1.0;
  let newSpeedMult = baseSpeedMult;
  let winChance = 0.2; // default

  if (info.phase === "idle" || info.phase === "rest") {
    newSpeedMult = 1.0;
    winChance = 0.2;
  } else if (info.phase === "swing") {
    const e = info.elapsed;
    if ((e >= 0 && e < 80) || (e >= 420 && e < 500)) {
      newSpeedMult = 1.1;
      winChance = 0.4;
    } else if ((e >= 80 && e < 160) || (e >= 340 && e < 420)) {
      newSpeedMult = 1.2;
      winChance = 0.5;
    } else if (e >= 160 && e < 340) {
      newSpeedMult = 1.5;
      winChance = 0.75;
    }
  }

  return { newSpeedMult, winChance };
}