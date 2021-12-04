import { execSync } from "child_process";
import { sync as del } from "del";
import { convertYml2Json } from "../util/yml2json";
import { resolvePage } from "../components/page";
import { checkAccount, checkAccountDetail } from "./account";
import { count } from "./count";
import { genDonate } from "./donate";
import { genIcon } from "./icon";
import { genLyric } from "./lyric";
import { genPEScore } from "./peScore";
import { genQRCode } from "./qrcode";
import { genSearchMap } from "./search";
import { resolveLocationPage } from "./map";
import { resolveMarker } from "./marker";
import { genResource } from "./resource";

import type { AccountConfig, AccountDetail } from "./account";
import type { Donate } from "./donate";
import type { PEConfig } from "./peScore";
import type { MarkerOption } from "./marker";
import type { ComponentOptions, PageConfig } from "../components/typings";

// 删除旧的文件
del([
  "./r/function/**",
  "./r/guide/**",
  "./r/intro/**",
  "./r/icon/**",
  "./r/other/**",
]);

// 生成对应的 JSON

// 功能大厅
convertYml2Json("./res/function", "./r/function", (data, filePath) =>
  /map\/marker\/(benbu|jingyue)/u.exec(filePath)
    ? resolveMarker(data as MarkerOption)
    : /map\/(benbu|jingyue)\//u.exec(filePath)
    ? resolveLocationPage(data as PageConfig & { photo?: string[] }, filePath)
    : /PEcal\/(male|female)-(low|high)/u.exec(filePath)
    ? genPEScore(data as PEConfig)
    : /account\/(qq|wx)/u.exec(filePath)
    ? checkAccount(data as AccountConfig[], filePath)
    : /account\//u.exec(filePath)
    ? checkAccountDetail(data as AccountDetail, filePath)
    : (data as unknown)
);

/** 差异列表 */
const diffResult = execSync("git status -s").toString();

// 东师介绍
convertYml2Json("./res/intro", "./r/intro", (data, filePath) =>
  resolvePage(data as PageConfig, `intro/${filePath}`, diffResult)
);

// 东师指南
convertYml2Json("./res/guide", "./r/guide", (data, filePath) =>
  resolvePage(data as PageConfig, `guide/${filePath}`, diffResult)
);

// 其他文件
convertYml2Json("./res/other", "./r/other", (data, filePath) =>
  resolvePage(data as PageConfig, `other/${filePath}`, diffResult)
);

// 生成转码后的图标
genIcon();

// 生成搜索索引
genSearchMap();

// 生成歌词
genLyric();

// 生成捐赠

// 捐赠
convertYml2Json("./res/config/donate", "./r/other/donate", (data, filePath) =>
  genDonate(data as Donate, filePath)
);

// 生成 Sitemap
// genSitemap();
count();

// 重新生成 guide
convertYml2Json("./res/other/guide", "./r/other/guide", (data, filePath) =>
  resolvePage(data as PageConfig, filePath)
);

// 生成 tab 页
convertYml2Json("./res/config", "./r/config", (data, filePath) =>
  /(function|guide|intro|main|user)/u.exec(filePath)
    ? resolvePage(data as PageConfig, filePath)
    : /(about|log)/u.exec(filePath)
    ? (data as ComponentOptions[]).map((element) => {
        const { tag } = element;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete element.tag;

        return [tag, element];
      })
    : (data as unknown)
);

// 生成资源
genResource();

// 生成二维码
genQRCode().then(() => {
  console.log("All completed");
});
