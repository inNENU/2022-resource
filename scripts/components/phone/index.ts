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
      nickName: ["string", "undefined"],
      head: ["string", "undefined"],
      wechat: ["string", "undefined"],
      province: ["string", "undefined"],
      city: ["string", "undefined"],
      street: ["string", "undefined"],
      postCode: ["string", "undefined"],
      title: ["string", "undefined"],
      hostNum: ["string", "undefined"],
      website: ["string", "undefined"],
      email: ["string", "undefined"],
      homeNum: ["string", "undefined"],
      env: ["string[]", "undefined"],
    },
    location
  );
};
