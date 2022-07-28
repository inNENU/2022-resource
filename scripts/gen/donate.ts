import { basename } from "path";
import { resolvePage } from "../components/page";
import type { PageOptions, PageConfig } from "../components/typings";

export interface Donate {
  all: number;
  donations: [string, number][];
}

export const genDonate = (data: Donate, filePath: string): PageConfig => {
  const baseName = basename(filePath);

  const donateAmmount = data.donations.reduce(
    (prev, current) => prev + current[1],
    0
  );

  const bestData = data.donations
    .filter((item) => item[1] >= 50)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]} ￥${item[1]}`);
  const normalData = data.donations
    .filter((item) => item[1] < 50 && item[1] >= 10)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]} ￥${item[1]}`);
  const specialData = data.donations
    .filter((item) => item[1] < 10)
    .sort(([, a], [, b]) => b - a)
    .map((item) => `${item[0]}`);

  const pageData: PageOptions = {
    title: `${baseName}年感谢名单`,
    desc: "该页面为手动更新，会出现延迟",
    author: "Mr.Hope",
    id: `other/donate/${baseName}`,
    content: [
      {
        tag: "text",
        type: "info",
        text: [
          "您的支持是 Mr.Hope 的不断动力，Mr.Hope 在此表示对大家由衷的感谢!",
        ],
      },
      {
        tag: "title",
        text: "最佳支持者",
      },
      bestData.length
        ? {
            tag: "ol",
            text: bestData,
            style: "font-size: 18px",
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "杰出支持者",
      },
      normalData.length
        ? {
            tag: "ol",
            text: normalData,
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "特别支持者",
      },
      specialData.length
        ? {
            tag: "ol",
            text: specialData,
          }
        : {
            tag: "text",
            text: ["暂无"],
          },
      {
        tag: "title",
        text: "统计",
      },
      {
        tag: "ul",
        text: [
          `总支出: ${data.all}元`,
          `总支持: ${donateAmmount.toFixed(2)}元`,
          `结余: ${(donateAmmount - data.all).toFixed(2)}元`,
        ],
      },
    ],
  };

  return resolvePage(pageData);
};
