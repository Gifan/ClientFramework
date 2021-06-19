export const enum BaseUrl {
    ServerDomain = "https://game.zuiqiangyingyu.net",
}
export const enum Url {
    /** [BMS配置] 获取初始化配置 */
    BMS_LAUNCH_CONFIG = "/common/config/info",
    /** [BMS配置] 获取分享内容配置 */
    BMS_SHARE_CONFIG = "/common/game/share_list",
    /** [BMS配置] 获取豆腐块(游戏跳转)内容配置 */
    BMS_TOFU_CONFIG = "/common/game/ads",
    /** [BMS] 微信登陆(辅助获取openid) */
    BMS_SIGN_IN_WX = "/common/session/sign_in",
    /** [BMS] 百度登陆(辅助获取openid) */
    BMS_SIGN_IN_BD = "/common/baidu/sign_in",
    /** [BMS] qq小游戏(辅助获取openid) */
    BMS_SIGN_IN_QQ = "/common/qqminiapp/sign_in",
    /** BMS 获取服务器时间 */
    BMS_SERVER_TIME = "/common/common/time",
    //分享卡片
    BMS_CARD_SHARE = "/common/share/hit",
    //获取分享卡片信息
    BMS_CARD_SHARE_INFO = '/common/share/info',
    /** [BMS统计] 主动分享 */
    BMS_SHARE_SHOW = "/statistics/share/show",
    /** [BMS统计] 从分享卡进入游戏 */
    BMS_LOGIN_LOG = "/statistics/login_log",
    /** [BMS统计] 关卡维度 */
    BMS_GAME = "/statistics/game",
    /** [BMS统计] 跳转广告展示 */
    BMS_AD_SHOW = "/statistics/ad/show",
    /** [BMS统计] 跳转广告点击 */
    BMS_AD_HIT = "/statistics/ad/hit",
    /** [BMS统计] 统计玩家获取提示次数以及所在关卡 */
    BMS_HINT = "/statistics/hint",

    /** [BMS] 查看用户是否处于广深地区 res.data.is_enable 0=广深, 1=非广深 */
    BMS_IP_IS_ENABLE = "/common/ip/is_enable",

    /** [BMS] 微信解密 */
    DECODE_DATA = "/common/wechat/decode_data",
}

export class BaseNet {
    public static Request(url: string, body: any, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS', repType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        let request!: Promise<any>;
        switch (method) {
            case 'GET':
                request = BaseNet.httpGet(url, body, repType);
                break;
            case 'POST':
                request = BaseNet.httpPost(url, body, repType);
                break;
            default:
                break;
        }
        return request;
    }

    public static httpGet(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            if (body) {
                let str = "?";
                for (let k in body) {
                    if (str != "?") {
                        str += "&";
                    }
                    str += `${k}=${body[k]}`;
                }
                url = url + str;
            }
            req.open('GET', url, true);
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (rspType == 'text') {
                            resolve(req.responseText)
                        } else if (rspType == 'json') {
                            resolve(JSON.parse(req.responseText));
                        } else {
                            resolve(req.response);
                        }
                    } else {
                        reject({ code: req.status, msg: req.statusText, data: {} });
                    }
                }
            }
            switch (rspType) {
                case 'json':
                    req.setRequestHeader('content-type', 'application/json')
                    break;
                case 'text':
                    req.setRequestHeader('content-type', 'text/plain')
                    break
            }
            // set reponse type ，如果是二进制，则最好是arraybuffer或者blob
            if (rspType == 'blob' || rspType == 'arraybuffer' || rspType == 'text') {
                req.responseType = rspType
            }
            req.timeout = 5000;
            req.ontimeout = () => {
                reject({ code: -1, msg: "网络异常，消息发送超时", data: {} });
            }
            req.onerror = () => {
                reject({ code: -1, msg: "网络异常，消息发送超时", data: {} });
            }
            req.send();
        });

    }
    static _EncodeFormData(data) {
        var pairs = [];
        var regexp = /%20/g;

        for (var name in data) {
            var value = data[name];
            var pair =
                encodeURIComponent(name).replace(regexp, "+")
                + "=" +
                encodeURIComponent(value).replace(regexp, "+");
            pairs.push(pair);
        }
        return pairs.join("&");
    }


    public static httpPost(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (rspType == 'text') {
                            resolve(req.responseText)
                        } else if (rspType == 'json') {
                            resolve(JSON.parse(req.responseText));
                        } else {
                            resolve(req.response);
                        }
                    } else {
                        reject({ code: req.status, msg: req.statusText, data: {} });
                    }
                }
            }
            req.setRequestHeader('content-type', "application/x-www-form-urlencoded");
            if (cc.sys.isNative)
                req.setRequestHeader("Accept-Encoding", "gzip,deflate");
            // switch (rspType) {
            //     case 'json':
            //         req.setRequestHeader('content-type', 'application/json')
            //         break;
            //     case 'text':
            //         req.setRequestHeader('content-type', 'text/plain')
            //     case 'urlenco':
            //         req.setRequestHeader('content-type', "application/x-www-form-urlencoded")
            //         break;
            // }
            // set reponse type ，如果是二进制，则最好是arraybuffer或者blob
            if (rspType == 'blob' || rspType == 'arraybuffer' || rspType == 'text') {
                req.responseType = rspType
            }
            let p;
            if (body) p = BaseNet._EncodeFormData(body);
            req.timeout = 5000;
            req.send(p);
        });
    }
}