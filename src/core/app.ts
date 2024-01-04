import type { Application } from "pixi.js";
import { ref } from "vue";

const app = ref<Application>();

export function useApp() {
  return { app };
}
