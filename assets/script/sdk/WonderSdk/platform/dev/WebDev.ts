import { BaseSdk, VideoAdCode, ShareType } from "../BaseSdk";
import { SdkSelectAlertAdapter } from "../../adapter/SelectAlertAdapter";

export default class WebDev extends BaseSdk {

    public share(type:ShareType, param: any, success?: () => void, fail?: (errmsg: any) => void) {
        let data = {
            title: "提示",
            desc: "模拟分享",
            confirmText: "分享成功",
            cancelText: "分享失败",
            confirm: () => { success && success(); },
            cancel: () => { fail && fail("分享失败") },
        }
        SdkSelectAlertAdapter.showAlert(data);
    }
    public login(success?: (data: any) => void, fail?: (errmsg: any) => void): Promise<any> {
        return new Promise((reslove, reject) => {
            success && success({});
            reslove({});
        })
    }

    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void) {

    }
    public showBannerWithNode(adId: string, node: { x: number, y: number, width: number, height: number }) {

    }
    public hideBanner() {

    }
    public destroyBanner() {

    }
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        let data = {
            title: "提示",
            desc: "假装看视频",
            confirmText: "看完",
            cancelText: "没看完",
            confirm: () => { onPlayEnd && onPlayEnd(VideoAdCode.COMPLETE) },
            cancel: () => { onPlayEnd && onPlayEnd(VideoAdCode.NOT_COMPLITE, "没有看完视频") },
        }
        SdkSelectAlertAdapter.showAlert(data);
    }
    public sendEvent(key: string, param: any): void {

    }



}