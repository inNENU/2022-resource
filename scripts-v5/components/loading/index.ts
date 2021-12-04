import { checkKeys } from "@mr-hope/assert-type";
import type { LoadingComponentOptions } from "./typings";

export const resolveLoading = (
  element: LoadingComponentOptions,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      env: ["string[]", "undefined"],
    },
    location
  );
};
