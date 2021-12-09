import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";
import type { AudioComponentOptions } from "./typings";

export const resolveAudio = (
  element: AudioComponentOptions,
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
      name: ["string", "undefined"],
      author: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
