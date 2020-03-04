import { ProjectConst } from "../../config/yxj_gjj_projectConst";
import IADCtrler ,{ BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
// 穿山甲广告appid
let ttad_appid = ProjectConst.AppConst.TTAD_APPID;
export default class AndroidAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    videoPlayTimes = 0;
    vids: { [type: string]: string } = {};
    /** Android 广告控制器的初始化流程 */
    constructor(protected idDict: { [type: string]: string }) {
        ;
        window["bannerShow"] = () => {
            console.log('[AndroidAdCtrler][bannerShow] 广告条展示的瞬间，执行回调')
            this.onbannerShow && this.onbannerShow();
        };
        window["bannerShow_err"] = () => {
            console.log('[AndroidAdCtrler][bannerShow_err] 广告条展示失败，执行回调')
            this.onbannerShow && this.onbannerShow();
        };

        window["videoUnfinish"] = () => {
            console.log('[AndroidAdCtrler][videoUnfinish] 中途广告')
            this.onPlayEnd && this.onPlayEnd('未完整观看广告', VideoADFailCode.NOT_COMPLITE)
        };
        window["videoFinish"] = () => {
            console.log('[AndroidAdCtrler][videoFinish] 看完广告')
            this.onPlayEnd && this.onPlayEnd()
        };
        window["clickBanner"] = () => {
            console.log("点击广告了！！！！！！！！！！！！！！！！")
        };
        window["videoError"] = () => {
            console.error("[WxAdCtrler][showVideoAD] error");
            this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        };

        window["insetVideoSuccess"] = () => {//成功展示插屏广告
            this.subEvent(cst.AppConst.PROJECT_CODE + "_out_video_count");
        };

        window["rewardVideoSuccess"] = () => {//成功展示激励视频
            this.videoPlayTimes++;
            if (this.videoPlayTimes > 3) this.videoPlayTimes = 0;
            this.subEvent(cst.AppConst.PROJECT_CODE + "_out_rewarde_count");
        };
    }
    setBid(bid: string) {

    }
    canShowVideoAD() {

    }

    canShowBanner() {

    }

    //#region [video]

    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        this.onPlayEnd = null;
        this.onPlayEnd = onPlayEnd;
        let pid;
        console.log("[AndroidAdCtrler][showVideoAD]", this.videoPlayTimes)
        pid = this.idDict[type];
        console.log("Videopid", pid)
        if (!pid)
            pid = this.idDict["default"];
        this.subEvent(cst.AppConst.PROJECT_CODE + "_ad_success_rewarde_count");
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showVideo", "(Ljava/lang/String;)V", pid)

    }


    //#endregion [video]

    //#region [banner]

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        console.log('[AndroidAdCtrler][showBannerAd_withNode] 展示广告条')
        let pid = this.idDict[type];
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addBanner", "(Ljava/lang/String;)V", pid)
        this.onbannerShow = onShow;
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        console.log('[AndroidAdCtrler][showBannerAd_withStyle] 展示广告条')
        let pid = this.idDict[type];
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addBanner", "(Ljava/lang/String;)V", pid)
        this.onbannerShow = onShow;
    }

    showInsertAd(type: string) {
        console.log('[AndroidAdCtrler][showInsertAd]', type)
        let pid = this.idDict[type];
        this.onPlayEnd = null;
        this.subEvent(cst.AppConst.PROJECT_CODE + "_ad_success_video_count");
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInsertBanner", "(Ljava/lang/String;)V", pid)
    }

    showSplashAd(type: string) {
        console.log('[AndroidAdCtrler][showSplashAd]', type)
        let pid = this.idDict[type];
        if (!pid) return console.log('[AndroidAdCtrler][showSplashAd]没有开屏id不展示');
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showSplashAd", "(Ljava/lang/String;)V", pid)
    }

    hideBannerAd() {
        console.log('[AndroidAdCtrler][hideBannerAd] 隐藏广告条')
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideBanner", "()V")
    }

    subEvent(str) {
        console.log("subEvent", str);
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendMsg", "(Ljava/lang/String;Ljava/lang/String;)V", str);
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