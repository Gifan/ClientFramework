import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
import { Const } from "../../config/Const";
let common = require('zqddn_zhb_Common');
// 百度广告id
let appSid = Const.AppConst.BD_APP_SID;
let _swan = window["swan"] as SwanAdApi;
type SwanAdApi = {
    createBannerAd(object: { adUnitId: string, style: wx.BannerAd.create_style, appSid: string }): wx.BannerAd;
    createRewardedVideoAd(object: { adUnitId: string, appSid: string }): wx.RewardedVideoAd;
    showFavoriteGuide(object: { type: string, content: string, success: fw.cb1<any>, fail: fw.cb1<any>, complete: fw.cb1<any> })
}
export default class BdAdCtrler implements IADCtrler {
    get appSid() { return appSid; }
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[BdAdCtrler][ctor]", idDict);
        this.bannerC = this._createBannerCtrler();
    }
    setBid(bid: string) {

    }

    //#region [video]

    lastVideoPlayTime: number;

    // overwrite for baidu video
    _createRewardedVideoAd(adUnitId: string) {
        console.log("[BdAdCtrler][_createRewardedVideoAd]", adUnitId, appSid)
        return _swan.createRewardedVideoAd({ adUnitId: adUnitId, appSid: appSid });
    }

    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {

        if (!wx.createRewardedVideoAd)
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新应用版本", VideoADFailCode.NOT_SUPPORT);

        if (Date.now() - this.lastVideoPlayTime < 1000)
            return onPlayEnd && onPlayEnd("视频广告还在准备中，请稍后尝试", VideoADFailCode.NOT_READY);

        let adUnitId = this.idDict[type];
        if (!adUnitId) adUnitId = this.idDict["defaultv"];
        if (!adUnitId) return onPlayEnd && onPlayEnd("未知广告类型v:" + type, VideoADFailCode.UNKNOW_TYPE);

        console.log("[BdAdCtrler][showVideoAD]", adUnitId);
        let videoAd = this._createRewardedVideoAd(adUnitId);
        sound_manager.pause_music();
        if (!videoAd) return onPlayEnd && onPlayEnd("不支持视频广告，请更新应用版本:" + type, VideoADFailCode.NOT_SUPPORT);

        this.lastVideoPlayTime = Date.now();
        let onClose: fw.cb1<wx.RewardedVideoAd.onClose_res> = res => {
            console.log("[BdAdCtrler][videoAd][onClose]", res);
            sound_manager.resume_music();
            videoAd.offClose(onClose);
            let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
            onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
        }
        videoAd.onClose(onClose);
        videoAd.load().then(() => videoAd.show()).catch(e => {
            console.error("[BdAdCtrler][showVideoAD] error", e);
            sound_manager.resume_music();
            videoAd.offClose(onClose);
            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });
    }

    //#endregion [video]

    //#region [banner]

    bannerC: BdBannerCtrler;

    // overwrite for baidu banner
    _createBannerCtrler() { return new BdBannerCtrler(); }
    _checkAndGetId(type: string): string | void {
        if (typeof wx.createBannerAd !== "function") return console.log("stop call banner ad, typeof wx.createBannerAd is not function");
        this.bannerC.hide();

        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);

        return adUnitId;
    }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        if (common.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithNode(adUnitId, node, onShow);
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void, args?: any) {
        if (common.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithStyle(adUnitId, style, onShow);
    }
    hideBannerAd() { this.bannerC.hide(); }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any) {
        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);
        return this.bannerC.createRealBanner(adUnitId, style) as any;
    }

    /** 转换Banner广告的Style格式
     * @param style.width [广告宽度|默认300] 非法值(超过300-375)会作裁剪
     * @param style.bottom [底部对齐|默认0] 传入距离底部的高度(微信的像素单位), 非法值会调整到屏幕内
     * @param style.top [顶部对齐|默认不执行|会覆盖前一参数] 距离顶部的高度(微信的像素单位), 非法值会调整到屏幕内
     */
    static createBannerStyle_withStyle(style: BannerADStyle = {}) {
        let { screenWidth, screenHeight } = wx.getSystemInfoSync();
        if (!style.width) style.width = 300; // 300-375
        if (style.width < 300) style.width = 300; if (style.width > screenWidth) style.width = screenWidth;
        let height = style.width * 0.285;
        let maxTop = screenHeight - height;
        if (!style.top) style.top = maxTop - (style.bottom || 0);
        if (style.top < 0) style.top = 0; if (style.top > maxTop) style.top = maxTop;
        return { left: (screenWidth - style.width) * 0.5, top: style.top, width: style.width, height };
    }

    showAddToMyGameGuide(type: string) {
        if (!_swan.showFavoriteGuide) return console.error("百度版本过低，没有添加到我的游戏功能");
        console.log("[BdAdCtrler][showAddToMyGameGuide]", type);
        _swan.showFavoriteGuide({
            type: type,
            content: '一键添加到我的小程序',
            success: res => {
                console.log('百度添加我的游戏成功：', res);
            },
            fail: err => {
                console.log('百度添加我的游戏失败：', err);
            },
            complete: err => {
                console.log('百度添加我的游戏调用完成：', err);
            }
        })
    }

    //#endregion [banner]
}

