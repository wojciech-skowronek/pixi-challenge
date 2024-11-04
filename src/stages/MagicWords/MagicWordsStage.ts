import { Sprite, Assets, Container, Text, Texture, TextStyle } from "pixi.js";
import { EAssetsPaths, FONTS, WORDS } from "./constants";
import { arrayRandomElement, randomInt, randomizeArray } from "../../utils";
import { Stage } from "../Stage/Stage";
import { gsap } from "gsap";

const ALPHA_ANIMATION_DURATION_S = 0.3;

const SENTENCE_DURATION_S = 2 - 2 * ALPHA_ANIMATION_DURATION_S;

export class MagicWordsStage extends Stage {
  protected container = new Container();

  private currentWords = new Container();

  private textures: Record<string, Texture> = {};

  private currentFadeInAnimation?: gsap.core.Tween;
  private currentFadeOutAnimation?: gsap.core.Tween;

  protected async init() {
    await this.loadAssets();
  }

  public async start() {
    this.container.alpha = 0;

    this.createMagicWords();

    this.currentFadeInAnimation = gsap.to(this.container, {
      alpha: 1,
      duration: ALPHA_ANIMATION_DURATION_S,
    });

    this.currentFadeOutAnimation = gsap.to(this.container, {
      alpha: 0,
      duration: ALPHA_ANIMATION_DURATION_S,
      delay: SENTENCE_DURATION_S,
      onComplete: () => {
        this.currentWords.destroy({ children: true });
        this.start();
      },
    });
  }

  private async loadAssets() {
    const sheetTexture = await Assets.load(EAssetsPaths.MagicWordsImage);
    Assets.add({
      alias: "magicWordsData",
      src: EAssetsPaths.MagicWordsData,
      data: { texture: sheetTexture },
    });
    const { textures } = await Assets.load("magicWordsData");
    this.textures = textures;

    Assets.addBundle("fonts", FONTS);
    await Assets.loadBundle("fonts");
  }

  private createMagicWords() {
    this.currentWords = new Container();

    const textStyle = this.createTextStyle();
    const firstTextContainer = this.createText(textStyle);
    const secondTextContainer = this.createText(textStyle);

    const imageHeight = Math.max(
      firstTextContainer.height,
      secondTextContainer.height,
    );

    const firstImageContainer = this.createImage(imageHeight);
    const secondImageContainer = this.createImage(imageHeight);

    const words = randomizeArray([
      firstTextContainer,
      secondTextContainer,
      firstImageContainer,
      secondImageContainer,
    ]);

    for (const word of words) {
      word.x = this.currentWords.width;
      this.currentWords.addChild(word);
    }

    this.currentWords.x =
      this.app.screen.width / 2 - this.currentWords.width / 2;
    this.currentWords.y =
      this.app.screen.height / 2 - this.currentWords.height / 2;

    this.container.addChild(this.currentWords);
  }

  private createTextStyle() {
    return new TextStyle({
      fontFamily: arrayRandomElement(Object.keys(FONTS)),
      fontSize: randomInt(36, 52),
      fill: 0xffffff,
      stroke: "#4a1850",
      strokeThickness: randomInt(0, 5),
    });
  }

  private createText(textStyle: TextStyle) {
    const container = new Container();

    const text = new Text(`${arrayRandomElement(WORDS)}`, textStyle);
    container.addChild(text);

    return container;
  }

  private createImage(height: number) {
    const container = new Container();
    const image = new Sprite(this.getRandomTexture());

    image.height = height;
    image.scale.set(Math.min(image.scale.x, image.scale.y));

    container.height = height;
    container.addChild(image);

    return container;
  }

  private getRandomTexture() {
    return arrayRandomElement(Object.values(this.textures));
  }

  public destroy() {
    super.destroy();
    this.currentFadeInAnimation?.kill();
    this.currentFadeOutAnimation?.kill();
  }
}
