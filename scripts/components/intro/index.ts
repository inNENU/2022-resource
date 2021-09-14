import { existsSync } from "fs";
import { IntroComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveIntro = (
  element: IntroComponentOptions,
  location = ""
): void => {
  if (
    element.logo?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.logo.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.logo} not exist in ${location}`);
  }
  if (
    element.qqQRCode?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.qqQRCode.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.qqQRCode} not exist in ${location}`);
  }
  if (
    element.wxQRCode?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.wxQRCode.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.wxQRCode} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      name: "string",
      logo: "string",
      detail: ["string", "undefined"],
      desc: ["string", "undefined"],
      qq: ["number", "undefined"],
      qqQRCode: ["string", "undefined"],
      wx: ["string", "undefined"],
      wxQRCode: ["string", "undefined"],
      openid: ["string", "undefined"],
      path: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
