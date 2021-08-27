export type ImageMode =
  | "widthFix"
  | "scaleToFill"
  | "aspectFit"
  | "aspectFill"
  | "top"
  | "bottom"
  | "center"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";

export interface BaseComponentConfig {
  /** 显示的环境 */
  env?: string[];
  /**
   * 是否隐藏
   *
   * @default false
   */
  hidden?: boolean;
}
