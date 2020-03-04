import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
let common = require('zqddn_zhb_Common');
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
const ua = window.navigator.userAgent;
const isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // IOS终端
declare var qg:any;
export default class H5_XiaoMiAdCtrler implements IADCtrler {

    rewardedVideoAd:any = null;

    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[H5_XiaoMiAdCtrler][constructor]", idDict);
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
        console.log("[H5_XiaoMiAdCtrler][showVideoAD]", type);
        if (!qg.createRewardedVideoAd)
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新小米版本", VideoADFailCode.NOT_SUPPORT);

        let adUnitId = this.idDict[type];
        this.onPlayEnd = onPlayEnd;
        if (!adUnitId) adUnitId = this.idDict["defaultv"];
        if (!adUnitId) return this.onPlayEnd && this.onPlayEnd("未知广告类型v:" + type, VideoADFailCode.UNKNOW_TYPE);


        if(!this.rewardedVideoAd){
            this.rewardedVideoAd = qg.createRewardedVideoAd({
                adUnitId: adUnitId
            });
            this.rewardedVideoAd.onClose((res) => {
                console.log('res-------', res);
                let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
                // sound_manager.resume_music();
                setTimeout(()=>{
                    this.onPlayEnd && this.onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
                },300);
            });
        }
        
        // rewardedVideoAd.show((res) => {
        //     console.log('res---show----', res);
        // })
        
        this.rewardedVideoAd.load().then(() => {
            this.rewardedVideoAd.show();
            // sound_manager.pause_music();
        }).catch(e => {
            console.error("[XiaoMiAdCtrler][showVideoAD] error", e);
            this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });

    }

    //#endregion [video]

    //#region [banner]

    showInsertAd(type: string) {
        if (!qg.createInterstitialAd) return console.log("不支持插屏广告，请更新小米版本");
        let adUnitId = this.idDict[type];
        console.log(adUnitId, 'adUnitId')
        var interstitialAd = qg.createInterstitialAd({
            adUnitId: adUnitId
        });
        console.log('开始加载插屏广告')
        interstitialAd.onLoad(()=>{
            interstitialAd.show();
            console.log('加载完成,展现插屏广告')
            interstitialAd.offLoad();
        });

        interstitialAd.onError((err)=>{
            console.log('插屏出错',err)
            interstitialAd.offError();
        });
        
    }

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        if (common.isAuditing === 1) return;
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        if (common.isAuditing === 1) return;
    }
    hideBannerAd() {

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