import { Text } from "pixi.js";
import { useDisplayObjectPosition } from "@/utils/position";

interface TextOptions {
  center?: boolean
}

export function useText(options: TextOptions = {
  center: false,
}) {
  const { centerObjects } = useDisplayObjectPosition();

  function defineTitle(str: string, { center }: TextOptions = options) {
    const text = new Text(str, {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });
    if (center) centerObjects(text);
    return text;
  }

  return { defineTitle };
}
