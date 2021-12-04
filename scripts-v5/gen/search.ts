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
      /\.\/resource\/(.*)\.json/u,
      "$1"
    );

    // 生成对应页面的索引对象
    searchMap[pathName] = {
      name: pageConfig.title,
    };

    if (pageConfig.desc) searchMap[pathName].desc = pageConfig.desc;

    // 将页面的标题写入搜索详情中
    pageConfig.content.forEach((element) => {
      /** 写入段落大标题 */
      if (element.tag === "title")
        searchMap[pathName].title = [
          ...(searchMap[pathName].title || []),
          element.text,
        ];

      if (element.tag === "text") {
        /** 写入段落标题 */
        if (element.heading && element.heading !== true)
          searchMap[pathName].heading = [
            ...(searchMap[pathName].heading || []),
            element.heading,
          ];

        /** 写入段落文字 */
        if (element.text)
          searchMap[pathName].text = [
            ...(searchMap[pathName].text || []),
            ...element.text,
          ];
      }

      if (element.tag === "list" && element.content) {
        /** 写入段落标题 */
        if (element.header)
          searchMap[pathName].heading = [
            ...(searchMap[pathName].heading || []),
            element.header,
          ];

        /** 写入段落文字  */
        element.content.forEach((config) => {
          if (config.text && !config.path && !config.url)
            searchMap[pathName].text = [
              ...(searchMap[pathName].text || []),
              config.text,
            ];
        });
      }

      if (element.tag === "card")
        searchMap[pathName].card = [
          ...(searchMap[pathName].card || []),
          {
            title: element.title,
            ...(element.desc ? { desc: element.desc } : {}),
          },
        ];

      if (element.tag === "doc")
        searchMap[pathName].doc = [
          ...(searchMap[pathName].doc || []),
          {
            name: element.name,
            icon: element.icon,
          },
        ];

      if (element.tag === "img" && element.desc)
        searchMap[pathName].text = [
          ...(searchMap[pathName].text || []),
          element.desc,
        ];

      if (element.tag === "account") {
        searchMap[pathName].heading = [
          ...(searchMap[pathName].heading || []),
          element.name,
        ];
        if (element.detail)
          searchMap[pathName].text = [
            ...(searchMap[pathName].text || []),
            element.detail,
          ];
        if (element.desc)
          searchMap[pathName].text = [
            ...(searchMap[pathName].text || []),
            element.desc,
          ];
      }
    });
  });

  return searchMap;
};

/** 生成关键词 */
export const genSearchMap = (): void => {
  console.log("Generating search index...");

  const guideSearchMap = createSearchMap("./resource/guide");
  const introSearchMap = createSearchMap("./resource/intro");

  // 写入关键词列表
  writeFileSync("./resource/guide-search.json", JSON.stringify(guideSearchMap));
  writeFileSync("./resource/intro-search.json", JSON.stringify(introSearchMap));
  writeFileSync(
    "./resource/all-search.json",
    JSON.stringify({ ...guideSearchMap, ...introSearchMap })
  );

  console.log("Search index generated");
};
