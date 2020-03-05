import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import { Const } from "../../config/Const";
let common = require('zqddn_zhb_Common');
export default class qqMiniAdCtrler implements IADCtrler {
    static bannerNode: cc.Node = null;
    static adBlock: cc.Node = null;
    private _timer: NodeJS.Timeout;
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[qqMiniAdCtrler][ctor]", idDict);
        this.bannerC = this._createBannerCtrler();
        this.createAppBox();
        cc.loader.loadRes(Const.ResPath.AD_BLOCK, cc.Prefab, (e, res: cc.Prefab) => {
            if (e) return cc.error("load question prefab fail.", e);
            let node = cc.instantiate(res);
            node.on(cc.Node.EventType.TOUCH_END, () => {
                console.log("adblockTap")
                this.bannerC.hide();
            }, this)
            node.active = false;
            qqMiniAdCtrler.adBlock = node;
            let view = common.sceneMgr.node;
            qqMiniAdCtrler.adBlock.parent = view;
        });
    }

    static showAdBlock() {
        console.log("[qqMiniAdCtrler][showAdBlock]", common.getConditionByTag("adsclose"))
        if (!common.getConditionByTag("adsclose")) return;
        if (!qqMiniAdCtrler.bannerNode) return;
        setTimeout(() => {
            if (!qqMiniBannerCtrler.hasHide) {
                this.adBlock.active = true;
                this.adBlock.stopAllActions();
                this.adBlock.runAction(cc.sequence(cc.callFunc(() => { console.log("adBlock0"); this.adBlock.opacity = 0; }), cc.delayTime(1), cc.fadeIn(0.5), cc.callFunc(() => { console.log("adBlock255"); })))
            }
        }, 300)
        // let view = cc.Canvas.instance.node;
        let wpos = qqMiniAdCtrler.bannerNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let nPos = this.adBlock.parent.convertToNodeSpaceAR(wpos);
        let exactPos = cc.v2(nPos.x - qqMiniAdCtrler.bannerNode.width * (qqMiniAdCtrler.bannerNode.anchorX - 0.5),
            nPos.y - qqMiniAdCtrler.bannerNode.height * (qqMiniAdCtrler.bannerNode.anchorY - 0.5));
        this.adBlock.position = cc.v2(exactPos.x - qqMiniAdCtrler.bannerNode.width / 2 + this.adBlock.width / 2 - 4,
            exactPos.y + qqMiniAdCtrler.bannerNode.height / 2 - this.adBlock.height / 2);

    }
    static hideAdBlock() {
        if (this.adBlock) {
            this.adBlock.stopAllActions();
            this.adBlock.active = false;
        }
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

        console.log("[qqMiniAdCtrler][showVideoAD]", adUnitId);
        let videoAd = this._createRewardedVideoAd(adUnitId);
        if (!videoAd) return onPlayEnd && onPlayEnd("不支持视频广告，请更新应用版本:" + type, VideoADFailCode.NOT_SUPPORT);

        this.lastVideoPlayTime = Date.now();
        let onClose: fw.cb1<wx.RewardedVideoAd.onClose_res> = res => {
            console.log("[qqMiniAdCtrler][videoAd][onClose]", res);
            videoAd.offClose(onClose);
            let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
            onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
        }
        videoAd.onClose(onClose);
        videoAd.load().then(() => videoAd.show()).catch(e => {
            console.error("[qqMiniAdCtrler][showVideoAD] error", e);
            videoAd.offClose(onClose);
            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });
    }

    //#endregion [video]

    //#region [banner]

    bannerC: qqMiniBannerCtrler;
    appBox: AppBox;
    hasAppBox: boolean;

    // overwrite for baidu banner
    _createBannerCtrler() { return new qqMiniBannerCtrler(); }
    _checkAndGetId(type: string): string | void {
        if (typeof wx.createBannerAd !== "function") return console.log("stop call banner ad, typeof wx.createBannerAd is not function");
        // this.bannerC.hide();

        let adUnitId = this.idDict[type];
        if (!adUnitId) return console.log("未知广告类型b:" + type);
        return adUnitId;
    }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        if (common.isAuditing === 1) return;
        qqMiniAdCtrler.bannerNode = null;
        qqMiniAdCtrler.bannerNode = node;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        qqMiniAdCtrler.hideAdBlock();
        this._timer = setTimeout(() => { this.bannerC.showWithNode(adUnitId as string, node, onShow); }, 0.3);

    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void, args?: any) {
        if (common.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        qqMiniAdCtrler.hideAdBlock();
        this._timer = setTimeout(() => { this.bannerC.showWithStyle(adUnitId as string, style, onShow); }, 0.3);
    }
    hideBannerAd() {
        clearTimeout(this._timer);
        this.bannerC.hide();
    }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any): WxBanner {
        let adUnitId = this.idDict[type];
        if (!adUnitId) {
            console.log("未知广告类型b:" + type);
            return;
        }
        return new WxBanner(adUnitId, style);
    }

    createAppBox(moreGameBtn?: cc.Node) {
        if (!window["qq"].createAppBox) return console.error("createAppBox_Fail")
        let adUnitId = this.idDict[Const.GameboxADType.NOMAL];
        console.log("[qqMiniAdCtrler][createAppBox][开始创建盒子]");
        this.appBox = window["qq"].createAppBox({
            adUnitId: adUnitId,
        })
        // console.log("[qqMiniAdCtrler][createAppBox][success]");
        this.appBox.load().then(() => {
            console.log("[qqMiniAdCtrler][createAppBox][success]");
            this.hasAppBox = true;
            moreGameBtn && (moreGameBtn.active = true);
        }).catch(e => { console.log("[qqMiniAdCtrler][createAppBox][fali]", e) });
    }
    showMoreGameBtn(moreGameBtn?: cc.Node) {
        console.log("[qqMiniAdCtrler][showMoreGameBtn]", this.hasAppBox);
        if (this.hasAppBox) {
            moreGameBtn && (moreGameBtn.active = true);
        } else {
            if(!moreGameBtn)return console.error("[ToutiaoAdCtrler][showMoreGameBtn]传入更多按钮节点为空");
            this.createAppBox(moreGameBtn);
        }
    }

    showGameBox() {
        if (this.hasAppBox) {
            this.appBox.show().then(() => {
                console.log("[qqMiniAdCtrler][showGameBox][success]");
                this.hasAppBox = true;
            }).catch(e => { console.log("[qqMiniAdCtrler][showGameBox][fail]", e) });
        }
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

export class qqMiniBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _banner: WxBannerProxy;
    protected blockBtn: cc.Node;

    constructor() {
        if (!window["qq"]) return;
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

    // overwrite for baidu banner
    protected _createRealBanner(adUnitId: string, style: BannerADStyle, onResize: WxBannerProxy.OnResize) {
        return wx.createBannerAd({ adUnitId, style });
    }

    protected _create(adUnitId: string, style: BannerADStyle, onShow: () => void, onResize: WxBannerProxy.OnResize) {
        console.log("[qqMiniBannerCtrler][createNew]");
        let banner = this._createRealBanner(adUnitId, style, onResize);
        if (!banner) return console.error("[qqMiniBannerCtrler] create fail"), undefined;
        return new WxBannerProxy(banner,
            () => { onShow && onShow(); },
            (e, banner) => {
                if (this._banner === banner) this._banner = null;
            },
            onResize,
        );
    }
    protected _show(adUnitId: string, style: BannerADStyle, onResize: WxBannerProxy.OnResize, onShow: () => void) {
        if (!this._banner)
            return this._banner = this._create(adUnitId, style, onShow, onResize);
        this._banner.reuse(style, onResize);
        onShow && onShow();
    }

    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        qqMiniBannerCtrler.hasHide = false;
        node.width = cc.winSize.width - 30;
        if (node.width < this._minCCWidth) node.width = this._minCCWidth;
        if (node.width > this._ccCvsW) node.width = this._ccCvsW;
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let left = (pos.x - node.width * node.anchorX) * this._cc2wxScale;
        let width = node.width * this._cc2wxScale;
        let top = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;
        let onBannerResize: WxBannerProxy.OnResize = (banner, res) => {
            console.log("[qqMiniBannerCtrler][onBannerResize][WithNode]", top);
            qqMiniAdCtrler.showAdBlock();
            node.height = res.height * this._wx2ccScale;
            banner.style.left = left;
            banner.style.top = top;
        };
        this._show(adUnitId, { width: width, left: left, top: top }, onBannerResize, onShow);
    }

    showWithStyle(adUnitId: string, bStyle?: BannerADStyle, onShow?: () => void) {
        qqMiniBannerCtrler.hasHide = false;
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
        let onBannerResize: WxBannerProxy.OnResize = (banner, res) => {
            console.log("[qqMiniBannerCtrler][onBannerResize][WithStyle]");
            banner.style.left = left;
            banner.style.top = top;
        };

        this._show(adUnitId, { width: width, left: left, top: top }, onBannerResize, onShow);
    }

    hide() {
        console.log("[qqMiniBannerCtrler][hide]");
        qqMiniBannerCtrler.hasHide = true;
        qqMiniAdCtrler.hideAdBlock();
        this._banner && this._banner.hide();
    }

    destroy() {
        if (this._banner) {
            this._banner.hide();
            this._banner.dispose();
            this._banner = null;
        }
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
        banner.onLoad(this._onLoad.bind(this));
        banner.onError(this._onError.bind(this));
        banner.onResize(this._onResize.bind(this));
    }
    protected _onLoad() {
        if (!this._onBannerLoad)
            return console.log("[qqMiniBannerProxy][onLoad] onBannerLoad is null");

        console.log("[qqMiniBannerProxy][onLoad]");
        this._onBannerLoad();
        this._onBannerLoad = null;
        this._onBannerError = null;
        this._banner.show();
    }
    protected _onError(e) {
        if (!this._onBannerError)
            return console.log("[qqMiniBannerProxy][onError] onBannerError is null");

        console.error("[qqMiniBannerProxy][onError]", e);
        this._onBannerError(e, this);
        this.dispose();
    }
    protected _onResize(style: wx.BannerAd.onResize_res) {
        if (!this._onBannerResize)
            return console.log("[qqMiniBannerProxy][onResize] onBannerResize is null");

        console.log("[qqMiniBannerProxy][onResize]");
        this._onBannerResize(this._banner, style);
        this._onBannerResize = null;
    }
    reuse(style: BannerADStyle, onBannerResize: WxBannerProxy.OnResize) {
        console.log("[qqMiniBannerProxy][reuse]");
        this._onBannerResize = onBannerResize;
        this._banner.style.top = style.top;
        let random = Math.random();
        if (Math.random() > 0.5) {
            this._banner.style.width += Math.random();
        } else {
            this._banner.style.width -= Math.random();
        }
        qqMiniAdCtrler.showAdBlock();
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
            style: qqMiniAdCtrler.createBannerStyle_withStyle(style),
        });
        if (!this._bannerAd) return;
        console.log("[WxBanner][constructor]", this);
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

interface AppBox {
    load();
    show();
    destroy();
    onClose(cb: fw.cb);
    offClose(cb: fw.cb);
}