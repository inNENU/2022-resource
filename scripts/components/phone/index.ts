import { PhoneComponentOptions } from "./typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolvePhone = (
  element: PhoneComponentOptions,
  location = ""
): void => {
  for (const key in element)
    if (typeof element[key as keyof PhoneComponentOptions] === "number")
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line
      element[key] = element[key].toString();

  checkKeys(
    element,
    {
      tag: "string",
      num: "string",
      fName: "string",
      header: ["string", "undefined"],
      lName: ["string", "undefined"],
      org: ["string", "undefined"],
      remark: ["string", "undefined"],
      workNum: ["string", "undefined"],
      nick: ["string", "undefined"],
      site: ["string", "undefined"],
      wechat: ["string", "undefined"],
      province: ["string", "undefined"],
      city: ["string", "undefined"],
      street: ["string", "undefined"],
      postCode: ["string", "undefined"],
      title: ["string", "undefined"],
      hostNum: ["string", "undefined"],
      mail: ["string", "undefined"],
      homeNum: ["string", "undefined"],
      avatar: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
