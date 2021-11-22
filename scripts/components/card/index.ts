import { existsSync } from "fs";
import { checkKeys } from "@mr-hope/assert-type";
import type { CardComponentOptions } from "./typings";

export const resolveCard = (
  element: CardComponentOptions,
  location = ""
): void => {
  if (element.logo) {
    // check icons
    if (
      !element.logo.match(/^https?:\/\//) &&
      !element.logo.match(/\./) &&
      !existsSync(`./res/icon/${element.logo}.svg`)
    ) {
      console.warn(`Icon ${element.logo} not exist in ${location}`);
    }
    // `$img` alias resolve and file check
    else if (element.logo.startsWith("$img/")) {
      const localePath = element.logo.replace(/^\$img\//, "./img/");

      if (existsSync(localePath))
        element.logo = element.logo.replace(
          /^\$img\//,
          "https://mp.innenu.com/img/"
        );
      else console.warn(`Image ${localePath} not exist in ${location}`);
    }
  }

  // `$img` alias resolve and file check
  if (element.cover?.startsWith("$img/")) {
    const localePath = element.cover.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      element.cover = element.cover.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      cover: ["string", "undefined"],
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
};
