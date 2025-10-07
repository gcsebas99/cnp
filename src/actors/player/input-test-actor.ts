import { InputManager } from "@/managers/input-manager";
import { Actor, Color, Engine, vec, Font, Text, BaseAlign, TextAlign, ExcaliburGraphicsContext, Rectangle } from "excalibur";

export class InputTestActor extends Actor {
  private input = InputManager.instance;
  private counter = 0;
  private activeInput: string | null = null;
  private _color = Color.LightGray;

  constructor(x: number, y: number, width: number, height: number) {
    super({
      pos: vec(x, y),
      width,
      height,
      color: Color.LightGray,
      anchor: vec(0.5, 0.5)
    });
  }

  onPreUpdate(_engine: Engine, delta: number) {
    const state = this.input.state;

    // Default reset
    let currentInput: string | null = null;
    let newColor: Color | null = null;

    // Directions
    if (state.heldTime.get("left")) {
      currentInput = "Left";
      newColor = Color.Red;
    } else if (state.heldTime.get("right")) {
      currentInput = "Right";
      newColor = Color.Blue;
    } else if (state.heldTime.get("up")) {
      currentInput = "Up";
      newColor = Color.Green;
    } else if (state.heldTime.get("down")) {
      currentInput = "Down";
      newColor = Color.Black;
    }
    // Buttons
    if (state.heldTime.get("button1")) {
      currentInput = "Button1";
      newColor = Color.Yellow;
    } else if (state.heldTime.get("button2")) {
      currentInput = "Button2";
      newColor = Color.Orange;
    } else if (state.heldTime.get("button3")) {
      currentInput = "Button3";
      newColor = Color.Magenta;
    } else if (state.heldTime.get("pause")) {
      currentInput = "Pause";
      newColor = Color.Brown;
    }

    if (currentInput) {
      if (this.activeInput === currentInput) {
        this.counter += delta;
      } else {
        this.activeInput = currentInput;
        this.counter = 0;
      }
      this._color = newColor ?? Color.LightGray;
    } else {
      this.activeInput = null;
      this.counter = 0;
      this._color = Color.LightGray;
    }

    const currentGraphic = this.graphics.current;
    if (currentGraphic instanceof Rectangle) {
      currentGraphic.color = this._color;
    }
  }

  draw(ctx: ExcaliburGraphicsContext) {
    if (!this.activeInput) return;

    const text = new Text({
      text: `${this.activeInput}: ${Math.floor(this.counter / 100)}`, // count in "ticks"
      color: Color.Black,
      font: new Font({
        family: "ThaleahFat",
        size: 40,
        bold: true,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      })
    });

    text.draw(ctx, this.pos.x, this.pos.y);
  }
}
