import { checkKeys } from "@mr-hope/assert-type";
import { aliasResolve } from "../utils";

import type { AccountComponentOptions } from "./typings";

export const resolveAccount = (
  element: AccountComponentOptions,
  location = ""
): void => {
  // `$` alias resolve and file check
  if (element.logo)
    element.logo = aliasResolve(element.logo, "Image", location);
  if (element.qqcode)
    element.qqcode = aliasResolve(element.qqcode, "Image", location);
  if (element.wxcode)
    element.wxcode = aliasResolve(element.wxcode, "Image", location);

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

  // check location
  if (element.location)
    checkKeys(
      element.location,
      { latitude: "number", longitude: "number" },
      `${location}.location`
    );
};
