import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import { resolvePath } from "../utils";
import type { GridComponentConfig } from "./typings";

export const resolveGrid = (
  element: GridComponentConfig,
  pageId: string,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      header: { type: ["string", "undefined"], additional: [false] },
      content: "array",
      footer: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  element.content.forEach((gridItem) => {
    // 处理路径
    if (gridItem.path)
      if (gridItem.path.startsWith("/")) {
        const path = resolvePath(gridItem.path);

        if (!existsSync(`./res/${path}.yml`))
          console.error(`${path} not exists in ${location}`);

        gridItem.path = path;
      } else {
        const paths = pageId.split("/");

        paths.pop();

        const path = resolvePath(`${paths.join("/")}/${gridItem.path}`);

        if (!existsSync(`./res/${path}.yml`))
          console.error(`${path} not exists in ${location}`);

        gridItem.path = path;
      }

    if (
      gridItem.icon &&
      !gridItem.icon.match(/^https?:\/\//) &&
      !gridItem.icon.match(/\./) &&
      !existsSync(`./res/icon/${gridItem.icon}.svg`)
    ) {
      console.warn(`${gridItem.icon} not exist in ${location}`);
    }

    checkKeys(
      gridItem,
      {
        text: "string",
        icon: "string",
        base64Icon: ["string", "undefined"],
        color: "string",
        name: "string",
        path: ["string", "undefined"],
        url: ["string", "undefined"],
        env: ["string[]", "undefined"],
      },
      `${location}.content`
    );
  });
};
