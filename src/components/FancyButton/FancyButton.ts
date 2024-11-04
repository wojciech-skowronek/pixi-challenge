import { Button } from "@pixi/ui";
import { Assets, Container, Sprite, Texture, Text, isMobile } from "pixi.js";

enum EButtonAssetAlias {
  Normal = "normal",
  Hover = "hover",
  Pressed = "pressed",
}

const BUTTON_ASSETS = [
  {
    alias: EButtonAssetAlias.Normal,
    src: `assets/button/button.png`,
  },
  {
    alias: EButtonAssetAlias.Hover,
    src: `assets/button/button-hover.png`,
  },
  {
    alias: EButtonAssetAlias.Pressed,
    src: `assets/button/button-pressed.png`,
  },
];

export class FancyButton extends Button {
  private text: string;
  private buttonBg = new Sprite();

  constructor({
    view,
    action,
    text,
  }: {
    view: Container;
    text: string;
    action: () => void;
  }) {
    super(view);
    this.onPress.connect(action);
    this.text = text;
  }

  public async display() {
    await this.loadAssets();

    const textView = new Text(this.text, {
      fontSize: 36,
      fill: 0xffffff,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 4,
      dropShadowDistance: 3,
    });

    this.view.addChild(this.buttonBg, textView);

    textView.position.set(this.view.width / 2, this.view.height / 2 - 10);
    textView.anchor.set(0.5);

    return this.view;
  }

  private async loadAssets() {
    await Assets.load(BUTTON_ASSETS);

    this.buttonBg.texture = Texture.from(EButtonAssetAlias.Normal);
  }

  public down() {
    this.buttonBg.texture = Texture.from(EButtonAssetAlias.Pressed);
  }

  public up() {
    this.buttonBg.texture = isMobile.any
      ? Texture.from(EButtonAssetAlias.Normal)
      : Texture.from(EButtonAssetAlias.Hover);
  }

  public upOut() {
    this.buttonBg.texture = Texture.from(EButtonAssetAlias.Normal);
  }

  public out() {
    if (!this.isDown) {
      this.buttonBg.texture = Texture.from(EButtonAssetAlias.Normal);
    }
  }

  public hover() {
    if (!this.isDown) {
      this.buttonBg.texture = Texture.from(EButtonAssetAlias.Hover);
    }
  }
}
