import { Sound } from "excalibur";

export class SoundManager {
  private static _instance: SoundManager | undefined = undefined;
  private activeSounds: Sound[] = [];

  public static dispose() {
    SoundManager._instance = undefined;
    // Optionally stop all sounds
  }

  public static get instance() {
    if (!this._instance) this._instance = new SoundManager();
    return this._instance;
  }

  /** Play a sound and track it */
  public play(sound: Sound, volume = 1) {
    sound.volume = volume;
    sound.play();
    if (!this.activeSounds.includes(sound)) {
      this.activeSounds.push(sound);
    }
  }

  /**
   * Play a sound once and automatically remove it when done.
   * Ideal for short SFX.
   */
  public async playOnce(sound: Sound, volume = 1): Promise<void> {
    sound.volume = volume;
    this.activeSounds.push(sound);

    try {
      await sound.play(); // Excalibur Sound.play() returns a Promise
    } finally {
      // Remove sound when it finishes or fails
      this.activeSounds = this.activeSounds.filter(s => s !== sound);
    }
  }

  /** Pause all currently playing sounds */
  public pauseAll() {
    for (const s of this.activeSounds) {
      try { s.pause(); } catch {}
    }
  }

  /** Resume all paused sounds */
  public resumeAll() {
    for (const s of this.activeSounds) {
      try { s.play(); } catch {}
    }
  }

  /** Stop all sounds */
  public stopAll() {
    for (const s of this.activeSounds) {
      try { s.stop(); } catch {}
    }
    this.activeSounds = [];
  }

  /** Clean up finished sounds */
  public cleanup() {
    this.activeSounds = this.activeSounds.filter(s => s.isPlaying());
  }
}

