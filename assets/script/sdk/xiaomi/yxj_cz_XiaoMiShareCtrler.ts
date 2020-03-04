import IShareCtrler, { ShareResult, ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";

export default class H5_XiaoMiShareCtrler implements IShareCtrler {
    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void; // 重载
    share(shareInfo: ShareInfo, pos?: string, onCpl?: (rsl: ShareResult) => void): void; // 重载
    share() {
        console.log("现在暂时不能分享");
    }
}