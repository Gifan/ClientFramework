import { Platform } from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/fw_gjj_Framework";
import { Config } from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/config/fw_gjj_Config";

import IShareCtrler from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";
import IADCtrler from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import IChannelCtrler from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IChannelCtrler";
import IPlatformToolsCtrler from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";

import FakeShareCtrler from "../sdk/fake/yxj_gjj_FakeShareCtrler";
import FakeAdCtrler from "../sdk/fake/yxj_gjj_FakeAdCtrler";
import FakeChannelCtrler from "../sdk/fake/yxj_gjj_FakeChannelCtrler";
import FakePlatformToolsCtrler from "../sdk/fake/yxj_gjj_FakePlatformToolsCtrler";

import WxShareCtrler from "../sdk/wx/yxj_gjj_WxShareCtrler";
import WxAdCtrler from "../sdk/wx/yxj_gjj_WxAdCtrler";
import WxChannelCtrler from "../sdk/wx/yxj_gjj_WxChannelCtrler";
import WxPlatformToolsCtrler from "../sdk/wx/yxj_gjj_WxPlatformToolsCtrler";

import BdAdCtrler from "../sdk/baidu/yxj_gjj_BdAdCtrler";
import BdPlatformToolsCtrler from "../sdk/baidu/yxj_gjj_BdPlatformToolsCtrler";

import QQPlayShareCtrler from "../sdk/qqPlay/yxj_gjj_QQPlayShareCtrler";
import QQPlayAdCtrler from "../sdk/qqPlay/yxj_gjj_QQPlayAdCtrler";
import QQPlayChannelCtrler from "../sdk/qqPlay/yxj_gjj_QQPlayChannelCtrler";
import QQPlayPlatformToolsCtrler from "../sdk/qqPlay/yxj_gjj_QQPlayPlatformToolsCtrler";

import IosShareCtrler from "../sdk/ios/yxj_fl_iosShareCtrler";
import IosAdCtrler from "../sdk/ios/yxj_fl_iosAdCtrler";
import IosPlatformToolsCtrler from "../sdk/ios/yxj_fl_IosPlatformToolsCtrler";

import AndroidShareCtrler from "../sdk/android/yxj_cz_AndroidShareCtrler";
import AndroidAdCtrler from "../sdk/android/yxj_cz_AndroidAdCtrler";
import AndroidPlatformToolsCtrler from "../sdk/android/yxj_cz_AndroidPlatformToolsCtrler";

import ToutiaoShareCtrler from "../sdk/toutiao/yxj_cz_ToutiaoShareCtrler";
import ToutiaoAdCtrler from "../sdk/toutiao/yxj_cz_ToutiaoAdCtrler";
import ToutiaoChannelCtrler from "../sdk/toutiao/yxj_cz_ToutiaoChannelCtrler";
import ToutiaoPlatformToolsCtrler from "../sdk/toutiao/yxj_cz_ToutiaoPlatformToolsCtrler";

import H5_4399ShareCtrler from "../sdk/h5_4399/yxj_cz_H5_4399ShareCtrler";
import H5_4399PlatformToolsCtrler from "../sdk/h5_4399/yxj_cz_H5_4399PlatformToolsCtrler";
import H5_4399AdCtrler from "../sdk/h5_4399/yxj_cz_H5_4399AdCtrler";

import qqMiniAdCtrler from "../sdk/qqMini/yxj_gjj_qqMiniAdCtrler";
import qqMiniPlatformToolsCtrler from "../sdk/qqMini/yxj_gjj_qqMiniPlatformToolsCtrler";

import OppoShareCtrler from "../sdk/oppo/yxj_cz_OppoShareCtrler";
import OppoAdCtrler from "../sdk/oppo/yxj_cz_OppoAdCtrler";
import OppoPlatformToolsCtrler from "../sdk/oppo/yxj_cz_OppoPlatformToolsCtrler";

import H5_QTTShareCtrler from "../sdk/h5_qtt/yxj_cz_H5_QTTShareCtrler";
import H5_QTTAdCtrler from "../sdk/h5_qtt/yxj_cz_H5_QTTAdCtrler";
import H5_QTTPlatformToolsCtrler from "../sdk/h5_qtt/yxj_cz_H5_QTTPlatformToolsCtrler";

