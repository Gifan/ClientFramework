import { BaseSdk, VideoAdCode } from "../BaseSdk";
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
let jsbCall = window["jsb"] && jsb.reflection ? jsb.reflection.callStaticMethod : () => { };
export default class IOSSdk extends BaseSdk {
    private onPlayEnd: Function;
    public init(appId: string) {
        super.init(appId);
    }
    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void): void {
        jsbCall("AppController", "showBannerAds");
    }
    public hideBanner(): void {
        console.log('[IosAdCtrler][hideBannerAd]');
        jsbCall("AppController", "hiddenBanner");
    }
    public destroyBanner(): void {
        console.log('[IosAdCtrler][destoryBannerAd]');
        jsbCall("AppController", "hiddenBanner");
    }
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        console.log('[IosAdCtrler][showVideoAD]', adId)
        this.onPlayEnd = onPlayEnd;
        window["iOSSendMsg"] = this.rewardCallBack.bind(this);
        jsbCall("AppController", "showAds");
    }
    public sendEvent(key: string, param: any): void {

    }

    public showInsertAd(adId: string) {
        console.log('[IosAdCtrler][showInsertAd]', adId);
        this.onPlayEnd = null;
        window["iOSSendMsg"] = this.insertCallBack.bind(this);
        jsbCall("AppController", "fullscreenAds");
    }
    public share(type: import("../BaseSdk").ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {

    }

    public rewardCallBack(e) {
        console.log('[IosAdCtrler][rewardCallBack][e]', e)
        if (e == 'playAds') {
            console.log('[IosAdCtrler][rewardCallBack][playAds] 开始播放激励视频')
            SdkAudioAdapter.pauseMusic();
        }
        if (e == 'playAdsEnd') {
            console.log('[IosAdCtrler][rewardCallBack][playAds] 结束播放激励视频')
            SdkAudioAdapter.resumeMusic();
            // window["iOSSendMsg"] = () => { };
        }
        if (e == 'unityAds1') {
            console.log('[IosAdCtrler][rewardCallBack][playAds] 用户看完激励视频')
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.COMPLETE, "");
            window["iOSSendMsg"] = () => { };
        }
        if (e == 'unityAds0') {
            console.log('[IosAdCtrler][rewardCallBack][playAds] 用户没有看完激励视频')
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
            window["iOSSendMsg"] = () => { };
        }

    }

    insertCallBack(e) {
        if (e == 'playAds') {
            console.log('[IosAdCtrler][insertCallBack][playAds] 开始播放插屏广告')
            SdkAudioAdapter.pauseMusic();
        }
        if (e == 'playAdsEnd') {
            console.log('[IosAdCtrler][insertCallBack][playAds] 结束播放插屏广告')
            SdkAudioAdapter.resumeMusic();
            window["iOSSendMsg"] = () => { };
        }
    };

}
