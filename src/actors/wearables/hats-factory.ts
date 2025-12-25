import { Hat } from "@/actors/wearables/hat";
import { Resources as RoleRushResources } from "@/resources/role-rush-resources";
import { vec } from "excalibur";

export const Hats = {
  Chef: () =>
    new Hat({
      sprite: RoleRushResources.ChefHat.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.35, 0.35),
      rotationRight: 0,
      rotationLeft: 0,
      rightIncrement: vec(10, -8),
      leftIncrement: vec(-10, -8),
    }),

  Doctor: () =>
    new Hat({
      sprite: RoleRushResources.DoctorHat.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.30, 0.30),
      rotationRight: 0,
      rotationLeft: 0,
      rightIncrement: vec(10, 0),
      leftIncrement: vec(-5, 0),
    }),

  Mario: () =>
    new Hat({
      sprite: RoleRushResources.MarioCap.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.35, 0.35),
      rotationRight: -0.5,
      rotationLeft: 0.5,
      rightIncrement: vec(12, 1),
      leftIncrement: vec(-8, 1),
    }),

  Mozart: () =>
    new Hat({
      sprite: RoleRushResources.MozartWig.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.35, 0.30),
      rotationRight: 0,
      rotationLeft: 0,
      rightIncrement: vec(10, 4),
      leftIncrement: vec(-8, 4),
    }),

  Santa: () =>
    new Hat({
      sprite: RoleRushResources.SantaHat.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.45, 0.45),
      rotationRight: -0.1,
      rotationLeft: 0.1,
    }),

  Soccer: () =>
    new Hat({
      sprite: RoleRushResources.SoccerBall.toSprite(),
      offset: vec(0, 0),
      scale: vec(0.30, 0.30),
      rotationRight: 0,
      rotationLeft: 0,
      rightIncrement: vec(45, 73),
      leftIncrement: vec(-40, 73),
    }),
};
