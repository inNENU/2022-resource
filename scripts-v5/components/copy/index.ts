import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";
import type { CopyComponentOptions } from "./typings";

export const resolveCopy = (
  element: CopyComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.text) element.text = aliasResolve(element.text, "File", location);

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
