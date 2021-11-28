import { existsSync } from "fs";
import { checkKeys } from "@mr-hope/assert-type";
import type { CardComponentOptions } from "./typings";
import { aliasResolve } from "../utils";

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
    } else element.logo = aliasResolve(element.logo, "Image", location);
  }

  if (element.cover)
    element.cover = aliasResolve(element.cover, "Image", location);

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

  // check options
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
