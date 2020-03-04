import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";
declare var window:any;
export default class AndroidShareCtrler implements IShareCtrler {
    completeCpl:(rsl: ShareResult) => void
    realCB: { (rsl: ShareResult): void };
    constructor() {
        console.log("[AndroidShareCtrler][constructor]安卓分享sdk初始化");
        window.shareComplete = function () {
            console.log('[AndroidShareCtrler][shareComplete]安卓分享完成')
            this.completeCpl && this.completeCpl({iSuccess: true,});
        }.bind(this);
        window.shareUncomplete = function () {
            console.log('[AndroidShareCtrler][shareUncomplete] 安卓分享失败')
            this.completeCpl && this.completeCpl({iSuccess: false,});
        }.bind(this);
    }

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void; // 重载

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void {
        this.completeCpl = null;
        this.completeCpl = onCpl;
        console.log("shareInfo", shareInfo)
        console.log("onCpl", onCpl)

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "share", "(Ljava/lang/String;Ljava/lang/String;)V", shareInfo.title,shareInfo.imageUrl);
    }
}