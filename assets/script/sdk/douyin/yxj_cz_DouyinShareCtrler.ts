import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";

export default class DouyinShareCtrler implements IShareCtrler {
    constructor() {
        try {
            wx.showShareMenu && wx.showShareMenu();
        } catch (error) {

        }

    }

    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, pos?: string, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, posOrCpl?: string | { (rsl: ShareResult): void }, onCpl?: (rsl: ShareResult) => void): void {
        wx.shareAppMessage(shareInfo);
    }
}