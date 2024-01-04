import { Container } from "pixi.js";
import type { Scenes } from "@/enums/scene.enum";

interface SceneLifecycle {
  start?(): void | Promise<void>
  load?(): void | Promise<void>
  unload?(): void | Promise<void>
  onResize?(width: number, height: number): void
  update?(delta: number): void
}

export type Scene = {
  name: Scenes
  container: Container
} & SceneLifecycle;

export function defineScene(name: Scenes): Scene {
  const container = new Container();
  container.name = name;

  return {
    name,
    container,
  };
}
