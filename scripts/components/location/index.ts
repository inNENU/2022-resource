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
      name: ["string", "undefined"],
      detail: ["string", "undefined"],
      latitude: "number",
      longitude: "number",
    });
  });
};
