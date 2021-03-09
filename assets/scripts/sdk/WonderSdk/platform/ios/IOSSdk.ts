import { BaseSdk, VideoAdCode } from "../BaseSdk";
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
declare let cc: any;
cc.nativeIOS = cc.nativeIOS || {};
let callIOS = cc.nativeIOS;
let jsbCall: any = window["jsb"] && jsb.reflection ? jsb.reflection.callStaticMethod : () => { };
export default class IOSSdk extends BaseSdk {
    private onPlayEnd: Function;
    private _showBannerNum: number = 0;
    private onbannerShow: () => void = () => { };
    public init(appId: string) {
        super.init(appId);

        window['iOSSendMsg'] = (msg: string) => {
            switch (msg) {
                case 'startPlayRewardAds': {
                    SdkAudioAdapter.pauseMusic();
                    this.onPlayEnd && this.onPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
                    break;
                }
                case 'startPlayFullScreenAds': {
                    SdkAudioAdapter.pauseMusic();
                    this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
                    break;
                }
                case 'unityAds0': {
                    this.onPlayEnd && this.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
                    break;
                }
                case 'unityAds1': {
                    this.onPlayEnd && this.onPlayEnd(VideoAdCode.COMPLETE, "看完广告");
                    break;
                }
                case 'playRewardAdsEnd': {
                    SdkAudioAdapter.resumeMusic();
                    break;
                }
                case 'playFullScreenAdsEnd': {
                    SdkAudioAdapter.resumeMusic();
                    console.log("全屏视频jieshu");
                    this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.COMPLETE, "");
                    break;
                }
                case 'playRewardAdsError': {
                    SdkAudioAdapter.resumeMusic();
                    this.onPlayEnd && this.onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
                    break;
                }
                case 'playFullScreenAdsError': {
                    SdkAudioAdapter.resumeMusic();
                    console.log("全屏视频错误");
                    this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.AD_ERROR, "");
                    break;
                }
            }
        };

        // callIOS["bannerShow"] = () => {
        //     this.onbannerShow && this.onbannerShow();
        // };
        // callIOS["bannerShowerr"] = () => {

        // };
        // callIOS["videoClose"] = () => {
        //     this.onPlayEnd && this.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
        // };
        // callIOS["videoFinish"] = () => {
        //     this.onPlayEnd && this.onPlayEnd(VideoAdCode.COMPLETE, "看完广告");
        // };
        // callIOS["videoError"] = (msg: string) => {
        //     console.error("[WxAdCtrler][showVideoAD] error");
        //     this.onPlayEnd && this.onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
        // };
        // callIOS["rewardVideoSuccess"] = () => {//成功展示激励视频
        //     // this.sendEvent("out_rewarde_count", null);
        //     this.onPlayEnd && this.onPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
        // };

        // callIOS["fullVideoSuccess"] = () => {
        //     this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
        // };
        // callIOS["fullVideoHide"] = () => {
        //     this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.COMPLETE, "");
        // };
        // callIOS["fullVideoError"] = () => {
        //     this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.AD_ERROR, "");
        // };
        //隐私政策成功回调
        // callIOS["onPrivacyAccept"] = () => {
        //     this.sendEvent("confirm_privacy", "none");
        //     this._privacyCallback && this._privacyCallback(true);
        // }
        // callIOS["onPrivacyReject"] = () => {
        //     this._privacyCallback && this._privacyCallback(false);
        // }
    }
    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve(null);
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void): void {
        // this._showBannerNum++;
        // jsbCall("AppController", "showBanner");
        this.onbannerShow = <() => void>onshow;
    }
    public hideBanner(): void {
        // this._showBannerNum--;
        // if (this._showBannerNum <= 0) {
        //     this._showBannerNum = 0;
        //     console.log('[IosAdCtrler][hideBannerAd]');
        //     jsbCall("AppController", "hiddenBanner");
        // }
    }
    public destroyBanner(): void {
        console.log('[IosAdCtrler][destoryBannerAd]');
        // jsbCall("AppController", "hiddenBanner");
    }
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        console.log('[IosAdCtrler][showVideoAD]', adId)
        this.onPlayEnd = onPlayEnd;
        jsbCall("AppController", "showAds");
    }
    public sendEvent(key: string, param: any): void {
        let realkey = key;
        let subkey = "";
        if (param == null || param == "" || param == "none") {
        } else {
            if (typeof param == "object" && param.stage) {
                if (param.stage > 50) return;
                realkey += param.stage + "";
            }
        }
        jsbCall("AppController", "customTrackerWithName:andDictString:", realkey, subkey);
    }
    private onFullPlayEnd!: (code: VideoAdCode, msg?: string) => void;
    public showFullVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        this.onFullPlayEnd = <any>onPlayEnd;
        console.log("调用茶品");
        jsbCall("AppController", "fullscreenAds");
    }
    public share(type: import("../BaseSdk").ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {

    }

    public showFeedAd(adId: string, style: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    }) {
        console.log('[IosAdCtrler][showFeedAd]')
        // jsbCall("AppController", "showFeedAd");
    }

    // public rewardCallBack(e) {
    //     console.log('[IosAdCtrler][rewardCallBack][e]', e)
    //     if (e == 'playAds') {
    //         console.log('## ios playAds');
    //         SdkAudioAdapter.pauseMusic();
    //     }
    //     if (e == 'playAdsEnd' || e == 'unityAds1' || e == 'unityAds0') {
    //         console.log('[IosAdCtrler][rewardCallBack][playAds] 结束播放激励视频')
    //         SdkAudioAdapter.resumeMusic();
    //     }
    //     if (e == 'unityAds1') {
    //         console.log('[IosAdCtrler][rewardCallBack][playAds] 用户看完激励视频')
    //         this.onPlayEnd && this.onPlayEnd(VideoAdCode.COMPLETE, "");
    //     }
    //     if (e == 'unityAds0') {
    //         console.log('[IosAdCtrler][rewardCallBack][playAds] 用户没有看完激励视频')
    //         this.onPlayEnd && this.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
    //     }

    // }

    // insertCallBack(e) {
    //     if (e == 'playAds') {
    //         console.log('[IosAdCtrler][insertCallBack][playAds] 开始播放插屏广告')
    //         SdkAudioAdapter.pauseMusic();
    //     }
    //     if (e == 'playAdsEnd') {
    //         console.log('[IosAdCtrler][insertCallBack][playAds] 结束播放插屏广告')
    //         SdkAudioAdapter.resumeMusic();
    //         window["iOSSendMsg"] = () => { };
    //     }
    // };
    public vibrate(type: number = 0) {
        jsbCall("AppController", "vibrate:", type);
    }
    public goRate(path?: string): void {
        let gopath = path ? path : "";
        console.log("脚本调用goRate");
        jsbCall("AppController", "onCommentBtn");
    }

    public showDebugAdView(): void {
        console.log("脚本调用showDebugger");
        jsbCall("AppController", "showDebugger");
    }
}
