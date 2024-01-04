import { defineStore } from "pinia";
import { ref } from "vue";
import type { Scene } from "@/core/scene";

const useCoreStore = defineStore("core-store", () => {
  const current_scene = ref<Scene>();

  return { current_scene };
});

export { useCoreStore };
