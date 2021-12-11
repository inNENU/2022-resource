import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { getFileList } from "../util";

import type { SearchInfo } from "./typings";
import type { PageOptions } from "../components/typings";

// 创建搜索字典
const createSearchMap = (folder: string): SearchInfo => {
  const fileList = getFileList(folder, "json");

  const searchMap: SearchInfo = {};

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(folder, filePath), {
      encoding: "utf-8",
    });
    const pageConfig = JSON.parse(content) as PageOptions;
    const pathName = `${folder}/${filePath}`.replace(
      /\.\/r\/(.*)\.json/u,
      "$1"
    );

    // 生成对应页面的索引对象
    searchMap[pathName] = {
      name: pageConfig.title,
      index: [],
    };

    // 将页面的标题写入搜索详情中
    pageConfig.content.forEach((element) => {
      /** 写入段落大标题 */
      if (element.tag === "title")
        searchMap[pathName].index.push(["title", element.text]);
      else if (element.tag === "text") {
        /** 写入段落标题 */
        if (element.heading && element.heading !== true)
          searchMap[pathName].index.push(["heading", element.heading]);

        /** 写入段落文字 */
        if (element.text)
          element.text.forEach((item) => {
            searchMap[pathName].index.push(["text", item]);
          });
      } else if (element.tag === "img" && element.desc)
        searchMap[pathName].index.push(["img", element.desc]);
      else if (element.tag === "list") {
        /** 写入段落标题 */
        if (element.header)
          searchMap[pathName].index.push(["heading", element.header]);

        /** 写入段落文字  */
        element.items?.forEach((config) => {
          if (config.text && !config.path && !config.url)
            searchMap[pathName].index.push(["text", config.text]);
        });
      } else if (element.tag === "card")
        searchMap[pathName].index.push([
          "card",
          {
            title: element.title,
            desc: element.desc || "",
          },
        ]);
      else if (element.tag === "doc")
        searchMap[pathName].index.push([
          "doc",
          {
            name: element.name,
            icon: element.icon,
          },
        ]);
      else if (element.tag === "account") {
        searchMap[pathName].index.push(["heading", element.name]);
        if (element.detail)
          searchMap[pathName].index.push(["text", element.detail]);
        if (element.desc)
          searchMap[pathName].index.push(["text", element.desc]);
      } else if (element.tag === "phone")
        searchMap[pathName].index.push([
          "text",
          `${element.lName || ""}${element.fName}: ${element.num}`,
        ]);
    });
  });

  return searchMap;
};

/** 生成关键词 */
export const genSearchMap = (): void => {
  console.log("Generating search index...");

  const guideSearchMap = createSearchMap("./r/guide");
  const introSearchMap = createSearchMap("./r/intro");

  // 写入关键词列表
  writeFileSync("./r/guide-search.json", JSON.stringify(guideSearchMap));
  writeFileSync("./r/intro-search.json", JSON.stringify(introSearchMap));
  writeFileSync(
    "./r/all-search.json",
    JSON.stringify({ ...guideSearchMap, ...introSearchMap })
  );

  console.log("Search index generated");
};
