import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import WxAdCtrler from "../wx/yxj_gjj_WxAdCtrler";
import { GameConst } from "../../config/yxj_gjj_const";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
declare var tt:any;
export default class DouyinAdCtrler implements IADCtrler {
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[DouyinAdCtrler][ctor]", idDict);
        this.bannerC = this._createBannerCtrler();
    }

    setBid(bid: string) {

    }

    //#region [video]

    lastVideoPlayTime: number;

    // overwrite for baidu video
    _createRewardedVideoAd(adUnitId: string) { return wx.createRewardedVideoAd({ adUnitId }); }

    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        if (!wx.createRewardedVideoAd)
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新应用版本", VideoADFailCode.NOT_SUPPORT);

        if (Date.now() - this.lastVideoPlayTime < 1000)
            return onPlayEnd && onPlayEnd("视频广告还在准备中，请稍后尝试", VideoADFailCode.NOT_READY);

        let adUnitId = this.idDict[type];
        if (!adUnitId) adUnitId = this.idDict["defaultv"];
        if (!adUnitId) return onPlayEnd && onPlayEnd("未知广告类型v:" + type, VideoADFailCode.UNKNOW_TYPE);

        console.log("[DouyinAdCtrler][showVideoAD]", adUnitId);
        let videoAd = this._createRewardedVideoAd(adUnitId);
        if (!videoAd) return onPlayEnd && onPlayEnd("不支持视频广告，请更新应用版本:" + type, VideoADFailCode.NOT_SUPPORT);
        sound_manager.pause_music();
        this.lastVideoPlayTime = Date.now();
        let onClose: fw.cb1<wx.RewardedVideoAd.onClose_res> = res => {
            console.log("[DouyinAdCtrler][videoAd][onClose]", res);
            sound_manager.resume_music()
            videoAd.offClose(onClose);
            let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
            onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
        }
        videoAd.onClose(onClose);
        videoAd.load().then(() => videoAd.show()).catch(e => {
            console.error("[DouyinAdCtrler][showVideoAD] error", e);
            sound_manager.resume_music();
            videoAd.offClose(onClose);
            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });
    }

    //#endregion [video]

    //#region [banner]

    bannerC: DouyinBannerCtrler;

    // overwrite for baidu banner
    _createBannerCtrler() { return new DouyinBannerCtrler(); }
    _checkAndGetId(type: string): string | void {
        this.bannerC.hide();

        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);

        return adUnitId;
    }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        // let adUnitId = this._checkAndGetId(type)
        // if (!adUnitId) return;
        // this.bannerC.showWithNode(adUnitId, node, onShow);
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void, args?: any) {
        // let adUnitId = this._checkAndGetId(type)
        // if (!adUnitId) return;
        // this.bannerC.showWithStyle(adUnitId, style, onShow);
    }
    hideBannerAd() { this.bannerC.hide(); }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any): WxBanner {
        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);
        return new WxBanner(adUnitId, style);
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

    //#endregion [banner]
}

export class DouyinBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _banner: cc.Node;
    protected _beDestroyBanner: WxBannerProxy;

    constructor() {
        cc.loader.loadRes("yxj_gjj_resource/prefabs/ui/item/douyinBannerItem", (e, res: cc.Prefab) => {
            if (e) return console.error("[screenTapCtrler] load res error", e);
            if (!res) return console.error("[screenTapCtrler] load res is null", res);
            let pr = cc.find("Canvas/view/panelRoot");
            if (!pr) return console.error("[screenTapCtrler] panelRoot not find");
            this._banner = cc.instantiate(res);
            this._banner.parent = pr.parent;
            this._banner.on(cc.Node.EventType.TOUCH_END, () => {
                tt.openSchema({
                    schema: 'sslocal://microapp?app_id=ttacffda4233d51d45&launch_from='+GameConst.AppConst.BMS_APP_NAME
                })
            }, this)
            this._banner.active = false;
            // if (this._isIphoneX()) {
            //     this._banner.getComponent(cc.Widget).bottom -= 72;
            //     this._banner.getComponent(cc.Widget).updateAlignment();
            // }
        });
    }

    /**判断是否长屏手机 */
    _isIphoneX() {
        return cc.winSize.height / cc.winSize.width - 16 / 9 > 0.1 ? true : false;
    }

    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        this._banner.active = true;
    }

    showWithStyle(adUnitId: string, bStyle?: BannerADStyle, onShow?: () => void) {
        this._banner.active = true;
    }

    hide() { this._banner && (this._banner.active = false); }

    destroy() {
        this._banner.active = false;
    }
}

