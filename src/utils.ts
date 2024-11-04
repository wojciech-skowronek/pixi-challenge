import { Application } from "pixi.js";
import Stats from "stats.js";

export const arrayRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomOffset = (max: number, offset: number): number => {
  return Math.random() * max + offset;
};

export const randomizeArray = <T>(arr: T[]): T[] => {
  return arr.sort(() => Math.random() - 0.5);
};

export const initFPS = (app: Application) => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  app.ticker.add(() => {
    stats.begin();
    stats.end();
  });
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
