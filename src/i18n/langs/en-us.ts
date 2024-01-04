import { error_i18n_EN } from "../resources/error.i18n";
import { system_i18n_EN } from "../resources/system.i18n";

const enUsModel = {
  system: system_i18n_EN,
  error: error_i18n_EN,
};

export type I18nLang = typeof enUsModel;
export default enUsModel;
