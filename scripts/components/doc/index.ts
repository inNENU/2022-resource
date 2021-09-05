import { checkKeys } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import type { DocComponentConfig } from "./typings";

/**
 * 获得文档图标
 *
 * @param url 文档地址
 */
const getDocIcon = (url: string): string => {
  if (!url) return "";

  const docType = url.split(".").pop();

  return docType === "docx" || docType === "doc"
    ? "doc"
    : docType === "pptx" || docType === "ppt"
    ? "ppt"
    : docType === "xlsx" || docType === "xls"
    ? "xls"
    : docType === "jpg" || docType === "jpeg" || docType === "jfif"
    ? "jpg"
    : docType === "mp4" ||
      docType === "mov" ||
      docType === "avi" ||
      docType === "rmvb"
    ? "video"
    : docType === "pdf"
    ? "pdf"
    : docType === "png" || docType === "gif"
    ? docType
    : "document";
};

export const resolveDoc = (
  element: DocComponentConfig,
  location = ""
): void => {
  element.icon = getDocIcon(element.url);

  if (
    element.url?.startsWith("https://mp.innenu.com") &&
    !existsSync(element.url.replace("https://mp.innenu.com/", "./"))
  ) {
    console.warn(`${element.url} not exist in ${location}`);
  }

  checkKeys(
    element,
    {
      tag: "string",
      icon: "string",
      name: "string",
      url: "string",
      downloadable: { type: ["undefined"], additional: [true] },
      hidden: ["boolean", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
