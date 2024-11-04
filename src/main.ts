import "./style.css";

import { PhoenixFlameStage } from "./stages/PhoenixFlame/PhoenixFlameStage";
import { AceOfShadowStage } from "./stages/AceOfShadow/AceOfShadowStage";
import { MenuStage, MenuStageParams } from "./stages/Menu/MenuStage";
import { Application } from "pixi.js";
import { initFPS } from "./utils";
import { Stage } from "./stages/Stage/Stage";
import { BackButton } from "./components/BackButton/BackButton";
import { MagicWordsStage } from "./stages/MagicWords/MagicWordsStage";

import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { gsap } from "gsap";
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);

export enum EStage {
  Menu,
  AceOfShadow,
  MagicWords,
  PhoenixFlame,
}

class Main {
  private static instance: Main;

  private app: Application;

  private backButton: BackButton;

  private currentStage?: Stage;

  public static async getInstance(): Promise<Main> {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private constructor() {
    this.app = new Application<HTMLCanvasElement>({
      antialias: true,
      backgroundColor: 0x050521,
      // background: "#1099bb",
      resizeTo: window,
      resolution: devicePixelRatio,
    });

    PixiPlugin.registerPIXI(this.app);
    initFPS(this.app);

    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.backButton = this.createBackButton();
    this.loadStage(EStage.Menu);
  }

  private clearStage() {
    this.currentStage?.destroy();
  }

  private async loadStage(stage: EStage) {
    this.clearStage();

    switch (stage) {
      case EStage.AceOfShadow:
        this.currentStage = await AceOfShadowStage.getInstance({
          app: this.app,
        });
        break;
      case EStage.MagicWords:
        this.currentStage = await MagicWordsStage.getInstance({
          app: this.app,
        });
        break;
      case EStage.PhoenixFlame:
        this.currentStage = await PhoenixFlameStage.getInstance({
          app: this.app,
        });
        break;

      case EStage.Menu:
      default:
        this.backButton.hide();
        this.currentStage = await MenuStage.getInstance<MenuStageParams>({
          app: this.app,
          onMenuClick: this.loadStage.bind(this),
        });
        break;
    }

    stage === EStage.Menu ? this.backButton.hide() : this.backButton.show();

    this.currentStage.start();
    this.currentStage.addTo(this.app.stage);
  }

  private createBackButton() {
    const backButton = new BackButton(
      this.app.screen,
      this.loadStage.bind(this, EStage.Menu),
    );
    backButton.addTo(this.app.stage);

    return backButton;
  }
}

Main.getInstance();

/*
# TODO:

2. ALL
- add fullscreen
- add GH workflows
- add deployment 



- check dates
- handle window resize for all stages

5. Menu - remove backgrounds
- code review 


MAYBE:
- fix back button z-index

3. Cards 
- card positions

*/
