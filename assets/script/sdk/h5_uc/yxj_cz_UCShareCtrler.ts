import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";
declare var uc:any;
export default class H5_UCShareCtrler implements IShareCtrler {
    constructor() {  }

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, pos?: string, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, posOrCpl?: string | { (rsl: ShareResult): void }, onCpl?: (rsl: ShareResult) => void): void {
        uc.shareAppMessage({
            title: shareInfo.title,
            imageUrl: shareInfo.imageUrl, // 图 片 URL
            query: shareInfo.query,	// 查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 uc.getLaunchOptionsSync() 获取启动参  数中的 query。
            target: 'wechat',	// wechat:微信好友，qq: qq好友，不设置的话会调起分享面板
            success: res => {
                console.log('shareAppMessage share success', JSON.stringify(res));
            },
            fail: err => {
                console.log('shareAppMessage share fail', JSON.stringify(err));
            }
        })
    }
}