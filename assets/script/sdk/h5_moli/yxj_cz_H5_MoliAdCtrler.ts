import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
declare var window:any;
export default class H5_MoliAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    /** Android 广告控制器的初始化流程 */
    constructor(protected pid: { [type: string]: string }) {
        console.log("初始化魔力广告sdk客户端方法")
        window.callbackCanShowAds = (data) => {
            console.log('广告请求播放', data)
            if (data == true) {
                window["ClientNative"] && window.ClientNative.showAdsWithScene("money001");
            }
            if (data == false) {
                console.log('魔力游戏视频广告填充率不足');
                this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
            }
        };
        window.callbackAdsWithScene = (data) => {
            console.log('广告回调播放', data)
            if (data == 'REWARD') {
                this.onPlayEnd && this.onPlayEnd && this.onPlayEnd();
            }
            if (data == 'FAIL') {
                console.log('魔力游戏视频广告填充率不足');
                this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
            }
        };
    }

    setBid(bid: string) {

    }
    canShowVideoAD() {
        return fw.bb.bms_launchConfig.value.questionVideo === 1;
    }

    canShowBanner() {
        return fw.bb.bms_launchConfig.value.isAuditing === 0;
    }


    //#region [video]

    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        // if (!this.canShowVideoAD()) return fw.ui.showToast("该功能暂未开放")
        this.onPlayEnd = null;
        this.onPlayEnd = onPlayEnd;
        console.log('魔力游戏视频开始播放', window.ClientNative.showAdsWithScene);
        console.log("window.callbackAdsWithScene", window.callbackAdsWithScene);
        window.ClientNative.showAdsWithScene("money001");
    }

    //#endregion [video]

    //#region [banner]

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        console.log('[H5_MoliAdCtrler][showBannerAd_withNode] 展示广告条')
        onShow && onShow();
        if (!this.canShowBanner()) return;
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        console.log('[H5_MoliAdCtrler][showBannerAd_withStyle] 展示广告条')
        onShow && onShow();
        if (!this.canShowBanner()) return;
    }
    hideBannerAd() {
        console.log("魔力游戏没有广告条可关闭")
    }

    destoryBannerAd() { /* 留待实现 */ }
    createBannerAd(type?: string, style?: BannerADStyle, args?: any): AndroidBanner { return new AndroidBanner(type, style, args); }

    //#endregion [banner]
}
class AndroidBanner implements IBanner {
    /** Banner 广告对象的初始化流程 */
    constructor(type?: string, style?: BannerADStyle, args?: any) { /* 留待扩展 */ }
    /** 指示广告是否到达可以展示的状态(如加载/出错等导致) */
    canShow: boolean;
    /** 展示此广告 */
    show() { /* 留待实现 */ }
    /** 隐藏此广告 */
    hide() { /* 留待实现 */ }
    /** 删除此广告 */
    dispose() { /* 留待实现 */ }
    /** 此广告的加载完成回调 */
    onLoad(cb: () => void) { /* 留待实现 */ }
    /** 此广告的异常回调 */
    onError(cb: (e: Error) => void) { /* 留待实现 */ }
}