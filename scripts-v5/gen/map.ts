import { resolvePage } from "../components/page";
import { aliasResolve } from "../components/utils";

import type { PageOptions, PageConfig } from "../components/typings";

export const resolveLocationPage = (
  data: PageOptions & { photo?: string[] },
  filePath: string
): PageConfig & { photo?: string[] } => {
  data.photo?.forEach((link, index) => {
    // `$` alias resolve and file check
    (data.photo as string[])[index] = aliasResolve(
      link,
      "Image",
      `${filePath}.photos[${index}]`
    );
  });

  return resolvePage(data, filePath);
};
