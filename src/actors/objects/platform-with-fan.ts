import { Actor, CollisionType, Engine, range, vec, Vector, Animation, Side } from "excalibur";
import { PlatformWithFanSprite } from "@/sprite-sheets/role-rush-terrain";
import { ElevatorMarkerSheet } from "@/sprite-sheets/elevator-marker";
import { InvertedFanSheet } from "@/sprite-sheets/fan-inverted";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
import { SoundManager } from "@/managers/sound-manager";

type PlatformState =
  | "idle"
  | "activating"
  | "movingUp"
  | "waitingAtTop"
  | "movingDown"
  | "resetting";

export class PlatformWithFan extends Actor {
  private fan: Actor;
  private marker: Actor;
  private animFanIdle!: Animation;
  private animFanUp!: Animation;
  private animFanDown!: Animation;

  private objectRequestingActivation = false;
  private state: PlatformState = "idle";
  private startPos: Vector;
  private targetPos: Vector;
  private activateDelay = 300;
  private waitAtTopDelay = 600;
  private resetDelay = 200;
  private upSpeed = 300;
  private downSpeed = 180;

  constructor(x: number, y: number, targetX: number, targetY: number) {
    super({
      name: "PlatformWithFan",
      pos: vec(x, y),
      width: 192,
      height: 16,
      anchor: Vector.Zero,
      collisionType: CollisionType.Fixed,
      z: -1,
    });

    this.startPos = vec(x, y);
    this.targetPos = vec(targetX, targetY);

    this.fan = new Actor({
      name: "Fan",
      pos: vec(96, 21),
      width: 64,
      height: 21,
      anchor: vec(0.5, 0),
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.fan);

    this.marker = new Actor({
      name: "Marker",
      pos: vec(128, 0),
      width: 64,
      height: 64,
      anchor: vec(0, 1),
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.marker);
  }

  onInitialize(engine: Engine) {
    // Build animations
    this.animFanIdle = Animation.fromSpriteSheet(InvertedFanSheet, [0], 500);
    this.animFanUp = Animation.fromSpriteSheet(InvertedFanSheet, range(0, 3), 30);
    this.animFanDown = Animation.fromSpriteSheet(InvertedFanSheet, range(0, 3), 70);

    // Graphics
    this.graphics.use(PlatformWithFanSprite);
    this.marker.graphics.use(ElevatorMarkerSheet.getSprite(0, 0)!);
    this.fan.graphics.use(this.animFanIdle);

    // Jump-through top surface
    this.on("precollision", (event) => {
      const other = event.other.owner as Actor;
      if (event.side === Side.Top) {
        if (other && other.vel.y < 0) {
          // moving up — ignore collision
          event.contact.cancel();
        }
        return; // allow contact only if falling
      }
      // cancel all other sides (left/right/bottom)
      event.contact.cancel();
    });

    // handle activation requests
    this.on("collisionstart", (event) => {
      const other = event.other.owner;
      if (event.side === Side.Top) {
        if (this.state === "idle" && other && other.hasTag("activate-platforms")) {
          this.objectRequestingActivation = true;
          engine.clock.schedule(() => {
            if (!this.objectRequestingActivation) return;
            this.activate(engine);
          }, this.activateDelay);
        }
      }
    });
    this.on("collisionend", (event) => {
      const other = event.other.owner;
      if (other && other.hasTag("activate-platforms")) {
        this.objectRequestingActivation = false;
      }
    });

  }

  private activate(engine: Engine) {
    this.objectRequestingActivation = false;
    if (this.state !== "idle") return;
    this.state = "activating";

    this.marker.graphics.use(ElevatorMarkerSheet.getSprite(1, 0)!);
    this.fan.graphics.use(this.animFanUp);
    SoundManager.instance.playOnce(RoleRushResources.FanUpSfx, 0.5);
    this.moveUp(engine);
  }

  private moveUp(engine: Engine) {
    this.state = "movingUp";
    this.actions.clearActions();
    this.actions.moveTo(this.targetPos, this.upSpeed).callMethod(() => {
      this.state = "waitingAtTop";
      this.waitAtTop(engine);
    });
  }

  private waitAtTop(engine: Engine) {
    engine.clock.schedule(() => this.moveDown(engine), this.waitAtTopDelay);
  }

  private moveDown(engine: Engine) {
    this.state = "movingDown";
    RoleRushResources.FanUpSfx.stop();
    this.fan.graphics.use(this.animFanDown);
    SoundManager.instance.playOnce(RoleRushResources.FanDownSfx, 0.5);
    this.actions.clearActions();
    this.actions.moveTo(this.startPos, this.downSpeed).callMethod(() => {
      this.state = "resetting";
      this.resetMarker(engine);
    });
  }

  private resetMarker(engine: Engine) {
    engine.clock.schedule(() => {
      this.fan.graphics.use(this.animFanIdle);
      RoleRushResources.FanDownSfx.stop();
      this.marker.graphics.use(ElevatorMarkerSheet.getSprite(0, 0)!);
      this.state = "idle";
    }, this.resetDelay);
  }

}