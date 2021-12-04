import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";
import type { ImageComponentOptions } from "./typings";

export const resolveImg = (
  element: ImageComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src, "Image", location);

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
