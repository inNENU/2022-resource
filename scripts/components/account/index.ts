import { existsSync } from "fs";
import { AccountComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveAccount = (
  element: AccountComponentOptions,
  location = ""
): void => {
  if (
    element.logo?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.logo.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.logo} not exist in ${location}`);
  }
  if (
    element.qqcode?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.qqcode.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.qqcode} not exist in ${location}`);
  }
  if (
    element.wxcode?.match(/https?:\/\/mp\.innenu\.com/) &&
    !existsSync(element.wxcode.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.wxcode} not exist in ${location}`);
  }

  if (element.location)
    checkKeys(
      element,
      {
        latitude: "number",
        longitude: "number",
      },
      `${location}.location`
    );

  checkKeys(
    element,
    {
      tag: "string",
      name: "string",
      logo: "string",
      detail: ["string", "undefined"],
      desc: ["string", "undefined"],
      qq: ["number", "undefined"],
      qqid: ["string", "undefined"],
      qqcode: ["string", "undefined"],
      wxid: ["string", "undefined"],
      wxcode: ["string", "undefined"],
      account: ["string", "undefined"],
      location: ["object", "undefined"],
      link: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  // TODO: Remove
  if (element.account) element.path = element.account;
  if (element.qqid) element.openid = element.qqid;
  if (element.wxid) element.wx = element.wxid;
  if (element.qqcode) element.qqQRCode = element.qqcode;
  if (element.wxcode) element.wxQRCode = element.wxcode;
};
