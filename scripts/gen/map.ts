import { resolvePage } from "../components/page";
import { aliasResolve } from "../components/utils";

import type { PageConfig, PageOptions } from "../components/typings";

export const resolveLocationPage = (
  data: PageConfig & { photo?: string[] },
  filePath: string
): PageOptions & { photo?: string[] } => {
  if (data.photo)
    data.photo = data.photo.map((link, index) =>
      // `$` alias resolve and file check
      aliasResolve(link, "Image", `${filePath}.photos[${index}]`)
    );

  return resolvePage(data, filePath);
};
