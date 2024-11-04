import { Assets, Container, Texture } from "pixi.js";
import { EAssetsPaths } from "./constants";
import { Card, STARTUP_ANIMATION_DURATION_S } from "./Card";
import { sleep } from "../../utils";
import { Stage } from "../Stage/Stage";
import { gsap } from "gsap";

const NUMBER_OF_CARDS = 144;

export class AceOfShadowStage extends Stage {
  private cardsTextures: Record<string, Texture> = {};
  private deck: Card[] = [];
  private lastZIndex = NUMBER_OF_CARDS;
  private animateDeckTimeout?: number;

  protected container = new Container();

  protected async init() {
    await this.loadAssets();

    this.container.x = this.app.screen.width * 0.1;
    this.container.y = this.app.screen.height * 0.1;
  }

  public async start() {
    await this.buildDeck();
    this.animateDeck();
  }

  private async loadAssets() {
    const sheetTexture = await Assets.load(EAssetsPaths.CardsImage);
    Assets.add({
      alias: "cardsData",
      src: EAssetsPaths.CardsData,
      data: { texture: sheetTexture },
    });
    const { textures } = await Assets.load("cardsData");
    this.cardsTextures = textures;
  }

  private async buildDeck() {
    const deckContainer = new Container();
    deckContainer.sortableChildren = true;
    this.container.addChild(deckContainer);

    const textures = Object.values(this.cardsTextures);
    const isVertical = this.app.screen.width > this.app.screen.height;

    for (let index = 0; index < NUMBER_OF_CARDS; index += 1) {
      const card = new Card({
        index,
        texture: textures[index % textures.length],
        isVertical,
      });

      card.addTo(deckContainer);
      this.deck.push(card);
    }

    await sleep(STARTUP_ANIMATION_DURATION_S * 1000);
  }

  private animateDeck(index = -1) {
    if (index * -1 > NUMBER_OF_CARDS) {
      return;
    }

    this.deck
      .at(index)
      ?.animate({ index: index * -1, zIndex: this.lastZIndex++ });
    this.animateDeckTimeout = setTimeout(
      this.animateDeck.bind(this, index - 1),
      1000,
    );
  }

  public destroy(): void {
    super.destroy();
    clearTimeout(this.animateDeckTimeout);
    gsap.globalTimeline.clear();
  }
}
