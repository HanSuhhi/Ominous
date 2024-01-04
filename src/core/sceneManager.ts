import type { Container } from "pixi.js";
import { Application } from "pixi.js";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import type { Scene } from "./scene";
import { useApp } from "./app";
import { useAssetLoader } from "./assetLoader";
import { useCoreStore } from "@/store/core.store";
import type { Scenes } from "@/enums/scene.enum";
import { useImportModule } from "@/utils/glob";
import { Debug } from "@/utils/console";
import { i18nLangModel } from "@/i18n/model";
import { i18n } from "@/i18n/i18n";

let scene_manager: ReturnType<typeof defineSceneManager>;
let createScene: (scene_name: Scenes) => Promise<Scene>;
let removeCurrentScene: (destory?: boolean) => Promise<void>;
const canvas_node = ref<HTMLCanvasElement>();
const scene_instances: { [key in Scenes]?: Scene } = {};

function watchSceneSize() {
  const { current_scene } = storeToRefs(useCoreStore());
  const { width, height } = useWindowSize();

  const resizeFunc = () => current_scene.value?.onResize?.(width.value, height.value);

  watch(width, resizeFunc);
  watch(height, resizeFunc);
}

function watchTickerUpdate() {
  const { current_scene } = storeToRefs(useCoreStore());
  const { app } = useApp();

  app.value!.ticker.add(() => {
    current_scene.value?.update?.(app.value!.ticker.elapsedMS);
  });
}

function defineSceneRemover() {
  const { app } = useApp();
  const { current_scene } = storeToRefs(useCoreStore());

  async function destoryScene(scene: Scene) {
    delete scene_instances[scene.name];
    scene.container.destroy({ children: true });
  }

  async function removeStateScene(scene: Scene) {
    app.value?.stage.removeChild(scene.container);
  }

  removeCurrentScene = async (destory: boolean = true) => {
    if (!current_scene.value) return;

    if (destory) destoryScene(current_scene.value as Scene);
    else removeStateScene(current_scene.value as Scene);

    if (current_scene.value.unload) await current_scene.value.unload();

    current_scene.value = undefined;
  };
}

function defineSceneCreator() {
  const scenes = useImportModule<() => Scene>(import.meta.glob("@/scenes/*.scene.ts", { eager: true }), true);

  createScene = async (scene_name: Scenes) => {
    const scene = scenes[scene_name]();
    scene_instances[scene_name] = scene;

    if (scene.load) await scene.load();

    return scene;
  };
}

function defineSceneManager() {
  const { app } = useApp();
  const { loadAssetsGroup } = useAssetLoader();

  if (!canvas_node.value) throw new Error(i18n.global.t(i18nLangModel.error.no_canvas_node));
  app.value = new Application({
    view: canvas_node.value,
    autoDensity: true,
    resizeTo: window,
    powerPreference: "high-performance",
  });
  Debug(i18n.global.t(i18nLangModel.system.app_create_success));

  defineSceneRemover();
  defineSceneCreator();
  watchSceneSize();
  watchTickerUpdate();

  loadAssetsGroup(import.meta.env.GAME_DEFAULT_SCENE);
  Debug(i18n.global.t(i18nLangModel.system.asset_init_success));

  return { removeCurrentScene, createScene };
}

export function createDefaultApp(canvas: HTMLCanvasElement) {
  if (canvas_node.value || scene_manager) return;
  canvas_node.value = canvas;
  scene_manager = defineSceneManager();

  const { switchScene } = useSceneManager();
  switchScene(import.meta.env.GAME_DEFAULT_SCENE);
};

export function useSceneManager() {
  const { app } = useApp();
  const { current_scene } = storeToRefs(useCoreStore());

  async function switchScene(scene_name: Scenes) {
    await removeCurrentScene();

    current_scene.value = scene_instances[scene_name] || await createScene(scene_name);
    if (!current_scene.value) throw new Error(i18n.global.t(i18nLangModel.error.create_scene_error, { scene_name }));

    app.value!.stage.addChild(current_scene.value.container as Container);

    if (current_scene.value.start) await current_scene.value.start();

    return current_scene.value;
  }

  return { switchScene };
}
