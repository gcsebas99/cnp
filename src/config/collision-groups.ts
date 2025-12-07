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

const BasketDashPlayer = CollisionGroupManager.create("b-player");
const BasketDashBasket = CollisionGroupManager.create("basket");
const BasketDashBasketItem = CollisionGroup.collidesWith([BasketDashBasket]);
const BasketDashBasketOrPlayerItem = CollisionGroup.collidesWith([BasketDashBasket, BasketDashPlayer]);

const BasketDashCollisionGroups = {
  Player: BasketDashPlayer,
  Basket: BasketDashBasket,
  BasketItem: BasketDashBasketItem,
  BasketOrPlayerItem: BasketDashBasketOrPlayerItem,
};


export {
  TennisCollisionGroups,
  BasketDashCollisionGroups,
};