export class WxBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _banner: WxBannerProxy;
    protected _beDestroyBanner: WxBannerProxy;

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

    // overwrite for baidu banner
    protected _createRealBanner(adUnitId: string, width: number, onResize: WxBannerProxy.OnResize) {
        return wx.createBannerAd({ adUnitId, style: { left: 0, top: 0, width } });
    }

    protected _create(adUnitId: string, width: number, onShow: () => void, onResize: WxBannerProxy.OnResize) {
        console.log("[DouyinBannerCtrler][createNew]");
        let banner = this._createRealBanner(adUnitId, width, onResize);
        if (!banner) return console.error("[DouyinBannerCtrler] create fail"), undefined;

        return new WxBannerProxy(banner,
            () => { onShow && onShow(); this._realDestroy(); },
            (e, banner) => {
                if (this._banner === banner) this._banner = null;
                this._reuseBeDestroy(width, banner.onBannerResize, onShow);
            },
            onResize,
        );
    }
    protected _show(adUnitId: string, width: number, onResize: WxBannerProxy.OnResize, onShow: () => void) {
        if (!this._banner)
            return this._banner = this._create(adUnitId, width, onShow, onResize);
        this._banner.reuse(width, onResize);
        onShow && onShow();
    }

    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        if (node.width < this._minCCWidth) node.width = this._minCCWidth;
        if (node.width > this._ccCvsW) node.width = this._ccCvsW;

        let onBannerResize: WxBannerProxy.OnResize = (banner, res) => {
            console.log("[DouyinBannerCtrler][onBannerResize][WithNode]");
            node.height = res.height * this._wx2ccScale;
            let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            banner.style.left = (pos.x - node.width * node.anchorX) * this._cc2wxScale;
            banner.style.top = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;
        };

        this._show(adUnitId, node.width * this._cc2wxScale, onBannerResize, onShow);
    }

    showWithStyle(adUnitId: string, bStyle?: BannerADStyle, onShow?: () => void) {
        let width = bStyle && bStyle.width;
        if (width) {
            if (width < 300) width = 300;
            if (width > this._wxSrnW) width = this._wxSrnW;
        }
        else width = 300 + (this._wxSrnW - 300) * ((bStyle && bStyle.widthScale) || 0);

        let onBannerResize: WxBannerProxy.OnResize = (banner, res) => {
            console.log("[DouyinBannerCtrler][onBannerResize][WithStyle]");
            banner.style.left = (this._wxSrnW - width) * 0.5;
            if (bStyle && bStyle.top) return banner.style.top = bStyle.top * this._cc2wxScale;
            if (bStyle && bStyle.bottom) return banner.style.top = this._wxSrnH - res.height - bStyle.bottom * this._cc2wxScale;
            banner.style.top = this._wxSrnH - res.height;
        };

        this._show(adUnitId, width, onBannerResize, onShow);
    }

    hide() { this._banner && this._banner.hide(); }

    destroy() {
        if (this._banner) {
            this._banner.hide();
            this._realDestroy();
            this._beDestroyBanner = this._banner;
            this._banner = null;
        }
        else {
            if (this._beDestroyBanner)
                this._beDestroyBanner.hide();
        }
    }

    protected _realDestroy() {
        if (!this._beDestroyBanner)
            return console.log("[DouyinBannerCtrler][realDestroy] beDestroyBanner is null");

        console.log("[DouyinBannerCtrler][realDestroy]");
        this._beDestroyBanner.dispose();
        this._beDestroyBanner = null;
    }

    protected _reuseBeDestroy(width: number, onResize: WxBannerProxy.OnResize, onShow: () => void) {
        if (!this._beDestroyBanner)
            return console.error("[DouyinBannerCtrler][reuseBeDestroy] beDestroyBanner is null");
        if (!onResize)
            return console.error("[DouyinBannerCtrler][reuseBeDestroy] onBannerResize is null");

        console.log("[DouyinBannerCtrler][reuseBeDestroy]");
        this._banner = this._beDestroyBanner;
        this._banner.reuse(width, onResize);
        this._beDestroyBanner = null;
        onShow && onShow();
    }
}

