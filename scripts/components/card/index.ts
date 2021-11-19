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
    console.warn(`Icon ${element.logo} not exist in ${location}`);
  }

  if (
    element.cover?.startsWith("https://mp.innenu.com") &&
    !existsSync(element.cover.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
  ) {
    console.warn(`Image ${element.cover} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      cover: "string",
      url: ["string", "undefined"],
      title: "string",
      desc: ["string", "undefined"],
      logo: ["string", "undefined"],
      name: ["string", "undefined"],
      options: ["object", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );

  if ("options" in element)
    checkKeys(
      element.options,
      {
        appId: "string",
        envVersion: {
          type: ["string", "undefined"],
          enum: ["develop", "trial", "release", undefined],
        },
        extraData: ["Record<string, any>", "undefined"],
        path: ["string", "undefined"],
        shortLink: ["string", "undefined"],
      },
      `${location}.options`
    );

  // TODO: Remove
  element.type =
    "options" in element
      ? "miniprogram"
      : element.url.match(/^https?:\/\//)
      ? "web"
      : "page";

  if (element.cover) element.src = element.cover;
};
