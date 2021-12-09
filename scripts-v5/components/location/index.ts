import { LocationComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveLocation = (
  element: LocationComponentOptions,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      title: "string",
      points: "object[]",
      navigate: ["boolean", "undefined"],
    },
    location
  );

  element.points.forEach((item) => {
    checkKeys(item, {
      latitude: "number",
      longitude: "number",
      name: ["string", "undefined"],
      detail: ["string", "undefined"],
      path: ["string", "undefined"],
    });
  });
};
