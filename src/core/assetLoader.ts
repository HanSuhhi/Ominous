import { Assets } from "pixi.js";
import type { Scenes } from "@/enums/scene.enum";

interface Asset {
  name: string
  url: string
  ext: string
  category: string
  group: string
}

function importAssetFiles() {
  const asset_files = import.meta.glob(["/public/**/*.*", "!/public/vite.svg"]);

  return Object.keys(asset_files);
}

function createManifest(asset_file_urls: ReturnType<typeof importAssetFiles>) {
  const assetsManifest: Asset[] = [];
  const assetPathRegexp = /public\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/;

  asset_file_urls.forEach((assetPath) => {
    const match = assetPathRegexp.exec(assetPath);

    if (!match || !match.groups) {
      return console.error(
        `Invalid asset path: ${assetPath}, should match ${assetPathRegexp}`,
      );
    }

    const { group, category, name, ext } = match.groups;

    // Skip image files in the spine or spritesheets category
    if (category === "spritesheets" && ext !== "json")
      return;

    if (category === "spine" && ext !== "json" && ext !== "skel")
      return;

    assetsManifest.push({
      group,
      category,
      name,
      ext,
      url: assetPath.replace(/.*public/, ""),
    });
  });

  return assetsManifest;
}

export function useAssetLoader() {
  const asset_file_urls = importAssetFiles();
  const manifest = createManifest(asset_file_urls);

  async function loadAssetsGroup(group: Scenes) {
    const sceneAssets = manifest.filter(asset => asset.group === group);

    for (const asset of sceneAssets) {
      Assets.add({
        alias: asset.name,
        src: asset.url,
      });
    }

    const resources = await Assets.load(sceneAssets.map(asset => asset.name));

    return resources;
  }

  return { loadAssetsGroup };
}
