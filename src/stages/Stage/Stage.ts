import { Application, Container } from "pixi.js";

export interface StageParams {
  app: Application;
}

export class Stage {
  protected container = new Container();

  protected app: Application;

  protected static instance: Stage;

  public static async getInstance<T>(
    params: T extends StageParams ? T : StageParams,
  ): Promise<Stage> {
    if (!this.instance) {
      this.instance = new this(params);
      await this.instance.init();
    }

    return this.instance;
  }

  protected async init(): Promise<void> {}

  protected constructor({ app }: StageParams) {
    this.app = app;
  }

  public start() {}

  public destroy() {
    for (const child of this.container.children) {
      child.destroy({ children: true });
    }
  }

  public addTo(container: Container) {
    container.addChild(this.container);
  }
}