export class WxBannerProxy {
    protected _banner: wx.BannerAd;
    protected _onBannerLoad: WxBannerProxy.OnLoad;
    protected _onBannerError: WxBannerProxy.OnError;
    protected _onBannerResize: WxBannerProxy.OnResize;
    get onBannerResize(): WxBannerProxy.OnResize { return this._onBannerResize; };
    constructor(banner: wx.BannerAd, onBannerLoad: WxBannerProxy.OnLoad, onBannerError: WxBannerProxy.OnError, onBannerResize: WxBannerProxy.OnResize) {
        this._banner = banner;
        this._onBannerLoad = onBannerLoad;
        this._onBannerError = onBannerError;
        this._onBannerResize = onBannerResize;
        console.log("[DouyinBannerProxy][constructor]", banner);
        banner.onLoad(this._onLoad.bind(this));
        banner.onError(this._onError.bind(this));
        banner.onResize(this._onResize.bind(this));
    }
    protected _onLoad() {
        if (!this._onBannerLoad)
            return console.log("[DouyinBannerProxy][onLoad] onBannerLoad is null");

        console.log("[DouyinBannerProxy][onLoad]");
        this._onBannerLoad();
        this._onBannerLoad = null;
        this._onBannerError = null;
        this._banner.show();
    }
    protected _onError(e) {
        this._banner.destroy();
        this._banner = null;
        if (!this._onBannerError)
            return console.log("[DouyinBannerProxy][onError] onBannerError is null");

        console.error("[DouyinBannerProxy][onError]", e);
        this._onBannerError(e, this);
        this.dispose();
    }
    protected _onResize(style: wx.BannerAd.onResize_res) {
        if (!this._onBannerResize)
            return console.log("[DouyinBannerProxy][onResize] onBannerResize is null");

        console.log("[DouyinBannerProxy][onResize]");
        this._onBannerResize(this._banner, style);
        this._onBannerResize = null;
    }
    reuse(width: number, onBannerResize: WxBannerProxy.OnResize) {
        console.log("[DouyinBannerProxy][reuse]");
        this._onBannerResize = onBannerResize;
        this._banner.style.width = width + Math.random();
        this._banner.show();
    }
    hide() {
        this._banner && this._banner.hide();
        this._onBannerLoad = null;
        this._onBannerResize = null;
    }
    dispose() {
        this._banner && this._banner.destroy();
        this._banner = null;
        this._onBannerLoad = null;
        this._onBannerError = null;
        this._onBannerResize = null;
    }
}
export namespace WxBannerProxy {
    export type OnLoad = fw.cb;
    export type OnError = fw.cb2<Error, WxBannerProxy>;
    export type OnResize = fw.cb2<wx.BannerAd, wx.BannerAd.onResize_res>;
}

class WxBanner implements IBanner {
    constructor(adUnitId: string, style?: BannerADStyle) {
        this._bannerAd = typeof wx.createBannerAd === "function" && wx.createBannerAd({
            adUnitId: adUnitId,
            style: WxAdCtrler.createBannerStyle_withStyle(style),
        });
        if (!this._bannerAd) return;
        console.log("[DouyinBanner][constructor]", this);
        this._bannerAd.onLoad(() => this.canShow = true);
        this._bannerAd.onError(() => this.canShow = false);
    }
    _bannerAd;
    canShow: boolean;
    show() { this._bannerAd && this._bannerAd.show(); }
    hide() { this._bannerAd && this._bannerAd.hide(); }
    dispose() {
        this._bannerAd && this._bannerAd.destroy();
        this._bannerAd = null;
    }
    onLoad(cb: () => void) {
        this._bannerAd && this._bannerAd.onLoad(cb);
    }
    onError(cb: (e: Error) => void) {
        this._bannerAd && this._bannerAd.onError(cb);
    }
}