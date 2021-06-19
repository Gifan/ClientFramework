import { EPlatform, SdkClass, AppIdList, BannerIdList, InsterIdList, SplashIdList, FeedAdIdList, BMSInfoList, VideoIdList, FullVideoIdList, BoxIdList } from "./config/SdkConfig";
import { BaseSdk, VideoAdCode, ShareType } from "./platform/BaseSdk";
import { SdkAudioAdapter, AudioInterface } from "./adapter/AudioAdapter";
import { SdkAlertAdapter, AlertInterface } from "./adapter/SelectAlertAdapter";
import { BaseNet, BaseUrl, Url } from "./net/BaseNet";
// import { BaiDuSdk } from "./platform/baidu/BaiDuSdk";
declare let require: (str: string) => any;
declare let window: any;
/**
 * 策略模式+简单工厂模式
 * 该模式定义了一系列可供重用的算法或业务行为，完成的工作基本相同，只是实现不同
 * 以相同的方法调用所有的算法减少各种算法类与使用算法类之间的耦合，用于提供统一接口调用实际具体的算法（多渠道sdk）
 */
export class WonderSdk {
    public static isInit: boolean = false;
    private static _instance: WonderSdk;
    private static _version: string = "1.1.0";
    private _sdk!: BaseSdk;
    private _platformId: EPlatform;
    private _isShiledIp: number = 0;
    private _bannerTime: number = 0;//banner刷新时间
    public VideoAdCode: VideoAdCode = <any>VideoAdCode;
    public ShareType: ShareType = <any>ShareType;
    public isTest: boolean = false;
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
        return this._platformId == EPlatform.NA_ANDROID || this._platformId == EPlatform.NA_IOS || this._platformId == EPlatform.OPPO_ANDROID || this._platformId == EPlatform.VIVO_ANDROID || this._platformId == EPlatform.XIAOMI_ANDROID || this._platformId == EPlatform.GOOGLE_ANDROID
            || this._platformId == EPlatform.SSJJ_ANDROID || this._platformId == EPlatform.TAPTAP_ANDROID || this._platformId == EPlatform.MMY_ANDROID || this._platformId == EPlatform.HYKB_ANDROID || this._platformId == EPlatform.AMZ_ANDROID;
    }

    /**
     * 判断是否是字节跳动平台
     */
    public get isByteDance(): boolean {
        return this._platformId == EPlatform.BYTE_DANCE;
    }

    public get isWebDev(): boolean {
        return this._platformId == EPlatform.WEB_DEV;
    }

    public get isKwai(): boolean {
        return this._platformId == EPlatform.KWAI_MICRO;
    }
    /**
     * 是否是qq小游戏平台
     */
    public get isQQ(): boolean {
        return this._platformId == EPlatform.QQ;
    }

    /**
     * 是否是百度小游戏平台
     */
    public get isBaiDuGame(): boolean {
        return this._platformId == EPlatform.BAIDU;
    }

    /**
     * 是否是微信小游戏平台
     */
    public get isWeChat(): boolean {
        return this._platformId == EPlatform.WECHAT_GAME;
    }

    /**
     * 判断是否是ios平台
     */
    public get isIOS(): boolean {
        return this._platformId == EPlatform.NA_IOS;
    }

    /**
     * 判断是否是趣头条小游戏
     */
    public get isQttGame(): boolean {
        return this._platformId == EPlatform.QTT_GAME;
    }

    /**
     * 判断是否是即刻玩小游戏
     */
    public get isJkwGame(): boolean {
        return this._platformId == EPlatform.JKW_GAME;
    }

    /**
     * 判断是否是oppo小游戏
     */
    public get isOppoMiniGame(): boolean {
        return this._platformId == EPlatform.OPPP_MICRO
    }

    /**
     * 判断是否是oppo安卓
     */
    public get isOppoAndroid(): boolean {
        return this._platformId == EPlatform.OPPO_ANDROID;
    }

    public get isVivoMiniGame(): boolean {
        return this._platformId == EPlatform.VIVO_MICRO;
    }

    public get isVivoAndroid(): boolean {
        return this._platformId == EPlatform.VIVO_ANDROID;
    }

    public get isXiaoMiAndroid(): boolean {
        return this._platformId == EPlatform.XIAOMI_ANDROID
    }

    public get isGoogleAndroid(): boolean {
        return this._platformId == EPlatform.GOOGLE_ANDROID;
    }

    public get isAmzAndroid(): boolean {
        return this._platformId == EPlatform.AMZ_ANDROID;
    }

    public get isMeiZuMicro(): boolean {
        return this._platformId == EPlatform.MEIZU_MICRO;
    }

    public get isUcMicro(): boolean {
        return this._platformId == EPlatform.UC_MICRO;
    }

    //是否需要屏蔽血腥东西的平台
    public get isShieldPlatform(): boolean {
        return this._platformId == EPlatform.NA_ANDROID || this._platformId == EPlatform.BYTE_DANCE;
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
    public setAlertAdpater(alertInterface: AlertInterface) {
        SdkAlertAdapter.setAdapter(alertInterface);
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
        if (this.isTest) {
            return;
        }
        let nowTime = (new Date()).getTime();
        // console.log("[SdkMgr][showBannerAd]", (nowTime - this._bannerTime) / 1000, nowTime, this._bannerTime);
        if (this._bannerTime) {
            if (nowTime - this._bannerTime > 15 * 1000) {
                this.destroyBanner();
                this._bannerTime = nowTime;
            }
        } else {
            this._bannerTime = nowTime;
        }
        let adid = adIdlist[adId] || adIdlist[0];
        if (!args && onShow) {
            this._sdk.showBanner(adid, onShow);
        } else if (typeof args === "function") {
            this._sdk.showBanner(adid, args);
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
     * 预加载视频
     */
    public preLoadRewardVideo() {
        this._sdk.preLoadRewardVideo();
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
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "视频拉取失败，请稍后重试");
            return;
        }
        if (this.isTest) {
            onPlayEnd && onPlayEnd(VideoAdCode.COMPLETE);
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
    public showFullVideoAD(adId: number, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        let adIdlist: any = FullVideoIdList[this._platformId];
        if (!adIdlist) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "没有对应广告id");
            return;
        }
        if (this.isTest) {
            onPlayEnd && onPlayEnd(VideoAdCode.COMPLETE, "");
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
    public showPrivacy(success: (boo: any) => void) {
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
    public share(type: ShareType, param: any, success?: () => void, fail?: () => void) {
        this._sdk.share(type, param, success, fail);
    }

    /**
     * @description 获取BMS对应唯一标识
     * @readonly
     * @memberof WonderSdk
     */
    public get BMS_APP_NAME() {
        return BMSInfoList[this._platformId] && BMSInfoList[this._platformId].BMS_APP_NAME;
    }
    /**
     * @description 获取BMS版本
     * @readonly
     * @memberof WonderSdk
     */
    public get BMS_VERSION() {
        return BMSInfoList[this._platformId] && BMSInfoList[this._platformId].BMS_VERSION;
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
        return new Promise((resolve, reject) => {
            BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_LAUNCH_CONFIG, { app_name: this.BMS_APP_NAME, version: this.BMS_VERSION }, "GET").then(res => {
                this._sdk.setBmsVo(res.data);
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });

    }
    /**
     * @description 请求分享列表配置
     * @author 吴建奋
     * @date 2020-04-28
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    public requestShareConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_SHARE_CONFIG, { app_name: this.BMS_APP_NAME, version: this.BMS_VERSION }, "GET")
                .then(data => {
                    this._sdk.setShareList(data.data.list);
                    resolve(data.data);
                }).catch(err => {
                    reject(err);
                })
        });
    }

    /**
     * @description 获取服务器时间
     * @author 吴建奋
     * @date 2020-04-30
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    public requestServerTime(): Promise<any> {
        return BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_SERVER_TIME, {}, "GET");
    }

    /**
     * 震动
     * @param type 震动类型0短震动1长震动
     */
    public vibrate(type: number = 0) {
        this._sdk.vibrate(type);
    }


    /**
     * 创建盒子
     * @param node 挂在节点
     */
    public createAppBox(node?: any): boolean {
        if (BoxIdList[this._platformId]) {
            this._sdk.createAppBox(BoxIdList[this._platformId], node);
            return true;
        } else {
            return false;
        }
    }
    /**
     * 展示更多游戏
     */
    public showAppBox(): boolean {
        if (BoxIdList[this._platformId]) {
            this._sdk.showAppBox(BoxIdList[this._platformId]);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 展示百度关注引导
     */
    public showFavoriteGuide(): boolean {
        if (this.isBaiDuGame) {
            let sdk = this._sdk;
            //@ts-ignore
            sdk.showFavoriteGuide();
            return true;
        }
        return false;
    }

    /**
     * 商店评分
     */
    public goRate(path?: string): void {
        this._sdk.goRate(path);
    }

    /**
     * 登录成功
     */
    public setLoginFinish(): void {
        this._sdk.setLoginFinish();
    }

    /**
     * 支付相关
     */
    public toPay(): void {
        this._sdk.toPay();
    }
    public toRestorePay(): void {
        this._sdk.toRestorePay();
    }

    public getNativeAdInfo() {
        return this._sdk.getNativeAdInfo();
    }

    public reportAdShowByType(type: number, id: string) {
        console.log("原生 reportAdShowBYType", type, id);
        //@ts-ignore
        this._sdk.reportAdShow(type, id);
    }

    public nativeAdRefresh() {
        this._sdk.nativeAdRefresh();
    }

    public toShareFaceBook(call?: Function) {
        this._sdk.toShareFaceBook(call);
    }
}
