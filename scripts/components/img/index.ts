import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import type { ImageComponentConfig } from "./typings";

export const resolveImg = (
  element: ImageComponentConfig,
  location = ""
): void => {
  if (
    element.src?.startsWith("https://mp.innenu.com") &&
    !existsSync(element.src.replace("https://mp.innenu.com/", "./"))
  ) {
    console.warn(`${element.src} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      res: ["string", "undefined"],
      desc: ["string", "undefined"],
      lazy: ["boolean", "undefined"],
      imgmode: {
        type: ["string", "undefined"],
        enum: [
          "widthFix",
          "scaleToFill",
          "aspectFit",
          "aspectFill",
          "top",
          "bottom",
          "center",
          "left",
          "right",
          "top left",
          "top right",
          "bottom left",
          "bottom right",
          undefined,
        ],
      },
      hidden: ["boolean", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
