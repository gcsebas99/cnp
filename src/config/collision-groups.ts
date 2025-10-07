import { CollisionGroup, CollisionGroupManager } from "excalibur";

const TennisPlayer = CollisionGroupManager.create("player");
const TennisGround = CollisionGroupManager.create("ground");
const TennisRacket = CollisionGroupManager.create("racket");
const TennisGoal = CollisionGroupManager.create("goal");
const TennisOpponent = CollisionGroupManager.create("opponent");
const TennisBall = CollisionGroup.collidesWith([TennisRacket, TennisGoal, TennisOpponent]);

const TennisCollisionGroups = {
  Player: TennisPlayer,
  Ground: TennisGround,
  Racket: TennisRacket,
  Goal: TennisGoal,
  Opponent: TennisOpponent,
  Ball: TennisBall,
};


export {
  TennisCollisionGroups,
};