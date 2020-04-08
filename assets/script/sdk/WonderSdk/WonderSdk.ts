import { EPlatform, SdkClass, AppIdList, BannerIdList, InsterIdList, SplashIdList, FeedAdIdList, BMSInfoList, VideoIdList, FullVideoIdList} from "./config/SdkConfig";
import { BaseSdk, VideoAdCode } from "./platform/BaseSdk";
import { SdkAudioAdapter, AudioInterface } from "./adapter/AudioAdapter";
import { SdkSelectAlertAdapter, SelectAlertInterface } from "./adapter/SelectAlertAdapter";
import { BaseNet, BaseUrl, Url } from "./net/BaseNet";
declare let require: (str: string) => any;
declare let window: any;
export class WonderSdk {
    public static isInit: boolean = false;
    private static _instance: WonderSdk;
    private static _version: string = "1.0.0";
    private _sdk!: BaseSdk;
    private _platformId: EPlatform;
    private _isShiledIp: number = 0;
    private _bannerTime: number = 0;//banner刷新时间
    public VideoAdCode:VideoAdCode = <any>VideoAdCode;
    public isTest:boolean = false;
    /**
     * @description 初始化sdk接口，所以接口调用前必须调用init方法
     * @author 吴建奋
     * @date 2020-04-05
     * @static
     * @param {EPlatform} platformId 平台id
     * @param {boolean} [isTest=false] 预留
     * @returns
     * @memberof WonderSdk
     */
    public static init(platformId: EPlatform, isTest: boolean = false) {
        if (WonderSdk.isInit) { console.warn("Sdk is initialized. do not init again") };
        WonderSdk._instance = new WonderSdk(platformId);
        WonderSdk._instance.isTest = isTest;
        return WonderSdk.isInit;
    }
    private constructor(platformId: EPlatform) {
        this._platformId = platformId;
        let sdkclass = SdkClass[this._platformId];
        window["wonderSdk"] = this;
        if (sdkclass) {
            WonderSdk.isInit = true;
            let mod = require(sdkclass);
            if (mod[sdkclass]) {
                this._sdk = new mod[sdkclass]();
            } else {
                this._sdk = new mod.default();
            }
            let appid = AppIdList[this._platformId];
            this._sdk.init(appid);
        } else {
            console.error(`Can't find the SdkClass = ${platformId}. Sdk init fail please confirm!`);
            WonderSdk.isInit = false;
        }
    }

    /**
     * @description 实例版本获取版本sdk
     * @readonly
     * @memberof WonderSdk
     */
    public get sdkVersion() {
        return WonderSdk._version;
    }

    /**
     * 判断是否是原生平台
     */
    public get isNative(): boolean {
        return this._platformId == EPlatform.NA_ANDROID || this._platformId == EPlatform.NA_IOS;
    }

    /**
     * @description 使用外部音效管理器
     * @author 吴建奋
     * @date 2020-04-05
     * @static
     * @param {AudioInterface} audioInterface
     * @memberof WonderSdk
     */
    public setAudioAdapter(audioInterface: AudioInterface) {
        SdkAudioAdapter.setAdapter(audioInterface);
    }

    /**
     * @description 使用外部弹窗
     * @author 吴建奋
     * @date 2020-04-05
     * @param {SelectAlertInterface} alertInterface
     * @memberof WonderSdk
     */
    public setAlertAdpater(alertInterface: SelectAlertInterface) {
        SdkSelectAlertAdapter.setAdapter(alertInterface);
    }

