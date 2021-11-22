import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import type { CopyComponentOptions } from "./typings";

export const resolveCopy = (
  element: CopyComponentOptions,
  location = ""
): void => {
  // `$file` alias resolve and file check
  if (element.text?.startsWith("$file/")) {
    const localePath = element.text.replace(/^\$file\//, "./file/");

    if (existsSync(localePath))
      element.text = element.text.replace(
        /^\$file\//,
        "https://mp.innenu.com/file/"
      );
    else console.warn(`File ${localePath} not exist in ${location}`);
  }

  // `$img` alias resolve and file check
  if (element.text?.startsWith("$img/")) {
    const localePath = element.text.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.text = element.text.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      header: ["string", "undefined"],
      text: "string",
      env: ["string[]", "undefined"],
    },
    location
  );
};
