import { Actor, CollisionType, Engine, Vector, clamp, vec, Animation, AnimationStrategy } from "excalibur";
import { Ball } from "@/actors/objects/ball";
import { AnimationComponent } from "@/core/components/animation-component";
import { TennisOpponentIndex, TennisOpponentSheet } from "@/sprite-sheets/tennis-opponent";

type OpponentAnimationKey = "idle" | "run" | "swing";

const animations = {
    idle: Animation.fromSpriteSheet(TennisOpponentSheet, TennisOpponentIndex.idle, 200, AnimationStrategy.Loop),
    run: Animation.fromSpriteSheet(TennisOpponentSheet, TennisOpponentIndex.run, 85, AnimationStrategy.Loop),
    swing: Animation.fromSpriteSheet(TennisOpponentSheet, TennisOpponentIndex.swing, 125, AnimationStrategy.End),
  }

export class TennisOpponent extends Actor {
  public animation: AnimationComponent<OpponentAnimationKey>;
  private targetBall: Ball | null = null;

  // --- Behavior tuning (these can later vary by difficulty)
  private trackingSpeed = 220;     // base horizontal move speed
  private returnSpeed = 120;       // speed to return to center
  private hitZoneY = 384;          // Y position where opponent "hits"
  private winChance = 0.6;         // chance to successfully return
  private reactionTime = 0.25;     // seconds before reacting to new ball
  private smoothFactor = 0.1;      // smoothing (0 = instant, 1 = no move)
  private leftBound = 576;
  private rightBound = 1728;

  // --- Internal state
  private centerPos: Vector;
  private readyToHit = true;
  private servePosition: Vector | null = null;
  private predictedX: number | null = null;
  private lastTrajectoryTime = 0;

  // --- close position hit back chances
  private timeInPosition = 0;
  private earlyPositionBonus = 0.8;
  private holdThreshold = 300; // ms threshold
  private closeRange = 40;     // px tolerance

  private winnerHoldThreshold = 700;  // ms before can aim at winner
  private winnerChance = 0.3;
  public get timeInPositionMs() { return this.timeInPosition; }
  public get winnerHoldThresholdMs() { return this.winnerHoldThreshold; }
  public get winnerChanceValue() { return this.winnerChance; }

  private swingLocked = false;

  constructor(startPos: Vector, centerPos: Vector) {
    super({
      name: "Opponent",
      pos: startPos.clone(),
      width: 40,
      height: 80,
      collisionType: CollisionType.Passive,
      anchor: Vector.Zero,
    });

    this.animation = new AnimationComponent(animations);

    this.centerPos = centerPos.clone();
    this.addTag("npc");
  }

  onInitialize(engine: Engine) {
    this.addComponent(this.animation);
    this.setAnimation("idle");

    // Listen for when ball starts moving toward opponent
    this.scene?.on("ball:trajectory", (evt: any) => {
      if (evt.by === "player") {
        this.readyToHit = true;
        this.targetBall = evt.ball ?? null;
        this.lastTrajectoryTime = engine.clock.now(); // record moment
      } else {
        this.targetBall = null;
      }
    });

    this.scene?.on("ball:removed", () => {
      this.targetBall = null;
      this.predictedX = null;
    });
  }

