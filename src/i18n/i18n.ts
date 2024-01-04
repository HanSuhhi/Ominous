import { createI18n } from "vue-i18n";
import { useNavigatorLanguage } from "@vueuse/core";
import { useImportModule } from "@/utils/glob";

const messages = useImportModule(import.meta.glob("@/i18n/langs/*.ts", { eager: true }), true) as Parameters<typeof createI18n>[0]["messages"];

const browerLocale = useNavigatorLanguage().language.value;
const locale = browerLocale?.toLowerCase() || import.meta.env.I18N_DEFAULT_LANG;

export const i18n = createI18n({
  globalInjection: true,
  locale,
  legacy: false,
  messages,
});
