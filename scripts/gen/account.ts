import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { aliasResolve } from "../components/utils";
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

const decodeText = (text: string): string =>
  text
    .replace("&quot;", '"')
    .replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&nbsp;", " ");

export const checkAccount = (
  data: AccountConfig[],
  location: string
): AccountConfig[] => {
  data.forEach((item) => {
    item.account.forEach((config) => {
      // `$` alias resolve and file check
      if (config.logo)
        config.logo = aliasResolve(config.logo, "Image", location);
      if (config.qrcode)
        config.qrcode = aliasResolve(config.qrcode, "Image", location);
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
  // `$` alias resolve and file check
  if (data.logo) data.logo = aliasResolve(data.logo, "Image", location);
  if (data.qrcode) data.qrcode = aliasResolve(data.qrcode, "Image", location);

  return data;
};

export const genAccount = (filePath: string): Promise<void> => {
  let content = readFileSync(`./res/account/${filePath}`, {
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
          `- cover: ${cover}\n    title: ${decodeText(title)}\n${
            desc ? `    desc: ${decodeText(desc)}\n` : ""
          }    url: ${item}`
        );
      })
    )
  ).then(() => {
    writeFileSync(`./res/account/${filePath}`, content, {
      encoding: "utf-8",
    });
  });
};

const fileList = getFileList("./res/account", "yml");

fileList.forEach((item) => {
  genAccount(item);
});
