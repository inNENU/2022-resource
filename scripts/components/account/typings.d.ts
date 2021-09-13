import type { BaseComponentOptions } from "../common";

export interface AccountComponentOptions extends BaseComponentOptions {
  tag: "account";

  /** 账户 Logo 地址 */
  logo: string;
  /** 账户名称 */
  name: string;
  /** 账户详情 */
  detail?: string;

  /** 账户描述 */
  desc?: string;
  /** 账户 QQ 号 */
  qq: number;
  /** 账户 微信号 */
  wx: string;
  /** 账户 QQ 二维码 */
  qrcode: string;
  /** 账户 QQ openid */
  openid?: string;
  /** 账户微信详情名称 */
  path?: string;
}
