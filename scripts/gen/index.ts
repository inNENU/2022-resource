import { execSync } from "child_process";
import { sync as del } from "del";
import { convertYml2Json } from "../util/yml2json";
import { resolvePage } from "../components/page";
import { checkAccount } from "./account";
import { count } from "./count";
import { genDonate } from "./donate";
import { genIcon } from "./icon";
import { genLyric } from "./lyric";
import { genPEScore } from "./peScore";
import { genQRCode } from "./qrcode";
import { genSearchMap } from "./search";
import { resolveMarker } from "./marker";
import { genResource } from "./resource";

import type { AccountConfig } from "./account";
import type { Donate } from "./donate";
import type { PEConfig } from "./peScore";
import type { MarkerOption } from "./marker";
import type { PageConfig } from "../components/typings";

// 删除旧的文件
del([
  "./resource/function/**",
  "./resource/guide/**",
  "./resource/intro/**",
  "./resource/icon/**",
  "./resource/other/**",
]);

// 生成对应的 JSON

// 功能大厅
convertYml2Json("./res/function", "./resource/function", (data, filePath) =>
  /map\/marker\/(benbu|jingyue)/u.exec(filePath)
    ? resolveMarker(data as MarkerOption)
    : /map\/(benbu|jingyue)\//u.exec(filePath)
    ? resolvePage(data as PageConfig, filePath)
    : /PEcal\/(male|female)-(low|high)/u.exec(filePath)
    ? genPEScore(data as PEConfig)
    : /account\/(qq|wx)/u.exec(filePath)
    ? checkAccount(data as AccountConfig[])
    : (data as unknown)
);

/** 差异列表 */
const diffResult = execSync("git status -s").toString();

// 东师介绍
convertYml2Json("./res/intro", "./resource/intro", (data, filePath) =>
  resolvePage(data as PageConfig, `intro/${filePath}`, diffResult)
);

// 东师指南
convertYml2Json("./res/guide", "./resource/guide", (data, filePath) =>
  resolvePage(data as PageConfig, `guide/${filePath}`, diffResult)
);

// 其他文件
convertYml2Json("./res/other", "./resource/other", (data, filePath) =>
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
convertYml2Json(
  "./res/config/donate",
  "./resource/other/donate",
  (data, filePath) => genDonate(data as Donate, filePath)
);

// 生成 Sitemap
// genSitemap();
count();

// 重新生成 guide
convertYml2Json(
  "./res/other/guide",
  "./resource/other/guide",
  (data, filePath) => resolvePage(data as PageConfig, filePath)
);

// 生成 tab 页
convertYml2Json("./res/config", "./resource/config", (data, filePath) =>
  /(function|guide|intro|main|user)/u.exec(filePath)
    ? resolvePage(data as PageConfig, filePath)
    : (data as unknown)
);

// 生成资源
genResource();

// 生成二维码
genQRCode().then(() => {
  console.log("All completed");
});
