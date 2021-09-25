import type { BaseComponentOptions } from "../common";

export interface AccountComponentOptions extends BaseComponentOptions {
  tag: "account";
  /** 主体名称 */
  name: string;
  /** 图标地址 */
  logo: string;
  /** 账户详情 */
  detail?: string;
  /** 主体描述 */
  desc?: string;

  /** 账户 QQ 号 */
  qq?: number;
  /** 账户 微信号 */
  wx?: string;
  /** 账户 QQ 二维码 */
  qqQRCode?: string;
  /** 账户 QQ openid */
  openid?: string;
  /** 账户 微信二维码 */
  wxQRCode?: string;
  /** 账户微信详情名称 */
  path?: string;
}
