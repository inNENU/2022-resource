import { existsSync } from "fs";
import { checkKeys } from "@mr-hope/assert-type";
import type { MediaComponentOptions } from "./typings";

export const resolveMedia = (
  element: MediaComponentOptions,
  location = ""
): void => {
  // `$file` alias resolve and file check
  if (element.src?.startsWith("$file/")) {
    const localePath = element.src.replace(/^\$file\//, "./file/");

    if (existsSync(localePath))
      element.src = element.src.replace(
        /^\$file\//,
        "https://mp.innenu.com/file/"
      );
    else console.warn(`File ${localePath} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      type: {
        type: "string",
        enum: ["audio", "video"],
      },
      src: "string",
      loop: ["boolean", "undefined"],
      controls: ["boolean", "undefined"],
      name: ["string", "undefined"],
      author: ["string", "undefined"],
      poster: ["string", "undefined"],
      autoplay: ["boolean", "undefined"],
      startTime: ["number", "undefined"],
      "danmu-list": ["array", "undefined"],
      "danmu-btn": ["number", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
