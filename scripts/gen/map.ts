import { existsSync } from "fs";
import { resolvePage } from "../components/page";
import type { PageConfig } from "../components/typings";

export const resolveLocationPage = (
  data: PageConfig & { photo?: string[] },
  filePath: string
): PageConfig & { photo?: string[] } => {
  data.photo?.forEach((link, index) => {
    // `$img` alias resolve and file check
    if (link?.startsWith("$img/")) {
      const localePath = link.replace(/^\$img\//, "./img/");

      if (existsSync(localePath))
        (data.photo as string[])[index] = link.replace(
          /^\$img\//,
          "https://mp.innenu.com/img/"
        );
      else console.warn(`Image ${localePath} not exist in ${filePath}.photos`);
    }
  });

  return resolvePage(data, filePath);
};
