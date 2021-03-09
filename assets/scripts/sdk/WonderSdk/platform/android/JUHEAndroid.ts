import { BaseSdk, VideoAdCode, ShareType } from "../BaseSdk";
declare let cc: any;
cc.nativeAndroid = cc.nativeAndroid || {};
let callAndroid = cc.nativeAndroid;
declare let window: any;
declare let jsb: any;
let jsbCall = window["jsb"] && jsb.reflection ? jsb.reflection.callStaticMethod : () => { };
export default class JUHEAndroid extends BaseSdk {
    private defaultClass: string = "org/cocos2dx/javascript/AppActivity";
    private onbannerShow: () => void = () => { };
    private isGetReward: boolean = false;
    public init(appId: string) {
        super.init(appId);
        let self = this;
        let unionSdkCallback = {
            //激励视频播放完成
            onRewardVideoComplete: function () {
                console.log("onRewardVideoComplete");
                self.isGetReward = true;
            },
            //激励视频关闭
            onRewardVideoClose: function () {
                console.log("onRewardVideoClose", self.isGetReward);
                if (self.isGetReward) {
                    self.onPlayEnd && self.onPlayEnd(VideoAdCode.COMPLETE, "看完广告");
                } else {
                    self.onPlayEnd && self.onPlayEnd(VideoAdCode.NOT_COMPLITE, '未完整观看广告');
                }
            },
            onRewardVideoShow: function () {
                console.log("onRewardVideoShow");
                self.onPlayEnd && self.onPlayEnd(VideoAdCode.SHOW_SUCCESS, "");
            },
            //激励视频播放失败
            onRewardVideoFail: function () {
                console.log("onRewardVideoFail");
                self.onPlayEnd && self.onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
            },
            //插屏展示
            onInterstitialShow: function () {

            },
            //插屏跳过
            onInterstitialClose: function () {

            },
            onInterstitialShowFail: function () {

            },
            //信息流渲染成功
            onFeedRenderSuccess: function () {
            },
            //信息流渲染失败
            onFeedRenderFail: function () {

            },
            onSplashShow: function () {

            },
            onSplashClose: function () {

            },
            onPrivacyAccept: function () {

            },
            onPrivacyReject: function () {

            },
            onUnionSdkInitSuccess: function () {

            }
        };
        window["unionSdkCallback"] = unionSdkCallback;
        //隐私政策成功回调
        callAndroid["onPrivacyAccept"] = () => {
            // this.sendEvent("confirm_privacy", "none");
            this._privacyCallback && this._privacyCallback(true);
        }
        callAndroid["onPrivacyReject"] = () => {
            this._privacyCallback && this._privacyCallback(false);
        }
        // self.showSplashAd("");
    }
    public login(success?: (data: any) => void, fail?: (errmsg: any) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve(null);
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
        this.isGetReward = false;
        jsbCall(this.defaultClass, "showVideo", "(Ljava/lang/String;)V", adId);
    }
    private onFullPlayEnd!: (code: VideoAdCode, msg?: string) => void;
    public showFullVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        // jsbCall(this.defaultClass, "showFullVideo", "(Ljava/lang/String;)V", adId);
    }

    public sendEvent(key: string, param: any): void {
        let realkey = key;
        if (param == null || param == "" || param == "none") {
        } else {
            if (typeof param == "object") {
                if (param.stage) {
                    if (param.stage > 50) return;
                    let suffix = "";
                    if (param.stage < 10) suffix = "00";
                    else suffix = "0";
                    realkey += suffix + param.stage;
                }
            }
        }
        jsbCall(this.defaultClass, "sendMsg", "(Ljava/lang/String;Ljava/lang/String;)V", realkey, "");
    }
    public vibrate(type: number = 0) {
        jsbCall(this.defaultClass, "vibrate", "(I)V", type == 0 ? 100 : 300);
    }
    public share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: any) => void) {

    }

    public showInsertAd(adId: string) {
        // jsbCall(this.defaultClass, "showInsert")
        // jsbCall(this.defaultClass, "showFullVideo", "(Ljava/lang/String;)V", adId);
    }

    public showSplashAd(adId: string) {
        jsbCall(this.defaultClass, "showSplashAd", "(Ljava/lang/String;)V", adId);
    };

    private _privacyCallback!: (boo: any) => void;
    public showPrivacy(success: (boo: any) => void, fail?: (errmsg: string) => void) {
        // this._privacyCallback = success;
        // if (window["jsb"]) {
        //     jsbCall(this.defaultClass, "showPrivacy", "()V");
        // } else {
        success && success(true);

        // }
    }
}