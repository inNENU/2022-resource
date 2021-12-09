import type { BaseComponentOptions } from "../common";

export interface ActionComponentOptions extends BaseComponentOptions {
  tag: "action";

  /** 标题 */
  header?: string;

  /** 动作内容 */
  content: string;

  /** 复制文字 */
  text?: string;
}