import H5_MoliShareCtrler from "../sdk/h5_moli/yxj_cz_H5_MoliShareCtrler";
import H5_MoliAdCtrler from "../sdk/h5_moli/yxj_cz_H5_MoliAdCtrler";
import H5_MoliPlatformToolsCtrler from "../sdk/h5_moli/yxj_cz_H5_MoliPlatformToolsCtrler";

import H5_UCShareCtrler from "../sdk/h5_uc/yxj_cz_UCShareCtrler";
import H5_UCAdCtrler from "../sdk/h5_uc/yxj_cz_UCAdCtrler";
import H5_UCPlatformToolsCtrler from "../sdk/h5_uc/yxj_cz_UCPlatformToolsCtrler";

import VivoLoginCtrler from "../sdk/vivo/yxj_cz_VivoLoginCtrler";
import VivoShareCtrler from "../sdk/vivo/yxj_cz_VivoShareCtrler";
import VivoAdCtrler from "../sdk/vivo/yxj_cz_VivoAdCtrler";
import VivoPlatformToolsCtrler from "../sdk/vivo/yxj_cz_VivoPlatformToolsCtrler";

import SinaShareCtrler from "../sdk/sina/yxj_cz_SinaShareCtrler";
import SinaAdCtrler from "../sdk/sina/yxj_cz_SinaAdCtrler";
import SinaPlatformToolsCtrler from "../sdk/sina/yxj_cz_SinaPlatformToolsCtrler";

import H5_ZYShareCtrler from "../sdk/h5_zy/yxj_cz_H5_ZYShareCtrler";
import H5_ZYAdCtrler from "../sdk/h5_zy/yxj_cz_H5_ZYAdCtrler";
import H5_ZYPlatformToolsCtrler from "../sdk/h5_zy/yxj_cz_H5_ZYPlatformToolsCtrler";

import XiaoMiShareCtrler from "../sdk/xiaomi/yxj_cz_XiaoMiShareCtrler";
import XiaoMiAdCtrler from "../sdk/xiaomi/yxj_cz_XiaoMiAdCtrler";
import XiaoMiPlatformToolsCtrler from "../sdk/xiaomi/yxj_cz_PlatformToolsCtrle";

import { Const } from "../config/Const";
import { screenTapCtrler } from "../ctrler/yxj/yxj_cz_screenTapCtrler";
import { SOVCtrler } from "../ctrler/yxj/yxj_gjj_sovCtrler";
import RedBagCtrler from "../ctrler/yxj/yxj_cz_redBagCtrler";

export function initCtrlers_before_startUp() { }
let CustomPlatform = Const.CustomPlatform;
let CEPlatform = Const.CEPlatform;

