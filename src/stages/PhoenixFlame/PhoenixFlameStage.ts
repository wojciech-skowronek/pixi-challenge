import { Container } from "pixi.js";
import { gsap } from "gsap";
import { Flame } from "./Flame";
import { Stage } from "../Stage/Stage";

const FLAME_COLORS = [
  0x5e0f04, 0x8e1c09, 0xd02e12, 0xf03717, 0xfff052, 0xfbe8a3,
];

export class PhoenixFlameStage extends Stage {
  private flamesContainer?: Container;

  private flames: Flame[] = [];

  public async start() {
    this.flamesContainer = new Container();

    this.container.addChild(this.flamesContainer);
    this.flamesContainer.scale.set(0.75);

    const flameComposition = FLAME_COLORS.map((color, index) => {
      const scaleDecreaseFactor = FLAME_COLORS.length * 2;

      return {
        color,
        scale: 1 - index / scaleDecreaseFactor,
        y: -50 + index * 10,
      };
    });

    flameComposition.map((options) => {
      const flame = new Flame(this.app, options);
      this.flames.push(flame);
      this.container.addChild(flame.container);
    });

    this.onResize();

    // todo: move to
    // window.addEventListener("resize", () => {
    // this.onResize();
    // });
  }

  private onResize() {
    const { width, height } = this.app.screen;
    this.app.renderer.resize(width, height);
    this.container.position.x = width / 2;
    this.container.position.y = height / 2;
  }

  public destroy(): void {
    super.destroy();
    gsap.globalTimeline.clear();

    for (const flame of this.flames) {
      flame.destroy();
    }
  }
}
