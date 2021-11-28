import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";
import type { MediaComponentOptions } from "./typings";

export const resolveMedia = (
  element: MediaComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src, "File", location);

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
