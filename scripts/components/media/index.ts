import { MediaComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveMedia = (
  element: MediaComponentOptions,
  location = ""
): void => {
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
