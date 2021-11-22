import axios from "axios";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getFileList } from "../util";

interface AccountInfo {
  name: string;
  desc?: string;
  logo: string;
  path?: string;
  id?: number;
  qrcode?: string;
  openid?: string;
}

export interface AccountConfig {
  name: string;
  account: AccountInfo[];
}

export const checkAccount = (
  data: AccountConfig[],
  location: string
): AccountConfig[] => {
  data.forEach((item) => {
    item.account.forEach((config) => {
      // `$img` alias resolve and file check
      if (config.logo?.startsWith("$img/")) {
        const localePath = config.logo.replace(/^\$img\//, "./img/");

        if (existsSync(localePath))
          config.logo = config.logo.replace(
            /^\$img\//,
            "https://mp.innenu.com/img/"
          );
        else console.warn(`Image ${localePath} not exist in ${location}`);
      }

      // `$img` alias resolve and file check
      if (config.qrcode?.startsWith("$img/")) {
        const localePath = config.qrcode.replace(/^\$img\//, "./img/");

        if (existsSync(localePath))
          config.qrcode = config.qrcode.replace(
            /^\$img\//,
            "https://mp.innenu.com/img/"
          );
        else console.warn(`Image ${localePath} not exist in ${location}`);
      }
    });
  });

  return data;
};

export interface AccountDetail {
  name: string;
  detail?: string;
  desc?: string;
  id: string;
  logo: string;
  qrcode: string;
  article: { cover: string; title: string; url: string; desc?: string }[];
}

export const checkAccountDetail = (
  data: AccountDetail,
  location: string
): AccountDetail => {
  // `$img` alias resolve and file check
  if (data.logo?.startsWith("$img/")) {
    const localePath = data.logo.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      data.logo = data.logo.replace(/^\$img\//, "https://mp.innenu.com/img/");
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  // `$img` alias resolve and file check
  if (data.qrcode?.startsWith("$img/")) {
    const localePath = data.qrcode.replace(/^\$img\//, "./img/");

    if (existsSync(localePath))
      data.qrcode = data.qrcode.replace(
        /^\$img\//,
        "https://mp.innenu.com/img/"
      );
    else console.warn(`Image ${localePath} not exist in ${location}`);
  }

  return data;
};

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
      axios.get<string>(item).then(({ data }) => {
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
