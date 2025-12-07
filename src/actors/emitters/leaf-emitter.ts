import { Engine, ParticleEmitter, Vector, vec } from "excalibur";
import { BasketDashTreeLeaves } from "@/sprite-sheets/basket-dash-tree-leaves";

export class LeafEmitter extends ParticleEmitter {

  constructor(pos: Vector, emitRate = 1) {
    super({
      pos,
      width: 10,
      height: 10,
      emitRate: emitRate,
      isEmitting: true,
      particle: {
        rotation: 5,
        minSpeed: 5,
        maxSpeed: 40,
        minAngle: Math.PI/180 * 0,
        maxAngle: Math.PI/180 * 180,
        opacity: 1,
        fade: false,
        life: 15000,
        startSize: 15,
        endSize: 15,
        vel: vec(0, 30),
        acc: vec(20, 5),
      },
    });

    this.particle.graphic = BasketDashTreeLeaves[Math.floor(Math.random() * BasketDashTreeLeaves.length)];

  }

  onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);

    const x = -5 + Math.random() * 10;
    this.particle.vel = vec(x, 25);
    this.particle.acc = vec(x, 5);

    // Randomly toggle emission on/off
    if (Math.random() < 0.4) {
      this.particle.graphic = BasketDashTreeLeaves[Math.floor(Math.random() * BasketDashTreeLeaves.length)];

    }

    // this.elapsed += delta;

    // // Gentle wind sway (changes direction over time)
    // const windStrength = Math.sin(this.elapsed / 2000) * 30; // oscillates between -30 and +30 px/s

    // // Apply to each particle’s velocity X
    // for (const p of this.particles) {
    //   p.vel.x = windStrength * Math.sin((p.life) / 800 + p.pos.y / 50);
    // }
  }

  // onPreUpdate(engine: Engine, delta: number) {
  //   super.onPreUpdate(engine, delta);
  //   const windStrength = Math.sin(engine.clock.now() / 1500) * 40;
  //   this.particle.vel = vec(-30 + windStrength * 0.3, 50 + windStrength * 0.3);
  // }
}