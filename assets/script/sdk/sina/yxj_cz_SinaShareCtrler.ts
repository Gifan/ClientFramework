import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";

export default class SinaShareCtrler implements IShareCtrler {
    constructor() { }

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, pos?: string, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, posOrCpl?: string | { (rsl: ShareResult): void }, onCpl?: (rsl?: ShareResult) => void): void {
        wb.shareAppMessage({
            data: {
                title: shareInfo.title,
                url: "http://sng.sina.com.cn/gamecenter/game/tryplay/appkey/wbg_5d75c4dfbc0d7",
                query: shareInfo.query,	// 查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 uc.getLaunchOptionsSync() 获取启动参  数中的 query。
            },
            success: res => {
                console.log('shareAppMessage share success', JSON.stringify(res));
                onCpl && onCpl();
            },
            fail: err => {
                console.log('shareAppMessage share fail', JSON.stringify(err));
            }
        })
    }
}