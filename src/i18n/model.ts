import type { I18nLang } from "./langs/en-us";
import enUs from "./langs/en-us";

type Dictionary<T> = Record<string, T>;

function createI18nLangModel(obj: I18nLang) {
  const result = {};
  function traverse(currentObj: I18nLang, path: string, resultObj: Dictionary<NonNullable<unknown>>) {
    for (const key in currentObj) {
      const value = (currentObj as unknown as Dictionary<string>)[key];
      if (typeof value === "object") {
        resultObj[key] = {};
        traverse(value, `${path}${key}.`, resultObj[key]);
      }
      else { resultObj[`${key}`] = `${path}${key}`; }
    }
  }

  traverse(obj, "", result);
  return result;
}
export const i18nLangModel = createI18nLangModel(enUs) as I18nLang;
