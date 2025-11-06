
enum GameState {
  Waiting = "waiting",   // scene is loaded, showing GUI or intro
  Running = "running",   // active gameplay
  Paused = "paused",     // temporarily stopped (optional)
  Finished = "finished"  // time ended or other end condition
}

export {
  GameState
};