  onPreUpdate(engine: Engine, delta: number) {
    const dt = delta / 1000;
    const now = engine.clock.now();

    // --- Serve position behavior
    if (this.servePosition) {
      const dx = this.servePosition.x - this.pos.x;
      if (Math.abs(dx) > 1) {
        const dir = Math.sign(dx);
        this.pos.x += dir * this.trackingSpeed * dt;
      } else {
        this.servePosition = null;
      }
      return;
    }

    // --- Predictive tracking
    if (this.targetBall) {
      this.graphics.flipHorizontal = this.targetBall.pos.x < this.pos.x;

      const ball = this.targetBall;

      // Simulate reaction delay
      const timeSinceTrajectory = (now - this.lastTrajectoryTime) / 1000;
      if (timeSinceTrajectory < this.reactionTime) {
        // Not yet reacting — maybe subtle idle movement
        this.returnToCenter(dt);
        return;
      }

      // Skip if ball is going away from opponent
      const vy = ball.vel.y;
      if (vy > 0) {
        this.returnToCenter(dt);
        return;
      }

      // Predict when the ball will reach opponent's hit zone
      const timeToReachZone = (this.hitZoneY - ball.pos.y) / vy;

      if (timeToReachZone > 0 && timeToReachZone < 3) {
        const futureX = ball.pos.x + ball.vel.x * timeToReachZone;

        // Smooth prediction (reduces twitchiness)
        if (this.predictedX === null) {
          this.predictedX = futureX;
        } else {
          this.predictedX = this.predictedX + (futureX - this.predictedX) * this.smoothFactor;
        }
      }

      // Move toward predicted intercept
      if (this.predictedX != null) {
        const dx = this.predictedX - this.pos.x;
        if (Math.abs(dx) > 5) {
          const dir = Math.sign(dx);
          this.pos.x += dir * this.trackingSpeed * dt;
        }

        // --- Track time staying close to predicted intercept ---
        if (Math.abs(dx) < this.closeRange) {
          this.timeInPosition += delta; // accumulate ms
        } else {
          this.timeInPosition = 0;
        }
      } else {
        this.timeInPosition = 0;
      }

      // Clamp to wall bounds
      this.pos.x = clamp(this.pos.x, this.leftBound, this.rightBound);

      // Try to hit when ball reaches strike zone
      if (ball.pos.y <= this.hitZoneY && this.readyToHit) {
        this.readyToHit = false;

        this.setAnimation("swing");
        this.swingLocked = true;
        this.animation.current?.events.once("end", () => {
          this.setAnimation("idle");
          this.swingLocked = false;
        });

        // Check horizontal reach
        const ballCenterX = ball.pos.x;
        const bodyReach = (ballCenterX < this.pos.x) ? this.width : this.width * 2;

        const distance = Math.abs(ballCenterX - this.pos.x);
        if (distance > bodyReach) {
          console.log("❌❌ Opponent too far to reach ball");
          return; // Miss
        }

        // Decide if AI hits back successfully
        const prevWinChance = ball.lastPlayerWinChance ?? 0.5;
        this.winChance = 1 - prevWinChance;

        // ✅ Boost win chance if positioned early IMPROVED
        if (this.timeInPosition > 0) {
          const holdRatio = clamp(this.timeInPosition / this.holdThreshold, 0, 1);
          const boosted = this.winChance + (this.earlyPositionBonus - this.winChance) * holdRatio;
          this.winChance = Math.min(boosted, this.earlyPositionBonus);
          console.log(`🏆 Opponent boosted win chance to ${this.winChance} (held ${this.timeInPosition.toFixed(0)}ms near intercept)`);
        }

        const rand = Math.random();
        const willHit = rand < this.winChance;
        console.log(`OWC: ${this.winChance}, R: ${rand} => ${willHit}`);
        if (willHit) {
          this.scene?.emit("opponent:hit");
        } else {
        }
      }

    } else {
      this.returnToCenter(dt);
    }

    // --- Animation state ---
    if (this.swingLocked) return;

    const moving = Math.abs(this.vel.x) > 5 || Math.abs(this.pos.x - (this.predictedX ?? this.centerPos.x)) > 10;
    if (moving) {
      this.setAnimation("run");
    } else {
      this.setAnimation("idle");
    }
  }

  private returnToCenter(dt: number) {
    const dx = this.centerPos.x - this.pos.x;
    if (Math.abs(dx) > 5) {
      const dir = Math.sign(dx);
      this.pos.x += dir * this.returnSpeed * dt;
    }
    // Clamp again for safety
    this.pos.x = clamp(this.pos.x, this.leftBound, this.rightBound);
  }

  public moveToServePosition(servePos: Vector[]) {
    // find closest serve position based on x axis
    let closestPos = servePos[0];
    let closestDist = Math.abs(this.pos.x - closestPos.x);
    servePos.forEach(pos => {
      const dist = Math.abs(this.pos.x - pos.x);
      if (dist < closestDist) {
        closestDist = dist;
        closestPos = pos;
      }
    });
    this.servePosition = closestPos.clone();
  }

  public computeReturnEffectiveness() {
    if (!this.targetBall) return { speedMult: 1.0, targetZone: "short" as const };

    const vy = this.targetBall.vel.y;
    const timeToReach = Math.abs((this.hitZoneY - this.targetBall.pos.y) / vy);
    const distance = Math.abs((this.predictedX ?? this.pos.x) - this.pos.x);

    // If opponent got in position early, stronger hit
    const positionFactor = clamp(1 - distance / 300, 0, 1);
    const timeFactor = clamp(timeToReach / 1.5, 0, 1);

    const prep = (positionFactor * 0.6 + timeFactor * 0.4); // weighted average
    const speedMult = 1.0 + prep * 0.7; // up to +70% if fully ready
    const targetZone: "deep" | "short" = prep > 0.6 ? "deep" : "short";

    return { speedMult, targetZone };
  }

  public getCustomData(prop: string): any {
    switch (prop) {
      case "tennis-serve-ball-position":
        return vec(this.pos.x + this.width / 2, this.pos.y + this.height + 20);
      default:
        return null;
    }
  }

  private setAnimation(key: OpponentAnimationKey) {
    this.animation.set(key);
  }

  public animateServe() {
    this.animation.set("swing");
    this.swingLocked = true;
    this.animation.current?.events.once("end", () => {
      this.setAnimation("idle");
      this.swingLocked = false;
    });
  }
}
