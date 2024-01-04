import { createApp } from "vue";
import "./styles/index.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import { i18n } from "./i18n/i18n";

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(i18n)
  .mount("#app");
