import { useMagicKeys } from "@vueuse/core";
import { xor } from "lodash-es";
import { utils } from "pixi.js";
import { watch } from "vue";

enum Keyboard_State {
  ACTION = "67sml56z2spu",
}

export enum Keyboard_Key_Actions {
  LEFT = "a0ig",
  RIGHT = "74gw",
  JUMP = "jrqr",
  SHIFT = "9t93",
}

export enum Button_State {
  Pressed,
  Release,
}

const Action_Key = {
  [Keyboard_Key_Actions.LEFT]: ["a", "arrowleft"],
  [Keyboard_Key_Actions.RIGHT]: ["d", "arrowright"],
  [Keyboard_Key_Actions.JUMP]: " ",
  [Keyboard_Key_Actions.SHIFT]: "shift",
};

const key_Action = Object.entries(Action_Key).reduce<Record<string, Keyboard_Key_Actions>>(
  (acc, [action, keys]) => {
    if (Array.isArray(keys)) keys.forEach(key => acc[key] = action as Keyboard_Key_Actions);
    else acc[keys] = action as Keyboard_Key_Actions;

    return acc;
  },
  {},
);

function defineKeyboard() {
  const emitter = new utils.EventEmitter();
  const { current } = useMagicKeys();
  let alive_key_map: string[] = [];

  const onKeyPress = (key: string) => {
    if (!(key in key_Action)) return;
    emitter.emit(Keyboard_State.ACTION, {
      action: key_Action[key],
      button_state: Button_State.Pressed,
    });
  };
  const onKeyRelease = (key: string) => {
    if (!(key in key_Action)) return;
    emitter.emit(Keyboard_State.ACTION, {
      action: key_Action[key],
      button_state: Button_State.Release,
    });
  };

  function onAction(callback: (e: {
    action: Keyboard_Key_Actions
    button_state: Button_State
  }) => void): void {
    emitter.on(Keyboard_State.ACTION, callback);
  }

  watch(current, (key_set) => {
    const current_keys = Array.from(key_set);
    const xor_key = xor(alive_key_map, current_keys)[0];
    current_keys.length > alive_key_map.length ? onKeyPress(xor_key) : onKeyRelease(xor_key);

    alive_key_map = current_keys;
  });

  return { emitter, onAction };
}

const keyboard_instance = defineKeyboard();

export function useKeyboard() {
  return { keyboard_instance };
}