function _getPlatform(customPf: number): Platform {
    let info = "[StartUp][getPlatform] ";
    console.log("customPf", customPf)
    switch (customPf) {
        case CustomPlatform.H5_4399: console.log(info + "H5_4399"); return Platform.H5_4399;
        case CustomPlatform.H5_QTT: console.log(info + "H5_QTT"); return Platform.H5_QTT;
        case CustomPlatform.H5_MOLI: console.log(info + "H5_MOLI"); return Platform.H5_MOLI;
        case CustomPlatform.H5_UC: console.log(info + "H5_UC"); return Platform.H5_UC;
        case CustomPlatform.SINA: console.log(info + "SINA"); return Platform.SINA;
        case CustomPlatform.H5_ZHANG_YU: console.log(info + "SINA"); return Platform.H5_ZHANG_YU;
        case CustomPlatform.NV_ANDROID_SIX_K_PLAY: console.log(info + "NV_ANDROID_SIX_K_PLAY"); return Platform.NV_ANDROID_SIX_K_PLAY;
        case CustomPlatform.NV_ANDROID_WONDER_BOX: console.log(info + "NV_ANDROID_WONDER_BOX"); return Platform.NV_ANDROID_WONDER_BOX;
    }
    if (window["tt"]) {
        let info = window["tt"].getSystemInfoSync();
        console.log("info-------", info);
        switch (info.appName) {
            default: console.log(info + "TOUTIAO"); return Platform.TOUTIAO;
        }
    }
    if (window["qq"]) {
        console.log(info + "QQ_MINI"); return Platform.QQ_MINI;
    }

    if (cc.sys.isNative)
        switch (cc.sys.platform) {
            case cc.sys.WECHAT_GAME: console.log(info + "WECHAT_GAME"); return Platform.WECHAT_GAME;
            case cc.sys.BAIDU_GAME: console.log(info + "BAIDU_GAME"); return Platform.BAIDU_GAME; //#fw_is:ccc_2xx
            case cc.sys.VIVO_GAME: console.log(info + "VIVO_GAME"); return Platform.VIVO_GAME;
            case cc.sys.OPPO_GAME: console.log(info + "OPPO_GAME"); return Platform.OPPO_GAME;
            case cc.sys.ANDROID: console.log(info + "NV_ANDROID"); return Platform.NV_ANDROID_NORMAL;
            case cc.sys.XIAOMI_GAME: console.log(info + "XIAOMI_GAME"); return Platform.XIAOMI_GAME;
            case cc.sys.IPAD:
            case cc.sys.IPHONE: console.log(info + "NV_IPHONE"); return Platform.NV_IPHONE;
            case cc.sys.MOBILE_BROWSER:
            case cc.sys.DESKTOP_BROWSER: break;
            default: console.log(info + "UNKNOWN"); return Platform.UNKNOWN;
        }
    else
        switch (cc.sys.platform) {
            case cc.sys.WECHAT_GAME: console.log(info + "WECHAT_GAME"); return Platform.WECHAT_GAME;
            case cc.sys.BAIDU_GAME: console.log(info + "BAIDU_GAME"); return Platform.BAIDU_GAME; //#fw_is:ccc_2xx
            case cc.sys.VIVO_GAME: console.log(info + "VIVO_GAME"); return Platform.VIVO_GAME;
            case cc.sys.OPPO_GAME: console.log(info + "OPPO_GAME"); return Platform.OPPO_GAME;
            case cc.sys.ANDROID: console.log(info + "BS_ANDROID"); return Platform.BS_ANDROID;
            case cc.sys.XIAOMI_GAME: console.log(info + "XIAOMI_GAME"); return Platform.XIAOMI_GAME;
            case cc.sys.IPHONE: console.log(info + "BS_IPHONE"); return Platform.BS_IPHONE;
            case cc.sys.MOBILE_BROWSER:
            case cc.sys.DESKTOP_BROWSER: break;
            default: console.log(info + "UNKNOWN"); return Platform.UNKNOWN;
        }
}


