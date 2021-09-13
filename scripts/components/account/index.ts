import { existsSync } from "fs";
import { checkKeys } from "@mr-hope/assert-type";
import type { AccountComponentOptions } from "./typings";

export const resolveAccount = (
  element: AccountComponentOptions,
  location = ""
): void => {
  if (
    element.logo &&
    !element.logo.match(/^https?:\/\//) &&
    !element.logo.match(/\./) &&
    !existsSync(`./res/icon/${element.logo}.svg`)
  ) {
    console.warn(`Icon ${element.logo} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      logo: "string",
      name: "string",
      detail: ["string", "undefined"],
      desc: ["string", "undefined"],
      qq: ["number", "undefined"],
      wx: ["string", "undefined"],
      qrcode: ["string", "undefined"],
      openid: ["string", "undefined"],
      path: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
