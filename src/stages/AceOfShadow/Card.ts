import { gsap, Power1 } from "gsap";

import { Container, Sprite, Texture } from "pixi.js";

const X_SPACING = 3;

export const STARTUP_ANIMATION_DURATION_S = 0.5;
const MOVING_ANIMATION_DURATION_S = 2;

const SECOND_DECK_OFFSET = 150;

export class Card {
  protected container: Sprite;

  private isVertical: boolean;

  constructor({
    index,
    texture,
    isVertical,
  }: {
    index: number;
    texture: Texture;
    isVertical: boolean;
  }) {
    this.isVertical = isVertical;
    this.container = new Sprite(texture);

    const scale = isVertical ? 0.5 : 0.7;

    const { x, y } = this.calculatePosition(index, 0);
    this.container.scale.set(scale);
    this.container.pivot.set(0.5);

    gsap.to(this.container, {
      x: x,
      y: y,
      duration: STARTUP_ANIMATION_DURATION_S,
      ease: Power1.easeOut,
    });
  }

  private calculatePosition(index: number, baseValue: number) {
    const position = index * X_SPACING;

    const x = this.isVertical ? position : baseValue;
    const y = this.isVertical ? baseValue : position;

    return { x, y };
  }

  animate({ index, zIndex }: { index: number; zIndex: number }) {
    const { x, y } = this.calculatePosition(index, SECOND_DECK_OFFSET);

    gsap.to(this.container, {
      x: x,
      y: y,
      duration: MOVING_ANIMATION_DURATION_S,
      ease: Power1.easeOut,
    });

    this.container.zIndex = zIndex;
  }

  public addTo(stage: Container): void {
    if (this.container) {
      stage.addChild(this.container);
    }
  }
}