export class BdBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _banner;

    constructor() {
        let wxSysInfo = wx.getSystemInfoSync();
        this._wxSrnW = wxSysInfo.screenWidth;
        this._wxSrnH = wxSysInfo.screenHeight;
        this._ccCvsW = cc.Canvas.instance.node.width;
        this._ccCvsH = cc.Canvas.instance.node.height;
        this._cc2wxScale = wxSysInfo.screenHeight / this._ccCvsH;
        this._wx2ccScale = this._ccCvsH / wxSysInfo.screenHeight;
        this._minCCWidth = 300 * this._wx2ccScale;
    }

    public static hasHide: boolean;

    createRealBanner(adUnitId: string, style: BannerADStyle) {
        // let fakeBanner = { style: { left: 0, top: 0, width, height: width / 3 } } as wx.BannerAd;
        // onResize(fakeBanner, fakeBanner.style);
        let parm = { adUnitId, style, appSid };
        console.log("parm", parm);
        let banner = _swan.createBannerAd(parm);
        return banner;
    }

    protected _show(adUnitId: string, style: BannerADStyle, onShow: () => void) {
        this._banner = this.createRealBanner(adUnitId, style);
        console.log("百度广告条实例", this._banner);
        this._banner.onLoad(() => {
            console.log("[BdBanner][onLoad]");
            onShow && onShow();
            this._banner && this._banner.show();
        })
        this._banner.onError((err) => {
            console.log(' banner 广告错误', err);
            onShow && onShow();
            this._banner.destroy();
            this._banner = null;
        })

    }

    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        node.width = cc.winSize.width - 30;
        if (node.width < this._minCCWidth) node.width = this._minCCWidth;
        if (node.width > this._ccCvsW) node.width = this._ccCvsW;
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let left = (pos.x - node.width * node.anchorX) * this._cc2wxScale;
        let width = node.width * this._cc2wxScale;
        let top = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;
        this._show(adUnitId, { width: width, left: left, top: top }, onShow);
    }

    showWithStyle(adUnitId: string, bStyle?: BannerADStyle, onShow?: () => void) {
        let width = bStyle && bStyle.width;
        if (width) {
            if (width < 300) width = 300;
            if (width > this._wxSrnW) width = this._wxSrnW;
        }
        else width = 300 + (this._wxSrnW - 300) * ((bStyle && bStyle.widthScale) || 0);
        let left = (this._wxSrnW - width) * 0.5;
        let top;
        if (bStyle && bStyle.top) {
            top = bStyle.top * this._cc2wxScale;
        } else if (bStyle && bStyle.bottom) {
            top = this._wxSrnH - bStyle.width * 11 / 43 - bStyle.bottom * this._cc2wxScale;
        } else {
            top = this._wxSrnH - bStyle.width * 11 / 43;
        }

        this._show(adUnitId, { width: width, left: left, top: top }, onShow);
    }

    hide() {
        if (this._banner) {
            this._banner.hide();
        }
    }

    destroy() {
        console.log("[BdBanner][destroy]", this._banner);
        if (this._banner) {
            this._banner.hide();
            this._banner.destroy();
            this._banner = null;
        }
    }
}


