import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { getFileList } from "../util";

export const genAccount = (filePath: string): Promise<void> => {
  let content = readFileSync(`./res/function/account/${filePath}`, {
    encoding: "utf-8",
  });

  const results = content
    .split("\n")
    .map((item) => (/- url: (.*)$/.exec(item) || [])[1] || "")
    .filter((item) => item.length);

  return Promise.all(
    results.map((item) =>
      axios.get(item).then(({ data }) => {
        const [, cover = ""] =
          /<meta property="og:image" content="(.*?)" \/>/.exec(data) || [];
        const [, title = ""] =
          /<meta property="og:title" content="(.*?)" \/>/.exec(data) || [];
        const [, desc = ""] =
          /<meta property="og:description" content="(.*?)" \/>/.exec(data) ||
          [];

        content = content.replace(
          `- url: ${item}`,
          `- cover: ${cover}\n    title: ${title}\n${
            desc ? `    desc: ${desc}\n` : ""
          }    url: ${item}`
        );
      })
    )
  ).then(() => {
    writeFileSync(`./res/function/account/${filePath}`, content, {
      encoding: "utf-8",
    });
  });
};

const fileList = getFileList("./res/function/account", "yml");

fileList
  .filter((item) => item !== "wx.yml" && item !== "qq.yml")
  .forEach((item) => {
    genAccount(item);
  });
