import type { BaseComponentOptions } from "../common";

export interface CopyComponentOptions extends BaseComponentOptions {
  tag: "copy";
  /** 标题 */
  header?: string;
  /** 复制文字 */
  text: string;
}
