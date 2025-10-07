import { easeInOutCubic } from "@/utils/easings";
import { RacketPivot } from "@/actors/tools/racket/racket-pivot";

export class RacketSwing {
  private pivot!: RacketPivot;
  private startAngle: number = 0;
  private endAngle: number = 0;
  private duration: number = 500; // ms
  private restDuration: number = 200; // ms
  private startTime: number = 0;
  private isSwinging: boolean = false;
  private isResting: boolean = false;

  constructor(pivot: RacketPivot) {
    this.pivot = pivot;
  }

  public startSwing(now: number) {
    if (this.isSwinging) return;
    const from = this.pivot.rotation;
    const to = Math.PI / 1.3 * (this.pivot.side === "left" ? 1 : -1);
    this.startAngle = from;
    this.endAngle = to;
    this.startTime = now;
    this.isSwinging = true;
    this.isResting = false;
  }

  public update(now: number) {
    if (!this.isSwinging) return;
    const elapsed = now - this.startTime;

    if (elapsed < this.duration && !this.isResting) {
      const t = elapsed / this.duration;
      const eased = easeInOutCubic(t); // 0 → 1 smoothly
      const angle = this.startAngle + (this.endAngle - this.startAngle) * eased;
      this.pivot.rotation = angle;
    } else if (!this.isResting) {
      this.pivot.rotation = this.endAngle;
      this.startTime = now;
      this.isResting = true;
    } else if (elapsed > this.restDuration) {
      this.pivot.rotation = this.startAngle;
      this.isSwinging = false;
      this.isResting = false;
    }
  }

  public get swinging() {
    return this.isSwinging;
  }

  public getSwingInfo(now: number) {
    if (!this.isSwinging) {
      return { phase: "idle", elapsed: 0 };
    }
    const elapsed = now - this.startTime;
    if (!this.isResting) {
      return { phase: "swing", elapsed };
    } else {
      return { phase: "rest", elapsed };
    }
  }
}
