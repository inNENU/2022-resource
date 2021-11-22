import { existsSync } from "fs";
import { AccountComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveAccount = (
  element: AccountComponentOptions,
  location = ""
): void => {
  // `$img` alias resolve and file check
  if (element.logo?.startsWith("$img/")) {
    const localePath = element.logo.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.logo = element.logo.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  // `$img` alias resolve and file check
  if (element.qqcode?.startsWith("$img/")) {
    const localePath = element.qqcode.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.qqcode = element.qqcode.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  // `$img` alias resolve and file check
  if (element.wxcode?.startsWith("$img/")) {
    const localePath = element.wxcode.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.wxcode = element.wxcode.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  if (element.location)
    checkKeys(
      element.location,
      { latitude: "number", longitude: "number" },
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
      mail: ["string", "undefined"],
      site: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
