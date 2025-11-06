
type TimelineEvent = {
  ms: number;
  callback: () => void;
};

export type TimelineOptions = {
  totalMs?: number;           // total duration of the sequence
  onComplete?: () => void;    // called when finished
  autoStart?: boolean;        // start immediately on creation
};

/**
 * A lightweight timeline scheduler for sequencing async or sync callbacks.
 * Perfect for cutscenes, minigame start/end orchestration, etc.
 */
export class TimelineScheduler {
  private events: TimelineEvent[];
  private options: TimelineOptions;
  private elapsed = 0;
  private running = false;
  private triggered: Set<number> = new Set();

  constructor(events: TimelineEvent[], options: TimelineOptions = {}) {
    // sort events chronologically
    this.events = [...events].sort((a, b) => a.ms - b.ms);
    this.options = options;

    if (options.autoStart) this.start();
  }

  start() {
    this.elapsed = 0;
    this.running = true;
    this.triggered.clear();
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.elapsed = 0;
    this.triggered.clear();
  }

  /**
   * Call this every frame with `delta` from the engine.
   */
  update(deltaMs: number) {
    if (!this.running) return;

    this.elapsed += deltaMs;

    for (const [i, evt] of this.events.entries()) {
      if (!this.triggered.has(i) && this.elapsed >= evt.ms) {
        evt.callback();
        this.triggered.add(i);
      }
    }

    const total = this.options.totalMs ?? this.getDefaultTotal();
    if (this.elapsed >= total) {
      this.running = false;
      this.options.onComplete?.();
    }
  }

  private getDefaultTotal(): number {
    const last = this.events[this.events.length - 1];
    return last ? last.ms + 100 : 0;
  }
}
