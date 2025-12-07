import { Engine } from "excalibur";

export class ScoreManager {
  private engine: Engine;
  private score = 0;
  private gameTimeMs = 0;
  private timeLeftMs = 0;

  constructor(engine: Engine, score: number, gameTimeMs: number) {
    this.engine = engine;
    this.score = score;
    this.gameTimeMs = gameTimeMs;
    this.timeLeftMs = gameTimeMs;
  }

  public add(v: number) {
    this.score += v;
    this.engine.events.emit("score-changed", this.score);
  }

  public subtract(v: number) {
    this.score -= v;
    this.engine.events.emit("score-changed", this.score);
  }

  public getScore() {
    return this.score;
  }

  public getTimeLeftMs() {
    return this.timeLeftMs;
  }

  public getGameTimeMs() {
    return this.gameTimeMs;
  }

  public setTimeLeft(delta: number) {
    this.timeLeftMs = Math.max(0, this.timeLeftMs - delta);
  }

  public isTimeUp() {
    return this.timeLeftMs <= 0;
  }
}

