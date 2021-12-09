import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";
import type { VideoComponentOptions } from "./typings";

export const resolveVideo = (
  element: VideoComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.src) element.src = aliasResolve(element.src, "File", location);

  checkKeys(
    element,
    {
      tag: "string",
      src: "string",
      loop: ["boolean", "undefined"],
      controls: ["boolean", "undefined"],
      poster: ["string", "undefined"],
      autoplay: ["boolean", "undefined"],
      startTime: ["number", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  if (element.damnu) {
    checkKeys(element.damnu, {
      btn: ["boolean", "undefined"],
      items: ["array", "undefined"],
    });

    element.damnu.item?.forEach((item) => {
      checkKeys(item, {
        text: ["string", "undefined"],
        color: ["string", "undefined"],
        time: ["number", "undefined"],
      });
    });
  }
};
