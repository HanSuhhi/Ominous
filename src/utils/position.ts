import { type DisplayObject, Sprite } from "pixi.js";

export function useDisplayObjectPosition() {
  function center(obj: DisplayObject) {
    obj.x = window.innerWidth / 2;
    obj.y = window.innerHeight / 2;
    if (obj instanceof Sprite) obj.anchor.set(0.5, 0.5);

    return obj;
  }

  function centerObjects(...toCenter: DisplayObject[]) {
    toCenter.forEach(center);
    return toCenter;
  }

  return {
    center,
    centerObjects,
  };
}
