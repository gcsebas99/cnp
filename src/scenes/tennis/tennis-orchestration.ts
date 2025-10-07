import { GameOrchestration } from "@/orchestration/game-orchestration";

export class TennisOrchestration extends GameOrchestration {
  async start() {
    this.isRunning = true;

    // Fade in scene
    await this.fadeIn(1000);

    // Player walk-in
    await this.playerWalkIn();

    // Stretch animation (placeholder)
    await this.delay(1000);

    // Setup timer + score UI
    this.setupUI();

    // // "Start" popup
    // PopupManager.instance.show({ text: "Start!", duration: 1000 });

    // // Music
    // Resources.MusicTennis.play();

    // // Enable input + timer
    // InputManager.instance.enable();
    // this.startTimer(120000); // 2 min
  }

  async end() {
    this.isRunning = false;

    // // Disable input
    // InputManager.instance.disable();

    // // "Finish" popup
    // PopupManager.instance.show({ text: "Finish!", duration: 1500 });

    // await this.delay(1500);

    // // Fade out scene
    // await this.fadeOut(1000);

    // // Switch to results scene
    // this.engine.goToScene("ResultsScene");
  }

  // Helpers
  private fadeIn(ms: number) { /* wrapper around a fade actor */ }
  //private fadeOut(ms: number) { /* wrapper around a fade actor */ }
  private delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }
  private async playerWalkIn() { /* animate player pos */ }
  private setupUI() { /* show timer + score */ }
  //private startTimer(ms: number) { /* handle game countdown */ }
}