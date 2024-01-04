import { mapKeys } from "lodash-es";

function getFilenameFromPath(path: string): string {
  return path.split("/").pop()!.split(".").shift() || "";
}

function updateFilenameFromViteGlob(_: any, path: string): string {
  return getFilenameFromPath(path);
}

export function useImportModule<T>(data: Record<string, any>, returnDefault = false): Record<string, T> {
  const returnData = mapKeys(data, updateFilenameFromViteGlob);
  if (returnDefault) for (const _data in returnData) returnData[_data] = returnData[_data].default;

  return returnData;
}
