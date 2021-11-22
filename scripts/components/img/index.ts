import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import type { ImageComponentOptions } from "./typings";

export const resolveImg = (
  element: ImageComponentOptions,
  location = ""
): void => {
  // `$img` alias resolve and file check
  if (element.src?.startsWith("$img/")) {
    const localePath = element.src.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.src = element.src.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
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
      env: ["string[]", "undefined"],
    },
    location
  );
};
