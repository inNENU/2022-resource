import type { BaseComponentConfig } from "../common";

export interface CopyComponentConfig extends BaseComponentConfig {
  tag: "copy";
  /** 标题 */
  header?: string;
  /** 复制文字 */
  text: string;
}
