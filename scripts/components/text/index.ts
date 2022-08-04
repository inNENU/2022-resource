import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import { resolvePath, resolveStyle } from "../utils";

import type { TextComponentOptions } from "./typings";

export const resolveText = (
  element: TextComponentOptions,
  pageId: string,
  location = ""
): void => {
  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  // 处理段落
  if (typeof element.text === "string") element.text = [element.text];

  if (element.path) {
    if (element.type === "none" || !element.type)
      console.warn(`${location}: A type must be set when path is set`);

    if (element.path.startsWith("/")) {
      const path = resolvePath(element.path);

      if (!existsSync(`./res/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      element.path = path;
    } else {
      const paths = pageId.split("/");

      paths.pop();

      const path = resolvePath(`${paths.join("/")}/${element.path}`);

      if (!existsSync(`./res/${path}.yml`))
        console.error(`Path ${path} not exists in ${location}`);

      element.path = path;
    }
  }

  checkKeys(
    element,
    {
      tag: "string",
      heading: ["string", "boolean", "undefined"],
      type: {
        type: ["string", "undefined"],
        enum: ["info", "tip", "warning", "danger", "note", "none"],
      },
      text: ["string[]", "undefined"],
      style: ["string", "undefined"],
      align: {
        type: ["string", "undefined"],
        enum: ["left", "right", "center", "justify"],
      },
      path: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
