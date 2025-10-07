import { Engine, Color, ExcaliburGraphicsContext, Text, Font, TextAlign, BaseAlign } from "excalibur";
import { InputManager } from "./input-manager";
import { AdventureSlot, PersistentGameStateManager } from "./persistent-game-state-manager";
import { createNineSliceSprites } from "@/utils/create-nine-slice-sprite";
import { Buttons } from "@/sprite-sheets/buttons";
import { drawNineSliceButton } from "@/utils/draw-nine-slice-button";
import { CursorSheet } from "@/sprite-sheets/cursor";

type MenuState = "main" | "adventure" | "minigames" | "slotDetails";

interface MenuItem {
  label: string;
  color: Color;
}

export class MenuManager {
  private engine: Engine;
  private state: MenuState = "main";
  private hIndex: number = 0; // horizontal selection index
  private detailIndex: number = 0; // vertical selection index inside slots
  private elapsed = 0;

  private mainMenu: MenuItem[] = [
    { label: "Adventure", color: Color.Chartreuse },
    { label: "Playground", color: Color.Cyan }
  ];

  private minigames: MenuItem[] = [
    { label: "Tennis", color: Color.Violet },
    { label: "Basket Dash", color: Color.Orange },
    { label: "Role Rush", color: Color.Gray }
  ];

  private memorySlots: AdventureSlot[] = [
    PersistentGameStateManager.getAdventureSlot(0),
    PersistentGameStateManager.getAdventureSlot(1),
    PersistentGameStateManager.getAdventureSlot(2),
    PersistentGameStateManager.getAdventureSlot(3),
    PersistentGameStateManager.getAdventureSlot(4)
  ];

  private input: InputManager;

  constructor(engine: Engine) {
    this.engine = engine;
    this.input = InputManager.instance; //input manager already initialized in main.ts
  }

  setState(newState: MenuState) {
    this.state = newState;
  }

  private handleLeft() {
    if (this.state === "main" || this.state === "adventure" || this.state === "minigames") {
      this.hIndex = (this.hIndex - 1 + this.getActiveMenu().length) % this.getActiveMenu().length;
    }
  }

  private handleRight() {
    if (this.state === "main" || this.state === "adventure" || this.state === "minigames") {
      this.hIndex = (this.hIndex + 1) % this.getActiveMenu().length;
    }
  }

  private handleUp() {
    if (this.state === "slotDetails") {
      if (this.detailIndex === 0) {
        // Go back to slots
        this.state = "adventure";
      } else {
        const slot = this.memorySlots[this.hIndex];
        const maxOptions = 1 + slot.reachedLevels;
        this.detailIndex = (this.detailIndex - 1 + maxOptions) % maxOptions;
      }
    }
  }

  private handleDown() {
    if (this.state === "slotDetails") {
      const slot = this.memorySlots[this.hIndex];
      const maxOptions = 1 + slot.reachedLevels;
      this.detailIndex = (this.detailIndex + 1) % maxOptions;
    }
  }

  private handleSelect() {
    if (this.state === "main") {
      if (this.hIndex === 0) {
        this.state = "adventure";
        this.hIndex = 0;
      } else if (this.hIndex === 1) {
        this.state = "minigames";
        this.hIndex = 0;
      }
    }

    else if (this.state === "adventure") {
      const slot = this.memorySlots[this.hIndex];
      if (slot.saved) {
        // Move focus to vertical options
        this.state = "slotDetails";
        this.detailIndex = 0;
      } else {
        // Start new game immediately
        PersistentGameStateManager.saveAdventureSlot(this.hIndex, {
          currentLevel: 1,
          currentRoom: "start",
          reachedLevels: 1,
          obtainedItems: []
        });
        this.engine.goToScene("levelOne");
      }
    }

    else if (this.state === "slotDetails") {
      //const slot = this.memorySlots[this.hIndex];
      // For now, all options load LevelOne
      this.engine.goToScene("levelOne");
    }

    else if (this.state === "minigames") {
      if (this.hIndex === 0) {
        this.engine.goToScene("tennis");
      } else if (this.hIndex === 1) {
        this.engine.goToScene("basketDash");
      } else {
        this.engine.goToScene("roleRush");
      }
    }
  }

  private handleBack() {
    if (this.state === "slotDetails") {
      this.state = "adventure";
    } else if (this.state === "adventure" || this.state === "minigames") {
      this.state = "main";
    }
  }

