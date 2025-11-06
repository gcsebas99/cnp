
export const computeHitEffectiveness = (info: { phase: string; elapsed: number }) => {
  let winChanceLabel = "VERY_LOW";
  let newSpeedMult = 1.0;
  let winChance = 0.15;
  let targetZone = "short";

  const e = info.elapsed;
  if (info.phase === "idle" || info.phase === "rest" || (info.phase === "swing" && (e <= 100 || e >= 400))) {
    winChanceLabel = "VERY_LOW";
    newSpeedMult = 1.0;
    winChance = 0.15;
    targetZone = "short";
  } else if (info.phase === "swing") {
    if ((e > 100 && e <= 200) || (e >= 300 && e < 400)) {
      winChanceLabel = "LOW";
      newSpeedMult = 1.1;
      winChance = 0.3;
      targetZone = Math.random() < 0.5 ? "short" : "deep";
    } else if ((e > 200 && e <= 230) || (e >= 270 && e < 300)) {
      winChanceLabel = "HIGH";
      newSpeedMult = 1.4;
      winChance = 0.55;
      targetZone = "deep";
    } else if (e > 230 && e < 270) {
      winChanceLabel = "VERY_HIGH";
      newSpeedMult = 2.5;
      winChance = 0.80;
      targetZone = "deep";
    }
  }

  return { winChanceLabel, winChance, newSpeedMult, targetZone };
}