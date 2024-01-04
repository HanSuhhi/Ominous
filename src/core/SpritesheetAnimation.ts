import { AnimatedSprite, Assets, Container } from "pixi.js";
import { sound } from "@pixi/sound";

interface SpriteSheetAnimationProps {
  speed?: number
};

export function useSpritesheetAnimation(name: string, props?: SpriteSheetAnimationProps) {
  const speed = props?.speed || 1;
  const container = new Container();
  const animation_textures = Assets.get(name).animations;
  const animations = new Map<string, AnimatedSprite>();
  let sprite: AnimatedSprite | undefined;
  let current_animation: string | undefined;

  function initAnimation(animation: string) {
    const textures = animation_textures[animation];

    if (!textures) {
      console.error(`Animation ${animation} not found`);

      return;
    }

    const sprite = new AnimatedSprite(textures);

    sprite.name = animation;
    sprite.anchor.set(0.5);

    sprite.animationSpeed = speed;

    return sprite;
  }

  function play({ animation, sound_name, loop = false, speed: _speed = speed }: AnimationStruct) {
    if (sprite) {
      sprite.stop();

      container.removeChild(sprite);
    }

    sprite = animations.get(animation);

    if (!sprite) {
      sprite = initAnimation(animation);
      // error in initAnimation
      if (!sprite) return;
      animations.set(animation, sprite);
    }

    current_animation = animation;

    sprite.loop = loop;
    sprite.animationSpeed = _speed;
    sprite.gotoAndPlay(0);

    if (sound_name) sound.play(sound_name);

    container.addChild(sprite);

    sprite.onComplete = () => current_animation = undefined;
  }

  return { container, play, current_animation };
}
