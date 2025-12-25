import { ImageSource, Sound } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import terrainUrl from "@/assets/role-rush/RoleRushTerrain (64x64).png";
import bgBlueUrl from "@/assets/role-rush/bg/Blue.png";
import bgBrownUrl from "@/assets/role-rush/bg/Brown.png";
import bgGrayPng from "@/assets/role-rush/bg/Gray.png";
import bgGreenPng from "@/assets/role-rush/bg/Green.png";
import bgPinkPng from "@/assets/role-rush/bg/Pink.png";
import bgPurplePng from "@/assets/role-rush/bg/Purple.png";
import bgYellowPng from "@/assets/role-rush/bg/Yellow.png";
import doorUrl from "@/assets/role-rush/door-264-1056.png";
import invertedFanUrl from "@/assets/role-rush/inverted-fan.png";
import elevatorMarkerUrl from "@/assets/role-rush/elevator-marker.png";
import doorOpenMp3 from "@/assets/role-rush/sfx/door-open.mp3";
import doorCloseMp3 from "@/assets/role-rush/sfx/door-close.mp3";
import fanUpMp3 from "@/assets/role-rush/sfx/fan-up.mp3";
import fanDownMp3 from "@/assets/role-rush/sfx/fan-down.mp3";
import benchTriggerUrl from "@/assets/role-rush/triggers/bench.png";
import giftTriggerUrl from "@/assets/role-rush/triggers/gift.png";
import injectionTriggerUrl from "@/assets/role-rush/triggers/injection.png";
import soccerBallTriggerUrl from "@/assets/role-rush/triggers/soccer-ball.png";
import spoonTriggerUrl from "@/assets/role-rush/triggers/spoon.png";
import starTriggerUrl from "@/assets/role-rush/triggers/star.png";
import christmasTreeTargetUrl from "@/assets/role-rush/targets/christmas-tree.png";
import patientTargetUrl from "@/assets/role-rush/targets/patient.png";
import pianoTargetUrl from "@/assets/role-rush/targets/piano.png";
import soccerGoalTargetUrl from "@/assets/role-rush/targets/soccer-goal.png";
import stoveTargetUrl from "@/assets/role-rush/targets/stove.png";
import toadAndToadetteTargetUrl from "@/assets/role-rush/targets/toad-and-toadette.png";
import chefHatUrl from "@/assets/role-rush/hats/chef-hat.png";
import doctorHatUrl from "@/assets/role-rush/hats/doctor-hat.png";
import marioCapUrl from "@/assets/role-rush/hats/mario-cap.png";
import mozartWigUrl from "@/assets/role-rush/hats/mozart-wig.png";
import santaHatUrl from "@/assets/role-rush/hats/santa-hat.png";
import soccerBallUrl from "@/assets/role-rush/hats/ball.png";
import roleRushMusicMp3 from "@/assets/music/role-rush.mp3";
import targetChefMp3 from "@/assets/role-rush/sfx/target-chef.mp3";
import targetDoctorMp3 from "@/assets/role-rush/sfx/target-doctor.mp3";
import targetMusicianMp3 from "@/assets/role-rush/sfx/target-musician.mp3";
import targetSoccerMp3 from "@/assets/role-rush/sfx/target-soccer.mp3";
import targetSantaMp3 from "@/assets/role-rush/sfx/target-santa.mp3";
import targetMarioMp3 from "@/assets/role-rush/sfx/target-mario.mp3";
import hatPuffUrl from "@/assets/role-rush/puff-hat.png";
import hatPuffMp3 from "@/assets/role-rush/sfx/sfx-hat-puff.mp3";
import introMp3 from "@/assets/role-rush/sfx/rr-intro.mp3";
import startMp3 from "@/assets/role-rush/sfx/rr-start.mp3";
import cheering2Mp3 from "@/assets/tennis/sfx/sfx-cheering-2.mp3";

const RoleRushMapUrl = getLdtkMapPath("role-rush.ldtk");

export const Resources = {
  Terrain: new ImageSource(terrainUrl),
  BgBlue: new ImageSource(bgBlueUrl),
  BgBrown: new ImageSource(bgBrownUrl),
  BgGray: new ImageSource(bgGrayPng),
  BgGreen: new ImageSource(bgGreenPng),
  BgPink: new ImageSource(bgPinkPng),
  BgPurple: new ImageSource(bgPurplePng),
  BgYellow: new ImageSource(bgYellowPng),
  //
  Door: new ImageSource(doorUrl),
  InvertedFan: new ImageSource(invertedFanUrl),
  ElevatorMarker: new ImageSource(elevatorMarkerUrl),
  //role triggers
  BenchTrigger: new ImageSource(benchTriggerUrl),
  GiftTrigger: new ImageSource(giftTriggerUrl),
  InjectionTrigger: new ImageSource(injectionTriggerUrl),
  SoccerBallTrigger: new ImageSource(soccerBallTriggerUrl),
  SpoonTrigger: new ImageSource(spoonTriggerUrl),
  StarTrigger: new ImageSource(starTriggerUrl),
  //role targets
  ChristmasTreeTarget: new ImageSource(christmasTreeTargetUrl),
  PatientTarget: new ImageSource(patientTargetUrl),
  PianoTarget: new ImageSource(pianoTargetUrl),
  SoccerGoalTarget: new ImageSource(soccerGoalTargetUrl),
  StoveTarget: new ImageSource(stoveTargetUrl),
  ToadAndToadetteTarget: new ImageSource(toadAndToadetteTargetUrl),
  //hats
  ChefHat: new ImageSource(chefHatUrl),
  DoctorHat: new ImageSource(doctorHatUrl),
  MarioCap: new ImageSource(marioCapUrl),
  MozartWig: new ImageSource(mozartWigUrl),
  SantaHat: new ImageSource(santaHatUrl),
  SoccerBall: new ImageSource(soccerBallUrl),
  // sfx
  DoorOpenSfx: new Sound(doorOpenMp3),
  DoorCloseSfx: new Sound(doorCloseMp3),
  FanUpSfx: new Sound(fanUpMp3),
  FanDownSfx: new Sound(fanDownMp3),
  TargetChefSfx: new Sound(targetChefMp3),
  TargetDoctorSfx: new Sound(targetDoctorMp3),
  TargetMusicianSfx: new Sound(targetMusicianMp3),
  TargetSoccerSfx: new Sound(targetSoccerMp3),
  TargetSantaSfx: new Sound(targetSantaMp3),
  TargetMarioSfx: new Sound(targetMarioMp3),
  HatPuff: new Sound(hatPuffMp3),
  IntroSfx: new Sound(introMp3),
  StartSfx: new Sound(startMp3),
  Cheering2Sfx: new Sound(cheering2Mp3),
  // vfx
  HatPuffVfx: new ImageSource(hatPuffUrl),
  // music
  RoleRushMusic: new Sound(roleRushMusicMp3),
};

export const RoleRushMap = new LdtkResource(RoleRushMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(RoleRushMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
