import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";

export default class IosShareCtrler implements IShareCtrler {

    realCB: { (rsl: ShareResult): void };
    constructor() {
        cc.game.on('share1', () => {
            console.log('[ios]分享成功');
            this.realCB && this.realCB({ iSuccess: true, });
        })
        cc.game.on('share0', () => {
            console.log('[ios]分享失败');
            this.realCB && this.realCB({ iSuccess: false, });
        })
    }

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void; // 重载
    share(shareInfo: ShareInfo, pos?: string, onCpl?: (rsl: ShareResult) => void): void; // 重载
    share(shareInfo: ShareInfo, posOrCpl?: string | { (rsl: ShareResult): void }, onCpl?: (rsl: ShareResult) => void): void {


        this.realCB = typeof posOrCpl === "string" ? onCpl : posOrCpl;
        console.log('[ios]开始分享',JSON.stringify(shareInfo))

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {//判断是否是源生平台并且是否是iOS平台 
            //调用APPController类中的Share方法，并且传递参数

            jsb.reflection.callStaticMethod("AppController", "iosShareWithTitle:",shareInfo.title);
        }
    }
}