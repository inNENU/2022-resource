import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "fs";
import { dirname, resolve } from "path";

import { getFileList } from "../util";

/** SVG 转换 */
export const convertCSSSVG = (content: string): string =>
  `data:image/svg+xml,${content
    .replace(/"/gu, "'")
    .replace(/</gu, "%3C")
    .replace(/>/gu, "%3E")
    .replace(/#/gu, "%23")}`;

const convertBase64SVG = (content: string): string =>
  `data:image/svg+xml;base64,${Buffer.from(
    unescape(encodeURIComponent(content)),
    "utf8"
  ).toString("base64")}`;

export const genIcon = (): void => {
  const fileList = getFileList("./res/icon", "svg");
  const genFileList = getFileList("./r/icon");
  const hintIconData: Record<string, string> = {};
  const weatherIconData: Record<string, string> = {};
  const shareIconData: Record<string, string> = {};

  // remove files
  genFileList.forEach((path) => {
    if (fileList.every((filePath) => !filePath.includes(path)))
      unlinkSync(resolve("./r/icon", path));
  });

  fileList.forEach((filePath) => {
    if (/weather\/hints\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./res/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/weather\/hints\/(.*)\.svg/u, "$1");

      hintIconData[path] = convertBase64SVG(svgContent);
    } else if (/weather\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./res/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/weather\/(.*)\.svg/u, "$1");

      weatherIconData[path] = convertBase64SVG(svgContent);
    } else if (/share\//u.exec(filePath)) {
      const svgContent = readFileSync(resolve("./res/icon", filePath), {
        encoding: "utf-8",
      });
      const path = filePath.replace(/share\/(.*)\.svg/u, "$1");

      shareIconData[path] = convertBase64SVG(svgContent);
    } else {
      const folderPath = dirname(resolve("./r/icon", filePath));

      if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

      const svgContent = readFileSync(resolve("./res/icon", filePath), {
        encoding: "utf-8",
      });

      writeFileSync(
        resolve("./r/icon", filePath.replace(/\.svg$/u, "")),
        convertBase64SVG(svgContent),
        { encoding: "utf-8" }
      );
    }
  });

  // 生成天气图标
  const weatherFolderPath = "./r/icon/weather";

  if (!existsSync(weatherFolderPath))
    mkdirSync(weatherFolderPath, { recursive: true });

  writeFileSync("./r/icon/weather/hint", JSON.stringify(hintIconData), {
    encoding: "utf-8",
  });

  writeFileSync("./r/icon/weather/icon", JSON.stringify(weatherIconData), {
    encoding: "utf-8",
  });

  writeFileSync("./r/icon/shareicons", JSON.stringify(shareIconData), {
    encoding: "utf-8",
  });
};
