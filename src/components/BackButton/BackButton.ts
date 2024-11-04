import { Button } from "@pixi/ui";
import { Container, Text, Graphics, Rectangle } from "pixi.js";

const COLOR = 0xf3c73c;

const Z_INDEX = 9199;

export class BackButton {
  private container: Container;

  constructor({ width, height }: Rectangle, onClick: () => void) {
    const size = 200;
    const radius = size / 2;

    const buttonView = new Graphics()
      .beginFill(COLOR)
      .drawRoundedRect(0, 0, size, size, radius);
    const text = new Text("⬅", { fontSize: 70 });

    text.anchor.set(1);
    text.x = buttonView.width / 2;
    text.y = buttonView.height / 2;

    buttonView.addChild(text);

    const button = new Button(buttonView);
    button.onPress.connect(onClick);

    this.container = button.view;

    // todo: fix zindex
    this.container.zIndex = Z_INDEX;
    this.container.x = width - size / 2;
    this.container.y = height - size / 2;
  }

  public hide() {
    this.container.visible = false;
  }

  public show() {
    this.container.visible = true;
  }

  public addTo(stage: Container): void {
    stage.addChild(this.container);
  }
}
