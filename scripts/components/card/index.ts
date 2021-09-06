import { existsSync } from "fs";
import { checkKeys } from "@mr-hope/assert-type";
import type { CardComponentOptions } from "./typings";

export const resolveCard = (
  element: CardComponentOptions,
  location = ""
): void => {
  if (
    element.logo &&
    !element.logo.match(/^https?:\/\//) &&
    !element.logo.match(/\./) &&
    !existsSync(`./res/icon/${element.logo}.svg`)
  ) {
    console.warn(`${element.logo} not exist in ${location}`);
  }

  element.type = element.url.match(/^https?:\/\//) ? "web" : "page";

  checkKeys(
    element,
    {
      tag: "string",
      type: "string",
      src: "string",
      url: "string",
      title: "string",
      desc: ["string", "undefined"],
      logo: ["string", "undefined"],
      name: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
