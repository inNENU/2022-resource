import axios from "axios";
import { appIDInfo } from "../info";

export const getWechatAccessToken = (appid: string): Promise<string> =>
  axios
    .get<{ access_token: string }>(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appIDInfo[appid]}`
    )
    .then(({ data: { access_token } }) => access_token);
