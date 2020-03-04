import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
export default class H5_4399AdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    /** Android 广告控制器的初始化流程 */
    constructor(protected pid: { [type: string]: string }) {

    }

    setBid(bid: string) {

    }
    canShowVideoAD() {
        return fw.bb.bms_launchConfig.value.questionVideo === 1;
    }

    canShowBanner() {
        return fw.bb.bms_launchConfig.value.isAuditing === 0;
    }

    callback(obj) {
        console.log('代码:' + obj.code + ',消息:' + obj.message)
        if (obj.code === 10000) {
            console.log('4399视频开始播放')
        } else if (obj.code === 10001) {
            console.log('4399视频广告播放结束')
            this.onPlayEnd && this.onPlayEnd()
        } else {
            console.log('4399视频广告异常')
            this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        }
    }

    //#region [video]

    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        if (!this.canShowVideoAD()) return fw.ui.showToast("该功能暂未开放")
        this.onPlayEnd = null;
        this.onPlayEnd = onPlayEnd;
        window["h5api"] && window["h5api"].canPlayAd((data) => {
            console.log("是否可播放广告", data.canPlayAd, "剩余次数", data.remain)
            if (data.remain > 0) {
                window["h5api"].playAd(this.callback.bind(this));
            } else {
                console.log('4399视频广告次数播完了')
                this.onPlayEnd && this.onPlayEnd("今天的广告看完了，明天再来吧！", VideoADFailCode.AD_ERROR);
            }
        })
    }

    //#endregion [video]

    //#region [banner]

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        // if (!this.canShowBanner()) return
        // console.log('[AndroidAdCtrler][showBannerAd_withNode] 展示广告条')
        // let pid = this.pid[type];
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addBanner", "(Ljava/lang/String;)V", pid)

        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/MApplication", "onSubEvent", "(Ljava/lang/String;Ljava/lang/String;)V", "002", "bannerShow")
        // this.onbannerShow = onShow;
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        // console.log('[AndroidAdCtrler][showBannerAd_withStyle] 展示广告条')
        // let pid = this.pid[type];
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addBanner", "(Ljava/lang/String;)V", pid)
        // this.onbannerShow = onShow;
    }
    hideBannerAd() {
        // console.log('[AndroidAdCtrler][hideBannerAd] 隐藏广告条')
        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideBanner", "()V")
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