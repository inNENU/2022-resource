import { checkKeys } from "@mr-hope/assert-type";
import { readFileSync, writeFileSync } from "fs";

import { resolveAccount } from "./account";
import { resolveAction } from "./action";
import { resolveAudio } from "./audio";
import { resolveCard } from "./card";
import { resolveCarousel } from "./carousel";
import { resolveDoc } from "./doc";
import { resolveFooter } from "./footer";
import { resolveGrid } from "./grid";
import { resolveList } from "./list";
import { resolveLoading } from "./loading";
import { resolveLocation } from "./location";
import { resolveImg } from "./img";
import { resolvePhone } from "./phone";
import { resolveText } from "./text";
import { resolveTitle } from "./title";
import { resolveVideo } from "./video";

import type { PageConfig, PageOptions } from "./typings";

/**
 * 处理页面数据
 *
 * @param page 页面数据
 * @param pagePath 页面路径
 *
 * @returns 处理之后的page
 */
// eslint-disable-next-line max-lines-per-function
export const resolvePage = (
  page: PageConfig,
  pagePath = "",
  diffResult = ""
): PageOptions => {
  if (!page) throw new Error(`${pagePath} doesn't contain anything`);

  if (!page.content)
    throw new Error(`${pagePath}.content doesn't contain anything`);

  const { id = pagePath, author, cite, content, ...others } = page;
  const images: string[] = [];
  const pageData: PageOptions = {
    ...others,
    id,
    ...(author
      ? { author: Array.isArray(author) ? author.join("、") : author }
      : {}),
    cite: typeof cite === "string" ? [cite] : cite || [],
    content: content.map((element, index) => {
      const { tag } = element;
      /** 当前位置 */
      const position = `${pagePath} page.content[${index}]`;

      // 处理图片
      if (tag === "img") resolveImg(element, position);
      // 设置标题
      else if (tag === "title") resolveTitle(element, position);
      // 设置文字
      else if (tag === "text" || tag === "p" || tag === "ul" || tag === "ol")
        resolveText(element, id, position);
      // 设置文档
      else if (tag === "doc") resolveDoc(element, position);
      // 设置列表组件
      else if (tag === "list" || tag === "functional-list")
        resolveList(element, id, position);
      // 设置网格组件
      else if (tag === "grid") resolveGrid(element, id, position);
      // 设置页脚
      else if (tag === "footer") resolveFooter(element, position);
      // 设置电话
      else if (tag === "phone") resolvePhone(element, position);
      // 设置轮播图
      else if (tag === "carousel") resolveCarousel(element, position);
      // 设置介绍
      else if (tag === "account") resolveAccount(element, position);
      // 设置卡片
      else if (tag === "card") resolveCard(element, position);
      // 检测动作
      else if (tag === "action") resolveAction(element, position);
      // 检测复音频
      else if (tag === "audio") resolveAudio(element, position);
      // 检测视频
      else if (tag === "video") resolveVideo(element, position);
      // 检测地点
      else if (tag === "location") resolveLocation(element, position);
      // 检测加载
      else if (tag === "loading") resolveLoading(element, position);
      else
        console.warn(
          `${pagePath} page.content[${index}] 存在非法 tag ${
            tag as unknown as string
          }`
        );

      return element;
    }),
  };

  if (!pageData.cite?.length) delete page.cite;
  if (images.length) pageData.images = images;

  checkKeys(
    pageData,
    {
      title: "string",
      id: "string",
      desc: ["string", "undefined"],
      author: ["string", "undefined"],
      time: ["string", "undefined"],
      grey: ["boolean", "undefined"],
      content: "array",
      hidden: ["boolean", "undefined"],
      shareable: ["boolean", "undefined"],
      contact: ["boolean", "undefined"],
      outdated: ["boolean", "undefined"],
      cite: ["string[]", "undefined"],
      photo: ["string[]", "undefined"],
      images: ["string[]", "undefined"],
    },
    `${pagePath} page`
  );

  // update time
  if (pageData.time && diffResult.includes(`res/${pageData.id}`)) {
    const date = new Date();

    const time = `${date.getFullYear()} 年 ${
      date.getMonth() + 1
    } 月 ${date.getDate()} 日`;

    writeFileSync(
      `./res/${pagePath}.yml`,
      readFileSync(`./res/${pagePath}.yml`, { encoding: "utf-8" }).replace(
        pageData.time,
        time
      ),
      { encoding: "utf-8" }
    );

    pageData.time = time;
  }

  return pageData;
};
