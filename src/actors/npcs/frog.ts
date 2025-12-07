import { AnimationComponent } from "@/core/components/animation-component";
import { FrogSheet } from "@/sprite-sheets/frog";
import { Actor, CollisionType,  vec, Vector, Animation, AnimationStrategy } from "excalibur";

type FrogAction = "idle" | "blink" | "look" | "tongue" | "hop";

export class Frog extends Actor {
  private animation = new AnimationComponent({
    idle: Animation.fromSpriteSheet(FrogSheet, [0, 4], 500, AnimationStrategy.Freeze),
    blink: Animation.fromSpriteSheet(FrogSheet, [1, 4], 100, AnimationStrategy.Freeze),
    look: Animation.fromSpriteSheet(FrogSheet, [5, 6, 7, 6, 5], 200, AnimationStrategy.Freeze),
    tongue: Animation.fromSpriteSheet(FrogSheet, [0, 1, 2, 3, 4], 100, AnimationStrategy.Freeze),
    hop: Animation.fromSpriteSheet(FrogSheet, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 100, AnimationStrategy.Freeze),
  });
  private facingRight = false;
  private nextActionTimeout: number | null = null;
  private isPerforming = false;

  constructor(
    x: number,
    y: number,
    z: number = 0
  ) {
    super({
      name: "Frog",
      pos: vec(x, y),
      width: 27,
      height: 20,
      anchor: Vector.Zero,
      collisionType: CollisionType.Active,
      z,
      scale: new Vector(3, 3),
    });
    this.addComponent(this.animation);
  }

  onInitialize() {
    this.startLoop();
  }

  onRemove() {
    if (this.nextActionTimeout) {
      window.clearTimeout(this.nextActionTimeout);
      this.nextActionTimeout = null;
    }
  }

  private startLoop() {
    // Begin endless behavior cycle
    this.scheduleNextAction();
  }

  private scheduleNextAction() {
    const delay = randRange(1200, 3000);
    this.nextActionTimeout = window.setTimeout(() => this.pickNextAction(), delay);
  }

  private pickNextAction() {
    if (this.isPerforming) return;

    // Weighted random choice
    const roll = Math.random();
    let next: FrogAction = "blink";

    if (roll < 0.1) next = "blink";
    // else if (roll < 0.8) next = "look";
    // else if (roll < 0.9) next = "tongue";
    else next = "hop";

    this.performAction(next);
  }

  private performAction(action: FrogAction) {
    this.isPerforming = true;
    this.animation.set(action);

    const anim = this.animation.current;

    // Behavior side effects
    switch (action) {
      case "look":
        this.flip();
        break;
      case "hop":
        this.doHop(anim);
        break;
    }

    // When animation finishes, go back to idle and schedule next
    anim.events.once("end", () => {
      anim.events.clear();
      this.isPerforming = false;
      this.animation.set("idle");
      this.scheduleNextAction();
    });
  }

  private doHop(anim: Animation) {
    // Slight jump arc — move frog position
    const hopDistance = 96;
    const dir = this.facingRight ? 1 : -1;

    anim.events.on("frame", (frame) => {
      if (frame.frameIndex === 1) {
        this.actions.moveBy(vec(hopDistance * dir, -8), 150)
      }
      // Move forward mid-hop (around frame 5)
      if (frame.frameIndex === 5) {
        this.actions.moveBy(vec(0, 8), 100);
      }
    });
  }

  private flip() {
    this.facingRight = !this.facingRight;
    this.graphics.flipHorizontal = this.facingRight;
  }
}

function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}