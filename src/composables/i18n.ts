import { useI18n } from "vue-i18n";

export function useLanguage() {
  const { locale } = useI18n();

  function toggleLanguage() {
    switch (locale.value) {
      case "en-us":
        locale.value = "zh-cn";
        break;
      case "zh-cn":
      default:
        locale.value = "en-us";
        break;
    }
  }

  return { toggleLanguage };
}
