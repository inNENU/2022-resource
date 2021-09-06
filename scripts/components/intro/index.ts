import { IntroComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveIntro = (
  element: IntroComponentOptions,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      name: "string",
      logo: "string",
      desc: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
