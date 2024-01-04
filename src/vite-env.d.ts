/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GAME_DEFAULT_SCENE: import("./enums/scene.enum").Scenes
  readonly I18N_DEFAULT_LANG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