export function initPlatformConfig(debugPf: number, customPf: number): { platform: Platform, sdkMgrConfig: Config.SdkMgrConfig } {
    let platform: Platform = _getPlatform(customPf);
    // platform = Platform.TOUTIAO;
    console.log("[StartUp][getPlatform] " + Platform[platform]);
    let shareC: IShareCtrler;
    let videoC: IADCtrler;
    let channelC: IChannelCtrler;
    let pfToolsC: IPlatformToolsCtrler;
    switch (platform) {
        case Platform.WECHAT_GAME:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_WX;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_WX;
            Const.AppConst.ALD_SDK_ID = "";
            Const.AppConst.MTA_SDK_ID = "";
            Const.AppConst.MTA_SDK_EVENT_ID = "";
            shareC = new WxShareCtrler();
            videoC = new WxAdCtrler(_getWxDict());
            channelC = new WxChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new WxPlatformToolsCtrler();
            break;
        case Platform.TOUTIAO:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_TOUTIAO;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_TOUTIAO;
            shareC = new ToutiaoShareCtrler();
            videoC = new ToutiaoAdCtrler(_getZjtdDict());
            channelC = new ToutiaoChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new ToutiaoPlatformToolsCtrler();
            break;
        case Platform.BAIDU_GAME:
            window["wx"] = window["swan"];
            //@ts-ignore
            wx.aldOnShareAppMessage = wx.onShareAppMessage;
            //@ts-ignore
            wx.aldShareAppMessage = wx.shareAppMessage;

            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_BD;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_BD;
            shareC = new WxShareCtrler();
            videoC = new BdAdCtrler(_getBdDict());
            channelC = new WxChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new BdPlatformToolsCtrler();
            break;
        case Platform.QQ_MINI:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_QQ;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_QQ;
            shareC = new WxShareCtrler();
            videoC = new qqMiniAdCtrler(_getQQDict());
            channelC = new WxChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new qqMiniPlatformToolsCtrler();
            break;
        case Platform.OPPO_GAME:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_OPPO;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_OPPO;
            shareC = new OppoShareCtrler();
            videoC = new OppoAdCtrler(_getOppoDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new OppoPlatformToolsCtrler();
            break;
        case Platform.NV_IPHONE:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_IOS;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_IOS;
            shareC = new IosShareCtrler();
            videoC = new IosAdCtrler();
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new IosPlatformToolsCtrler();
            break;
        case Platform.NV_ANDROID_NORMAL:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_ANDROID;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_ANDROID;
            shareC = new AndroidShareCtrler();
            videoC = new AndroidAdCtrler(_getAndroidDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new AndroidPlatformToolsCtrler();
            break;
        case Platform.NV_ANDROID_SIX_K_PLAY:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_ANDROID;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_ANDROID_SIX_K_PLAY;
            shareC = new AndroidShareCtrler();
            videoC = new AndroidAdCtrler(_getAndroidDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new AndroidPlatformToolsCtrler();
            break;
        case Platform.NV_ANDROID_WONDER_BOX:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_ANDROID;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_ANDROID_WONDER_BOX;
            shareC = new AndroidShareCtrler();
            videoC = new AndroidAdCtrler(_getAndroidDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new AndroidPlatformToolsCtrler();
            break;
        case Platform.H5_4399:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_H5_4399;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_H5_4399;
            shareC = new H5_4399ShareCtrler();
            videoC = new H5_4399AdCtrler(_getNothing());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new H5_4399PlatformToolsCtrler();
            break;
        case Platform.H5_QTT:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_H5_QTT;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_H5_QTT;
            shareC = new H5_QTTShareCtrler();
            videoC = new H5_QTTAdCtrler(_getNothing());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new H5_QTTPlatformToolsCtrler();
            break;
        case Platform.H5_MOLI:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_H5_MOLI;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_H5_MOLI;
            shareC = new H5_MoliShareCtrler();
            videoC = new H5_MoliAdCtrler(_getNothing());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new H5_MoliPlatformToolsCtrler();
            break;
        case Platform.H5_UC:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_H5_UC;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_H5_UC;
            shareC = new H5_UCShareCtrler();
            videoC = new H5_UCAdCtrler(_getNothing());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new H5_UCPlatformToolsCtrler();
            break;
        case Platform.VIVO_GAME:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_VIVO;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_VIVO;
            shareC = new VivoShareCtrler();
            videoC = new VivoAdCtrler(_getVivoDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new VivoPlatformToolsCtrler();
            break;
        case Platform.SINA:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_SINA;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_SINA;
            window["wb"] = window["loadRuntime"]();
            shareC = new SinaShareCtrler();
            videoC = new SinaAdCtrler(_getWbDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new SinaPlatformToolsCtrler();
            break;
        case Platform.H5_ZHANG_YU:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_H5_ZHANG_YU;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_H5_ZHANG_YU;
            shareC = new H5_ZYShareCtrler();
            videoC = new H5_ZYAdCtrler(_getNothing());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new H5_ZYPlatformToolsCtrler();
            break;
        case Platform.XIAOMI_GAME:
            Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_XIAO_MI;
            Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_XIAO_MI;
            shareC = new XiaoMiShareCtrler();
            videoC = new XiaoMiAdCtrler(_getXiaomiDict());
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new XiaoMiPlatformToolsCtrler();
            break;
        default:
            switch (debugPf) {
                default:
                case CEPlatform.dev:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_DEV;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_DEV;
                    break;
                case CEPlatform.wx:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_WX;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_WX;
                    break;
                case CEPlatform.bd:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_BD;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_BD;
                    break;
                case CEPlatform.qq:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_QQ;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_QQ;
                    break;
                case CEPlatform.ios:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_IOS;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_IOS;
                    break;
                case CEPlatform.android:
                    Const.AppConst.BMS_APP_NAME = Const.PlanfromConst.BMS_APP_NAME_ANDROID;
                    Const.AppConst.BMS_VERSION = Const.PlanfromConst.BMS_VERSION_ANDROID;
                    break;
            }
            shareC = new FakeShareCtrler();
            videoC = new FakeAdCtrler();
            channelC = new FakeChannelCtrler(Const.AppConst.BMS_APP_NAME.toLocaleLowerCase());
            pfToolsC = new FakePlatformToolsCtrler();
            break;
    }
    return {
        platform: platform,
        sdkMgrConfig: {
            shareCtrler: shareC,
            adCtrler: videoC,
            channelCtrler: channelC,
            platformToolsCtrler: pfToolsC,
        }
    }
}

export function initCtrlers_after_startUp() {
    let sov: SOVCtrler;
    let screenTap: screenTapCtrler;
    let redBag: RedBagCtrler;

    try { sov = new SOVCtrler(); } catch (e) { console.error("[initCtrler][share]", e); }
    try { screenTap = new screenTapCtrler(); } catch (e) { console.error("[initCtrler][screenTap]", e); }
    try { redBag = new RedBagCtrler(); } catch (e) { console.error("[initCtrler][redBag]", e); }


    let cls = { screenTap, sov, redBag };
    fw["cls"] = cls as any;

    window["wx"] && setTimeout(() => _wxCheckUpDate(), 0);
}
function _wxCheckUpDate() {
    if (typeof wx.getUpdateManager !== "function") return;

    const mgr = wx.getUpdateManager();
    mgr && mgr.onCheckForUpdate((res) => {
        console.log("检查新版本!!!!!!!!!!", res.hasUpdate);
        if (!res || !res.hasUpdate) return;

        mgr.onUpdateReady(() => mgr.applyUpdate());
    });
}

//微信
function _getWxDict() {
    let bid = 'adunit-fe1b44f2c1b0b9bc';
    let vid = "adunit-4258679ae9ddb20b";
    let iid = "adunit-28ecd363a869d7ae";
    let idDict = {};
    idDict["defaultv"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.InsertADType.NOMAL] = iid;
    return idDict;
}

function _getZjtdDict() {
    let vid = "3amnccfffmmo1hy834";
    let bid = "1gpimh2a2f6p1ahaf5";
    let idDict = {};
    idDict["defaultv"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    return idDict;
}

function _getBdDict() {
    let vid = "6863654";
    let bid = "6863653";
    let idDict = {};
    idDict["defaultv"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    return idDict;
}

function _getAndroidDict() {
    let vid = "936001716";
    let bid = "936001252";
    let iid = "936001307";
    let sid = "836001887";
    let idDict = {};
    idDict["defaultv"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.InsertADType.NOMAL] = iid;
    idDict[Const.SplashADType.NOMAL] = sid;
    return idDict;
}
//QQ配置
function _getQQDict() {
    let vid = "aa6a215bbba4038a5c077b958073bbbb";
    let bid = "b27a19f4f55d72a5a04b5cfcf2d2c442";
    let boxId = "cafff1cdd7888ea2f157dfcdddc79e98";
    let idDict = {};
    idDict["default"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.GameboxADType.NOMAL] = boxId;
    return idDict;
}

function _getOppoDict() {
    let vid = "108742";
    let bid = "108744";
    let iid = "108745";
    let idDict = {};
    idDict["default"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.InsertADType.NOMAL] = iid;
    return idDict;
}

function _getWbDict() {
    let vid = "324678";
    let bid = "324677";
    let idDict = {};
    idDict["default"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    return idDict;
}

function _getVivoDict() {
    let vid = "512843bf08304008b63e762c14dad1f1";
    let bid = "10ba248b7e564b06a56af06dd0d8e106";
    let iid = "5c8074792f3a45dd8f06eaed2e917e61";
    let idDict = {};
    idDict["default"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.InsertADType.NOMAL] = iid;
    return idDict;
}

function _getXiaomiDict() {
    let vid = "8bd4fe11ea894030ff7e1c7bb9e56a1f";
    let bid = "XXX";
    let iid = "2587c87d6247f0a81785784a0cc03f46";
    let idDict = {};
    idDict["default"] = vid;
    idDict[Const.VideoADType.TIPS_KEY] = vid;
    idDict[Const.BannerADType.LV_TIPS] = bid;
    idDict[Const.BannerADType.LV_END] = bid;
    idDict[Const.BannerADType.AUTO] = bid;
    idDict[Const.InsertADType.NOMAL] = iid;
    return idDict;
}

function _getNothing() {
    let idDict = {};
    return idDict;
}