  private getActiveMenu() {
    if (this.state === "main") return this.mainMenu;
    if (this.state === "minigames") return this.minigames;
    if (this.state === "adventure" || this.state === "slotDetails") return this.memorySlots.map((s) => ({
      label: `Slot ${s.id + 1}`,
      color: s.saved ? Color.Green : Color.LightGray
    }));
    return [];
  }

  public update(dt: number) {
    this.elapsed += dt;

    const input = this.input.state;
    // Navigation
    if (input.justPressed.has("left")) this.handleLeft();
    if (input.justPressed.has("right")) this.handleRight();
    if (input.justPressed.has("up")) this.handleUp();
    if (input.justPressed.has("down")) this.handleDown();

    // Confirm / Back
    if (input.justPressed.has("button1")) this.handleSelect();
    if (input.justPressed.has("button2") || input.justPressed.has("pause")) this.handleBack();
    }

  public draw(ctx: ExcaliburGraphicsContext) {
    const menu = this.getActiveMenu();
    const buttonWidth = 320;
    const buttonHeight = 120;
    const spacing = 80;

    const totalWidth = menu.length * buttonWidth + (menu.length - 1) * spacing;
    const startX = this.engine.halfDrawWidth - totalWidth / 2;
    const y = 300;

    // Draw buttons horizontally
    menu.forEach((item, index) => {
      const x = startX + index * (buttonWidth + spacing);

      const buttonSprite = index === this.hIndex ? Buttons.red.pressed : Buttons.red.default;
      const nine = createNineSliceSprites(buttonSprite, 16, 6);
      drawNineSliceButton(ctx, nine, x, y, buttonWidth, buttonHeight, 6);

      // Draw frame around selected item
      if (this.state !== "slotDetails" && index === this.hIndex) {
        const cursorSprite = CursorSheet.getSprite(0, 0);
        //cursorSprite.scale = vec(2, 2);
        const nineCursor = createNineSliceSprites(cursorSprite, 30, 14);
        drawNineSliceButton(ctx, nineCursor, x - 8, y - 8, buttonWidth + 16, buttonHeight + 16, 14);
      }

      const text = new Text({
        text: item.label,
        color: Color.White,
        font: new Font({
          family: "ThaleahFat",
          size: 46,
          bold: true,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle
        })
      });

      text.draw(ctx, x + buttonWidth / 2, y + buttonHeight / 2);
    });

    // Always show slot details area below slots
    if (this.state === "adventure" || this.state === "slotDetails") {
      const slot = this.memorySlots[this.hIndex];
      const baseY = y + buttonHeight + 60;

      if (slot.saved) {
        const options = ["Continue"];
        for (let i = 1; i <= slot.reachedLevels; i++) {
          options.push(`Level ${i}`);
        }

        options.forEach((label, idx) => {
          const optColor =
            this.state === "slotDetails" && idx === this.detailIndex
              ? Color.Yellow
              : Color.White;

          const text = new Text({
            text: label,
            color: optColor,
            font: new Font({
              family: "ThaleahFat",
              size: 36,
              bold: true,
              textAlign: TextAlign.Center,
              baseAlign: BaseAlign.Middle
            })
          });
          text.draw(ctx, this.engine.halfDrawWidth, baseY + idx * 60);
        });
      } else {
        const alpha = 0.5 + 0.5 * Math.sin(this.elapsed / 400);
        const msg = new Text({
          text: "Select to start new game...",
          color: new Color(255, 255, 255, alpha),
          font: new Font({
            family: "ThaleahFat",
            size: 48,
            textAlign: TextAlign.Center,
            baseAlign: BaseAlign.Middle
          })
        });
        msg.draw(ctx, this.engine.halfDrawWidth, baseY);
      }
    }

    if (this.state === "minigames") {
      const baseY = y + buttonHeight + 60;
      const highest = PersistentGameStateManager.getHighScore(this.hIndex === 0 ? "tennisHighScore" : (this.hIndex === 1 ? "basketDashHighScore" : "roleRushHighScore"));
      const msg = new Text({
        text: "Highest score: " + highest,
        color: Color.White,
        font: new Font({
          family: "ThaleahFat",
          size: 48,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle
        })
      });
      msg.draw(ctx, this.engine.halfDrawWidth, baseY);
    }
  }
}
