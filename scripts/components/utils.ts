import { assertType } from "@mr-hope/assert-type";
import { existsSync } from "fs";
import { relative, resolve, sep } from "path";

export const camelCase2kebabCase = (str: string): string => {
  const hyphenateRE = /([^-])([A-Z])/gu;

  return str
    .replace(hyphenateRE, "$1-$2")
    .replace(hyphenateRE, "$1-$2")
    .toLowerCase();
};

export const resolvePath = (path: string): string =>
  relative(
    process.cwd(),
    resolve(
      path.replace(/\/\//u, "/").replace(/^\//u, "").replace(/\/$/u, "/index")
    )
  ).replaceAll(sep, "/");

/** 处理样式 */
export const resolveStyle = (styleObj: Record<string, string>): string => {
  assertType(styleObj, "Record<string,string>", "style");

  let result = "";

  for (const key in styleObj)
    result += `${camelCase2kebabCase(key)}:${styleObj[key]};`;

  return result;
};

export const aliasResolve = (link = "", type = "", location = ""): string => {
  if (typeof link === "string" && link.startsWith("$")) {
    const localePath = link.replace(/^\$/, "./");

    if (existsSync(localePath))
      return link.replace(/^\$/, "https://mp.innenu.com/");

    console.warn(`${type} ${localePath} not exist in ${location}`);
  }

  return link;
};
