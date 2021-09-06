import type { BaseComponentOptions } from "../common";

export interface IntroComponentOptions extends BaseComponentOptions {
  tag: "intro";
  /** 主体名称 */
  name: string;
  /** 图标地址 */
  logo: string;
  /** 主体描述 */
  desc?: string;
}
