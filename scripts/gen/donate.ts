import { basename } from "path";
import { resolvePage } from "../components/page";
import type { PageConfig } from "../components/typings";

export interface Donate {
  all: number;
  donations: [string, number][];
}

export const genDonate = (data: Donate, filePath: string) => {
  const baseName = basename(filePath);

  const donateAmmount = data.donations.reduce(
    (prev, current) => prev + current[1],
    0
  );

  const bestData = data.donations
    .filter((item) => item[1] >= 50)
    .map((item) => `${item[0]} ${item[1]}元`);
  const normalData = data.donations
    .filter((item) => item[1] < 50 && item[1] >= 10)
    .map((item) => `${item[0]} ${item[1]}元`);
  const specialData = data.donations
    .filter((item) => item[1] < 10)
    .map((item) => `${item[0]}`);

  const pageData: PageConfig = {
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
      {
        tag: "ol",
        text: bestData.length ? bestData : ["暂无"],
        style: "font-size: 18px",
      },
      {
        tag: "title",
        text: "杰出支持者",
      },
      {
        tag: "ol",
        text: normalData.length ? normalData : ["暂无"],
      },
      {
        tag: "title",
        text: "特别支持者",
      },
      {
        tag: "ol",
        text: specialData.length ? specialData : ["暂无"],
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
