import { TennisCollisionGroups } from "@/config/collision-groups";
import { Actor, CollisionStartEvent, CollisionType, Color, Engine, Scene, vec, Vector } from "excalibur";
import { Racket } from "@/actors/tools/racket";
import { Resources as TennisResources } from "@/resources/tennis-resources";

export class Ball extends Actor {
  private marker: Actor|null = null;
  private radius = 12;
  private rotationSpeed = 0.001;
  public speed = 350; // base travel speed
  // Court depth range (tweak these for your scene)
  private yScaleMin = 384; // far
  private yScaleMax = 1024; // near

  constructor(x = 0, y = 0, radius = 12) {
    super({
      name: "Ball",
      pos: vec(x, y),
      radius: radius,
      collisionType: CollisionType.Passive,
    });
    this.radius = radius;
  }

  onInitialize() {
    this.body.group = TennisCollisionGroups.Ball;
    this.body.useGravity = false;

    //sprite
    const sprite = TennisResources.Ball.toSprite();
    const scale = (this.radius * 2) / sprite.width;
    sprite.scale = vec(scale, scale);
    this.graphics.use(sprite);

    // detect collisions
    this.on("collisionstart", (ev:CollisionStartEvent) => {
      const other = ev.other;
      if (!other) return;
      // Racket collision
      if (other.owner && other.owner instanceof Racket) {
        (other.owner as Racket).onBallHit(this, ev);
        this.flipRotation();
        return;
      }
      // Marker collision - "bounce"
      if (other.owner && other.owner.name === "BounceMarker") {
        TennisResources.BounceSfx.play();
        return;
      }
      // Point areas (goal zones) should be actors with group Groups.Goal or similar
      const otherActor = other?.owner as Actor;
      //console.log("Ball onCollisionStart with", otherActor);
      if (otherActor.name === "Ground") {
        return;
      }
      if (otherActor.body.group === TennisCollisionGroups.Goal) {
        // notify scene or manager
        this.emit("ball:goal", { actor: otherActor });
        return;
      }
      if (otherActor.body.group === TennisCollisionGroups.Opponent) {
        // notify scene or manager
        //sound for racket hit
        TennisResources.BallHitSfx.play();
        this.emit("ball:opponent", { actor: otherActor });
        return;
      }
    });

  }

  public onPreUpdate(engine: Engine, delta: number) {
    // Rotate for cool effect
    this.rotation += this.rotationSpeed * delta;

    // Scale based on y position to simulate depth (tweak yScaleMin/yScaleMax for your scene)
    const t = (this.pos.y - this.yScaleMin) / (this.yScaleMax - this.yScaleMin);
    const scale = Math.min(1, Math.max(0.5, 0.5 + 0.5 * t));
    this.scale = vec(scale, scale);
  }

  onPreKill(scene: Scene): void {
    if (this.marker) {
      this.marker.kill();
      this.marker = null;
    }
  }

  public addBounceMarker(x:number, y:number, radius?:number) {
    if (this.marker) {
      this.marker.kill();
      this.marker = null;
    }
    // add a cool marker, with breathing animation
    this.marker = new Actor({
      name: "BounceMarker",
      pos: vec(x, y),
      radius: radius || 8,
      color: Color.fromRGB(51, 51, 51, 0.8),
      z: -1 // put marker behind ball
    });

    this.scene?.add(this.marker);

    this.marker.actions.repeatForever(ctx => {
      ctx.scaleTo({scale: vec(1.3, 1.3), duration: 800}).scaleTo({scale: vec(1.0, 1.0), duration: 800});
    });
  }

  public flipRotation() {
    this.rotationSpeed *= -1;
  }
}