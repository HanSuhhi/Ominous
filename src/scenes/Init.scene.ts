import { defineScene } from "@/core/scene";
import { Scenes } from "@/enums/scene.enum";
import { useText } from "@/resourse/elements/text";

export default function () {
  const scene = defineScene(Scenes.Init);
  const { container } = scene;

  const { defineTitle } = useText();

  scene.load = async () => {
    const title = defineTitle("Loading...", { center: true });

    container.addChild(title);
  };

  // scene.start = async () => {
  //   await loadAssetsGroup(Scenes.Game);
  // };

  return scene;
}
