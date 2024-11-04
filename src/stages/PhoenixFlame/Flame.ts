import {
  Application,
  Container,
  Graphics,
  AlphaFilter,
  Texture,
  Sprite,
  BLEND_MODES,
} from "pixi.js";
import { AdvancedBloomFilter } from "pixi-filters";
import { gsap, Power0, Power1 } from "gsap";
import { randomOffset } from "../../utils";

// todo: make those variables relative

/* BASE SIZES */
const FLAME_RADIUS = 35;
const CUTOUT_RADIUS = 40;

/* TIMES */
const NEW_FLAME_INTERVAL_MS = 50;
const DURATION_ACCURACY_MS = 0.4;

const CUTOUT_DURATION_MODIFIER_MS = 0.2;
const CUTOUT_DURATION_MODIFIER_OFFSET_MS = 0.7;

/* CUTOUT constants */
const CUTOUT_INITIAL_X = 130;
const CUTOUT_TARGET_X = 5;
const CUTOUT_X_ACCURACY = 50;

const CUTOUT_TARGET_Y = -270;

const CUTOUT_INITIAL_SCALE = 1;
const CUTOUT_TARGET_SCALE = 0.75;

/* FLAME constants */
const FLAME_MAX_X = 120;
const FLAME_X_OFFSET = -60;

const FLAME_STAGE2_Y = 1;
const FLAME_STAGE2_Y_OFFSET = -25;

const FLAME_STAGE3_Y = -60;
const FLAME_STAGE3_Y_OFFSET = -40;

const FLAME_INITIAL_SCALE = 1.2;
const FLAME_TARGET_SCALE = 0.5;

const FLAME_TARGET_Y = -250;

export class Flame {
  container: Container;
  cutoutContainer: Container;
  flameContainer: Container;

  burstTexture: Texture;
  cutoutTexture: Texture;

  public constructor(
    private app: Application,
    options: {
      color: number;
      y: number;
      scale: number;
    },
  ) {
    this.container = new Container();
    this.cutoutContainer = new Container();
    this.flameContainer = new Container();

    this.container.addChild(this.flameContainer);
    this.container.addChild(this.cutoutContainer);

    this.container.y = options.y;
    this.container.scale.set(options.scale);

    this.flameContainer.alpha = 0.7;

    this.burstTexture = this.generateTexture({
      color: options.color,
      radius: FLAME_RADIUS,
    });

    this.cutoutTexture = this.generateTexture({
      color: 0x000000,
      alpha: 0.9,
      radius: CUTOUT_RADIUS,
    });

    this.container.filters = [new AdvancedBloomFilter(), new AlphaFilter()];
    const alphaFilter = this.container.filters.at(-1);
    if (alphaFilter) {
      alphaFilter.blendMode = BLEND_MODES.SCREEN;
    }

    this.createFlame();
  }

  private createFlame() {
    this.addBurst();
    this.addCutout(Math.random() > 0.5 ? true : false);

    setTimeout(this.createFlame.bind(this), NEW_FLAME_INTERVAL_MS);
  }

  private generateTexture({
    color,
    alpha = 1,
    radius,
  }: {
    color: number;
    alpha?: number;
    radius: number;
  }) {
    const circle = new Graphics();
    circle.lineStyle(0);
    circle.beginFill(color, alpha);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    return this.app.renderer.generateTexture(circle);
  }

  addCutout(isLeft: boolean) {
    const sideMultiplier = isLeft ? -1 : 1;
    const duration =
      this.duration *
      randomOffset(
        CUTOUT_DURATION_MODIFIER_MS,
        CUTOUT_DURATION_MODIFIER_OFFSET_MS,
      );

    const sprite = new Sprite(this.cutoutTexture);
    sprite.anchor.set(0.5);
    this.cutoutContainer.addChild(sprite);

    const targetScale = randomOffset(1, CUTOUT_TARGET_SCALE);

    const initialX =
      randomOffset(CUTOUT_X_ACCURACY, CUTOUT_INITIAL_X) * sideMultiplier;
    const targetX =
      randomOffset(CUTOUT_X_ACCURACY, CUTOUT_TARGET_X) * sideMultiplier;

    sprite.position.x = initialX;
    sprite.scale.set(CUTOUT_INITIAL_SCALE);

    gsap.to(sprite, {
      duration,
      ease: Power1.easeIn,
      pixi: {
        x: targetX,
        y: CUTOUT_TARGET_Y,
        scale: targetScale,
      },
      onComplete: () => sprite.destroy(),
    });
  }

  addBurst() {
    const duration = this.duration;

    const initialScale = randomOffset(1, FLAME_INITIAL_SCALE);
    const targetScale = randomOffset(1, FLAME_TARGET_SCALE);

    const sprite = new Sprite(this.burstTexture);
    sprite.anchor.set(0.5);
    this.flameContainer.addChild(sprite);

    sprite.scale.set(initialScale);

    const path = [
      {
        x: 0,
        y: 0,
      },
      {
        x: randomOffset(FLAME_MAX_X, FLAME_X_OFFSET),
        y: randomOffset(FLAME_STAGE2_Y, FLAME_STAGE2_Y_OFFSET),
      },
      {
        x: randomOffset(FLAME_MAX_X, FLAME_X_OFFSET),
        y: randomOffset(FLAME_STAGE3_Y, FLAME_STAGE3_Y_OFFSET),
      },
      {
        x: 0,
        y: randomOffset(1, FLAME_TARGET_Y),
      },
    ];

    gsap.to(sprite, {
      duration,
      motionPath: {
        path,
        curviness: 2,
      },
      ease: Power0.easeOut,
    });

    gsap.to(sprite, {
      duration,
      pixi: { scale: targetScale },
      onComplete: () => sprite.destroy(),
    });
  }

  get duration() {
    return 1 + Math.random() * DURATION_ACCURACY_MS;
  }

  public destroy() {
    this.container.destroy({ children: true });
  }
}
