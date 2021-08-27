import type { BaseComponentConfig } from "../common";

export interface IntroComponentConfig extends BaseComponentConfig {
  tag: "intro";
  /** 主体名称 */
  name: string;
  /** 图标地址 */
  logo: string;
  /** 主体描述 */
  desc?: string;
}
