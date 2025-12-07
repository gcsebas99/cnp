import { ImageSource, Sound } from "excalibur";
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import { CustomLoader } from "@/loaders/custom-loader";
import { getLdtkMapPath } from "@/utils/get-ldtk-map-path";
import terrainUrl from "@/assets/role-rush/RoleRushTerrain (64x64).png";
import bgBlueUrl from "@/assets/role-rush/bg/Blue.png";
import bgBrownUrl from "@/assets/role-rush/bg/Brown.png";
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

const RoleRushMapUrl = getLdtkMapPath("role-rush.ldtk");

export const Resources = {
  Terrain: new ImageSource(terrainUrl),
  BgBlue: new ImageSource(bgBlueUrl),
  BgBrown: new ImageSource(bgBrownUrl),
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
  // sfx
  DoorOpenSfx: new Sound(doorOpenMp3),
  DoorCloseSfx: new Sound(doorCloseMp3),
  FanUpSfx: new Sound(fanUpMp3),
  FanDownSfx: new Sound(fanDownMp3),
};

export const RoleRushMap = new LdtkResource(RoleRushMapUrl, {
  strict: false
});
export const loader = new CustomLoader();
loader.addResource(RoleRushMap);
for (const res of Object.values(Resources)) {
  loader.addResource(res as any);
}
