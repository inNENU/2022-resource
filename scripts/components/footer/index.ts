import { FooterComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveFooter = (
  element: FooterComponentOptions,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      author: ["string", "undefined"],
      time: ["string", "undefined"],
      desc: ["string", "undefined"],
      env: ["string[]", "undefined"],
      cite: ["string[]", "undefined"],
    },
    location
  );
};
