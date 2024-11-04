import { Container } from "pixi.js";
import { Layout, LayoutStyles } from "@pixi/layout";
import { FancyButton } from "../../components/FancyButton/FancyButton";
import { Stage, StageParams } from "../Stage/Stage";
import { EStage } from "../../main";

export interface MenuStageParams extends StageParams {
  onMenuClick: (stage: EStage) => void;
}

const globalStyles: LayoutStyles = {
  root: {
    width: `95%`,
    height: `95%`,
    position: "center",
  },

  menuContainer: {
    position: "center",
    maxWidth: "100%",
    minWidth: 300,
    minHeight: 500,
    maxHeight: 600,
    aspectRatio: "flex",
  },

  buttonsContainer: {
    display: "block",
    position: "center",
  },
};

const contentStyles = {
  marginBottom: 20,
  position: "center",
};

export class MenuStage extends Stage {
  private onMenuClick: (stage: EStage) => void;

  protected container = new Container();

  protected constructor({ app, onMenuClick }: MenuStageParams) {
    super({ app });
    this.onMenuClick = onMenuClick;
  }

  public async start() {
    const stages = [
      {
        name: "Ace of Shadow",
        action: () => this.onMenuClick(EStage.AceOfShadow),
        position: "topCenter",
      },
      {
        name: "Magic Words",
        action: () => this.onMenuClick(EStage.MagicWords),
        position: "center",
      },
      {
        name: "Phoenix Flame",
        action: () => this.onMenuClick(EStage.PhoenixFlame),
        position: "bottomCenter",
      },
    ];

    // todo: clean up
    const buttons = [];
    for (const { name, action, position } of stages) {
      const button = new FancyButton({
        view: new Container(),
        text: name,
        action,
      });

      buttons.push([
        name,
        {
          content: await button.display(),
          styles: { ...contentStyles, position },
        },
      ]);
    }

    const layout = new Layout({
      id: "root",
      content: {
        menuContainer: {
          content: {
            buttonsContainer: {
              content: Object.fromEntries(buttons),
            },
          },
        },
      },
      globalStyles,
    });

    this.container.addChild(layout);
    layout.resize(this.app.screen.width, this.app.screen.height);
  }
}
