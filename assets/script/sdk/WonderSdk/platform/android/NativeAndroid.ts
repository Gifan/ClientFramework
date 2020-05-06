import { BaseSdk, VideoAdCode, ShareType } from "../BaseSdk";
declare let cc: any;
cc.nativeAndroid = cc.nativeAndroid || {};
let callAndroid = cc.nativeAndroid;
declare let window: any;
declare let jsb: any;
let jsbCall = window["jsb"] && jsb.reflection ? jsb.reflection.callStaticMethod : () => { };
export default class NativeAndroid extends BaseSdk {
    private defaultClass: string = "org/cocos2dx/javascript/AppActivity";
    private onbannerShow: () => void = () => { };
    public init(appId: string) {
        super.init(appId);
        callAndroid["bannerShow"] = () => {
            this.onbannerShow && this.onbannerShow();
        };
        callAndroid["bannerShowerr"] = () => {

        };
        callAndroid["videoClose"] = () => {
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
        };
        callAndroid["videoFinish"] = () => {
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.COMPLETE, "看完广告");
        };
        callAndroid["videoError"] = (msg: string) => {
            console.error("[WxAdCtrler][showVideoAD] error");
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
        };
        callAndroid["rewardVideoSuccess"] = () => {//成功展示激励视频
            // this.sendEvent("out_rewarde_count", null);
            this.onPlayEnd && this.onPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
        };

        callAndroid["fullVideoSuccess"] = () => {
            this.onFullPlayEnd && this.onFullPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
        }
        //隐私政策成功回调
        callAndroid["onPrivacyAccept"] = () => {
            this.sendEvent("confirm_privacy", "none");
            this._privacyCallback && this._privacyCallback(true);
        }
        callAndroid["onPrivacyReject"] = () => {
            this._privacyCallback && this._privacyCallback(false);
        }
    }
    public login(success?: (data: any) => void, fail?: (errmsg: any) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve();
        });
    }
    public showBannerWithNode(adId: string, node: { x: number, y: number, width: number, height: number }, onShow?: () => void) {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onShow?: () => void) {
        this.onbannerShow = <() => void>onShow;
        jsbCall(this.defaultClass, "addBanner", "(Ljava/lang/String;)V", adId);
    }
    public hideBanner() {
        jsbCall(this.defaultClass, "hideBanner", "()V");
    }
    public destroyBanner() {

    }
    private onPlayEnd!: (code: VideoAdCode, msg?: string) => void;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        this.onPlayEnd = <any>onPlayEnd;
        jsbCall(this.defaultClass, "showVideo", "(Ljava/lang/String;)V", adId);
    }
    private onFullPlayEnd!: (code: VideoAdCode, msg?: string) => void;
    public showFullVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        this.onFullPlayEnd = <any>onPlayEnd;
        jsbCall(this.defaultClass, "showFullVideo", "(Ljava/lang/String;)V", adId);
    }

    public sendEvent(key: string, param: any): void {
        jsbCall(this.defaultClass, "sendMsg", "(Ljava/lang/String;Ljava/lang/String;)V", key, param);
    }
    public vibrate(type: number = 0) {
        jsbCall(this.defaultClass, "vibrate", "(I)V", type == 0 ? 100 : 500);
    }
    public share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: any) => void) {

    }

    public showInsertAd(adId: string) {
        // jsbCall(this.defaultClass, "showInsert")
    }

    public showSplashAd(adId: string) {
        jsbCall(this.defaultClass, "showSplashAd", "(Ljava/lang/String;)V", adId);
    };

    private _privacyCallback!: (boo: any) => void;
    public showPrivacy(success: (boo: any) => void, fail?: (errmsg: string) => void) {
        this._privacyCallback = success;
        if (window["jsb"]) {
            jsbCall(this.defaultClass, "showPrivacy", "()V");
        } else {
            success && success(true);
        }
    }
}