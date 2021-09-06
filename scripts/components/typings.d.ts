import { CardComponentOptions } from "./card/typings";
import { CopyComponentOptions } from "./copy/typings";
import { DocComponentOptions } from "./doc/typings";
import { FooterComponentOptions } from "./footer/typings";
import { GridComponentOptions } from "./grid/typings";
import { ImageComponentOptions } from "./img/typings";
import { IntroComponentOptions } from "./intro/typings";
import {
  AdvancedListComponentOptions,
  ListComponentOptions,
} from "./list/typings";
import { LoadingComponentOptions } from "./loading/typings";
import { MediaComponentOptions } from "./media/typings";
import { PhoneComponentOptions } from "./phone/typings";
import { SwiperComponentOptions } from "./swiper/typings";
import { TextComponentOptions } from "./text/typings";
import { TitleComponentOptions } from "./title/typings";

import { GeneralScopeData } from "./scopeData/typings";

export * from "./card/typings";
export * from "./copy/typings";
export * from "./doc/typings";
export * from "./footer/typings";
export * from "./grid/typings";
export * from "./img/typings";
export * from "./intro/typings";
export * from "./list/typings";
export * from "./loading/typings";
export * from "./media/typings";
export * from "./phone/typings";
export * from "./swiper/typings";
export * from "./text/typings";
export * from "./title/typings";

export type PageTag =
  | "title"
  | "text"
  | "img"
  | "list"
  | "footer"
  | "grid"
  | "card"
  | "copy"
  | "intro"
  | "advanced-list"
  | "doc"
  | "phone"
  | "media"
  | "swiper";

export type ComponentOptions =
  | TitleComponentOptions
  | TextComponentOptions
  | ImageComponentOptions
  | ListComponentOptions
  | AdvancedListComponentOptions
  | GridComponentOptions
  | FooterComponentOptions
  | DocComponentOptions
  | PhoneComponentOptions
  | SwiperComponentOptions
  | MediaComponentOptions
  | CardComponentOptions
  | CopyComponentOptions
  | LoadingComponentOptions
  | IntroComponentOptions;

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  desc?: string;
  /** 页面作者 */
  author?: string;
  /** 页面最后更新时间 */
  time?: string;
  /** 页面标识 */
  id: string;
  /** 是否是灰色背景 */
  grey?: boolean;
  /** 页面内容 */
  content: ComponentOptions[];
  /** 页面图片 */
  images?: string[];
  /**
   * 是否可以使用小程序的界面分享
   *
   * @default false
   */
  shareable?: boolean;
  /**
   * 是否可以下载二维码
   *
   * @default true when shareable is true
   */
  qrcode?: string | boolean | boolean;
  /**
   * 是否在分享弹出菜单中显示联系客服
   *
   * @default true
   */
  contact?: boolean;
  /** 是否隐藏导航栏 */
  hidden?: boolean;
  /** 结构化数据 */
  scopeData?: GeneralScopeData;
}
