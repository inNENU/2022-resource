import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import { resolveStyle } from "../utils";
import type { SwiperComponentOptions } from "./typings";

export const resolveSwiper = (
  element: SwiperComponentOptions,
  location = ""
): void => {
  element.url?.forEach((link) => {
    if (
      link.match(/https?:\/\/mp\.innenu\.com/) &&
      !existsSync(link.replace(/https?:\/\/mp\.innenu\.com\//, "./"))
    ) {
      console.warn(`Image ${link} not exist in ${location}`);
    }
  });

  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  checkKeys(
    element,
    {
      tag: "string",
      url: "string[]",
      class: ["string", "undefined"],
      style: ["string", "undefined"],
      indicatorDots: ["boolean", "undefined"],
      dotColor: ["string", "undefined"],
      dotActiveColor: ["string", "undefined"],
      autoplay: ["boolean", "undefined"],
      interval: ["number", "undefined"],
      duration: ["number", "undefined"],
      circular: ["boolean", "undefined"],
      vertical: ["boolean", "undefined"],
      preMargin: ["string", "undefined"],
      nextMargin: ["string", "undefined"],
      change: ["string", "undefined"],
      animation: ["string", "undefined"],
      imgClass: ["string", "undefined"],
      imgmode: {
        type: ["string", "undefined"],
        enum: [
          "widthFix",
          "scaleToFill",
          "aspectFit",
          "aspectFill",
          "top",
          "bottom",
          "center",
          "left",
          "right",
          "top left",
          "top right",
          "bottom left",
          "bottom right",
          undefined,
        ],
      },
      env: ["string[]", "undefined"],
    },
    location
  );
};
