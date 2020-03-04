import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
const ua = window.navigator.userAgent;
const isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // IOS终端
export default class H5_ZYAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    constructor(protected pid: { [type: string]: string }) {
        console.log('[H5_ZYAdCtrler][constructor] 初始化章鱼输入法广告sdk')
        window["bannerShow"] = (res) => {
            console.log('[H5_ZYAdCtrler][bannerShow] 广告条展示的瞬间，执行回调', res)

        };
        window["bannerHide"] = (res) => {
            console.log('[H5_ZYAdCtrler][bannerHide] 广告条关闭的瞬间，执行回调', res)

        };
        window["insertShow"] = (res) => {
            console.log('[H5_ZYAdCtrler][insertShow] 插屏图文或视频展示的瞬间，执行回调', res)

        };
        window["videoUnfinish"] = () => {
            console.log('[H5_ZYAdCtrler][videoUnfinish] 中途广告')
            this.onPlayEnd && this.onPlayEnd('未完整观看广告', VideoADFailCode.NOT_COMPLITE)
        };
        window["videoFinish"] = () => {
            console.log('[H5_ZYAdCtrler][videoFinish] 看完广告')
            this.onPlayEnd && this.onPlayEnd();
        };
        window["clickBanner"] = () => {
            console.log("点击广告了！！！！！！！！！！！！！！！！")
        };
        window["videoError"] = () => {
            console.error("[H5_ZYAdCtrler][showVideoAD] error");
            this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        };
        window["videoHandle"] = (e) => {
            let res = e;
            console.log('[H5_ZYAdCtrler][videoHandle]', res, JSON.parse(res).code, typeof (JSON.parse(res)), typeof (JSON.parse(res).code))
            if (!res) return;
            let c = JSON.parse(res).code;
            console.log("ccccc", c, typeof (c));
           
            switch (c) {
                case 0:
                    console.log('[H5_ZYAdCtrler][videoFinish] 看完广告')
                    this.onPlayEnd && this.onPlayEnd();
                    break;
                case 1:
                case 2:
                case 3:
                    console.error("[H5_ZYAdCtrler][showVideoAD] error");
                    this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
                    break;
            }
        }
    }

    clientInteraction(_json: object) {
        if (typeof _json !== 'object') {
            return console.error('参数不正确,请使用 json 格式参数');
        }
        //客户端调用方法
        if (isIos) {
            // 苹果
            window["webkit"].messageHandlers.sdkToNative_iOS.postMessage(_json);
        } else {
            // 安卓
            window["sdkToNative"].postMessage(JSON.stringify(_json));
        }
    };
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
        console.log('章鱼输入法视频开始尝试播放');
        let _obj = {
            method: "showRewardVideoAd",
            params: {
                "orientation": 0 //视频方向，0竖屏，1横屏，没传默认为竖屏

            },
            callback: "videoHandle"
        };
        this.clientInteraction(_obj);
    }

    //#endregion [video]

    //#region [banner]

    showInsertAd(type: string) {
        // if (!this.canShowBanner()) return;
        this.onPlayEnd = null;
        let method = Math.random() > .5 ? "showImageInteractionAd" : "showVideoInteractionAd";
        let _obj = {
            method: method,
            callback: "insertShow"
        };
        this.clientInteraction(_obj);
    }

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        console.log('[H5_ZYAdCtrler][showBannerAd_withNode] 展示广告条')
        onShow && onShow();
        let _obj = {
            method: "showBannerAd",
            callback: "bannerShow"
        };
        this.clientInteraction(_obj);
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        console.log('[H5_ZYAdCtrler][showBannerAd_withStyle] 展示广告条')
        onShow && onShow();
        // if (!this.canShowBanner()) return;
        let _obj = {
            method: "showBannerAd",
            callback: "bannerShow"
        };
        this.clientInteraction(_obj);
    }
    hideBannerAd() {
        // if (!this.canShowBanner()) return;
        let _obj = {
            method: "hideBannerAd",
            callback: "bannerHide"
        };
        this.clientInteraction(_obj);
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