    /**
     * @description 请求登录
     * @author 吴建奋
     * @date 2020-04-05
     * @param {(data: any) => void} [success] 登录成功回调
     * @param {(errmsg) => void} [fail] 登录失败回调
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return this._sdk.login(success, fail);
    }

    public showBanner(adId: number, onShow?: () => void): void;
    public showBanner(adId: number, nodeInfo: { x: number, y: number, width: number, height: number }, onShow?: () => void): void;
    public showBanner(adId: number, style: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    }, onShow?: () => void): void;
    /**
     * @description
     * @author 吴建奋
     * @date 2020-04-05
     * @param {string} adId 广告id
     * @param {({
     *         width?: number,
     *         height?: number,
     *         left?: number,
     *         bottom?: number,
     *         top?: number,
     *     } | (() => void))} [style]
     * @param {() => void} [onShow]
     * @memberof WonderSdk
     */
    public showBanner(adId: number, args?: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    } | (() => void) | { x: number, y: number, width: number, height: number } | any, onShow?: () => void) {
        let adIdlist: any = BannerIdList[this._platformId];
        if (!adIdlist) {
            console.error("can't find this platform banner");
            return;
        }

        let nowTime = (new Date()).getTime();
        // console.log("[SdkMgr][showBannerAd]", (nowTime - this._bannerTime) / 1000, nowTime, this._bannerTime);
        if (this._bannerTime) {
            if (nowTime - this._bannerTime > 50 * 1000) {
                this.destroyBanner();
                this._bannerTime = nowTime;
                console.log('banner刷新')
            }
        } else {
            this._bannerTime = nowTime;
        }
        let adid = adIdlist[adId] || adIdlist[0];
        if (!args && onShow) {
            this._sdk.showBanner(adid, onShow);
        } else if (typeof args === "function") {
            this._sdk.showBanner(adid, onShow);
        }
        else if (args && typeof args.x === "number") {
            this._sdk.showBannerWithNode(adid, args, onShow);
        } else {
            this._sdk.showBannerWithStyle(adid, args, onShow);
        }
    }

    /**
     * @description 隐藏banner广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    public hideBanner() {
        this._sdk.hideBanner();
    }

    /**
     * @description 删除banner广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    public destroyBanner() {
        this._sdk.destroyBanner();
    }

    /**
     * @description 展示激励视频广告
     * @author 吴建奋
     * @date 2020-04-05
     * @param {number} adId 对应sdkConfig配置id
     * @param {(code: VideoAdCode, msg?: string) => void} [onPlayEnd] 播放回调
     * @returns
     * @memberof WonderSdk
     */
    public showVideoAD(adId: number, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        let adIdlist: any = VideoIdList[this._platformId];
        if (!adIdlist) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "没有对应广告id");
            return;
        }
        let id = adIdlist[adId] || adIdlist[0];
        this._sdk.showVideoAD(id, onPlayEnd);
    }

    /**
     * @description 展示全屏视频广告
     * @author 吴建奋
     * @date 2020-04-06
     * @param {number} adId 对应sdkConfig配置id
     * @param {(code: VideoAdCode, msg?: string) => void} [onPlayEnd] 播放回调
     * @returns
     * @memberof WonderSdk
     */
    public showFullVideoAD(adId:number, onPlayEnd?:(code: VideoAdCode, msg?: string) => void){
        let adIdlist: any = FullVideoIdList[this._platformId];
        if (!adIdlist) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "没有对应广告id");
            return;
        }
        let id = adIdlist;
        this._sdk.showFullVideoAD(id, onPlayEnd);
    }

    /**
     * @description 发送事件统计请求
     * @author 吴建奋
     * @date 2020-04-05
     * @param {string} key 事件key
     * @param {*} param 自定义参数
     * @memberof WonderSdk
     */
    public sendEvent(key: string, param: any) {
        this._sdk.sendEvent(key, param)
    }

    /**
     * @description 展示插屏广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    public showInsertAd() {
        let id = InsterIdList[this._platformId];
        if (id) {
            this._sdk.showInsertAd(id);
        }
    }

    /**
     * 展示开屏广告
     * @param adId 广告id
     */
    public showSplashAd() {
        let id = SplashIdList[this._platformId];
        if (id) {
            this._sdk.showSplashAd(id);
        }
    }

    /**
     * 展示信息流广告
     * @param style 广告样式
     */
    public showFeedAd(style: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    }) {
        let id = FeedAdIdList[this._platformId];
        if (id) {
            this._sdk.showFeedAd(id, style);
        }
    };//信息流

    /**
     * @description 隐藏信息流
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    public hideFeedAd() {
        this._sdk.hideFeedAd();
    };

    /**
     * @description 显示隐私政策
     * @author 吴建奋
     * @date 2020-04-05
     * @param {() => void} success 成功回调
     * @memberof WonderSdk
     */
    public showPrivacy(success: (boo:any) => void) {
        this._sdk.showPrivacy(success);
    }

    /**
     * @description 拉起分享
     * @author 吴建奋
     * @date 2020-04-05
     * @param {*} param 
     * @param {() => void} [success] 成功回调
     * @param {() => void} [fail] 失败回调
     * @memberof WonderSdk
     */
    public share(param: any, success?: () => void, fail?: () => void) {
        this._sdk.share(param, success, fail);
    }

    /**
     * @description 获取BMS对应唯一标识
     * @readonly
     * @memberof WonderSdk
     */
    public get BMS_APP_NAME() {
        return BMSInfoList[this._platformId].BMS_APP_NAME;
    }
    /**
     * @description 获取BMS版本
     * @readonly
     * @memberof WonderSdk
     */
    public get BMS_VERSION() {
        return BMSInfoList[this._platformId].BMS_VERSION;
    }
    /**
     * @description 请求是否为屏蔽IP地址
     * @author 吴建奋
     * @date 2020-04-05
     * @returns {Promise<boolean>}
     * @memberof WonderSdk
     */
    public requestShiledIp(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_IP_IS_ENABLE, { app_name: this.BMS_APP_NAME, version: this.BMS_VERSION }, "GET").then((data) => {
                this._isShiledIp = parseInt(data.data.is_enable);
                resolve(!!this._isShiledIp);
            }).catch(err => {
                reject(err);
            })
        });
    }

    /**
     * @description 请求获取开关配置
     * @author 吴建奋
     * @date 2020-04-05
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    public requestSwitchConfig(): Promise<any> {
        return BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_LAUNCH_CONFIG, { app_name: this.BMS_APP_NAME, version: this.BMS_VERSION }, "GET");
    }
}
