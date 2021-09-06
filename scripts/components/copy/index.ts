import { CopyComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveCopy = (
  element: CopyComponentOptions,
  location = ""
): void => {
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
