import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import WxAdCtrler from "../wx/yxj_gjj_WxAdCtrler";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
let common = require('zqddn_zhb_Common');
let tt = window['tt'];

export default class ToutiaoAdCtrler implements IADCtrler {
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[ToutiaoAdCtrler][ctor]", idDict);
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
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新头条版本", VideoADFailCode.NOT_SUPPORT);

        if (Date.now() - this.lastVideoPlayTime < 1000)
            return onPlayEnd && onPlayEnd("视频广告还在准备中，请稍后尝试", VideoADFailCode.NOT_READY);

        let adUnitId = this.idDict[type];
        if (!adUnitId) adUnitId = this.idDict["defaultv"];
        if (!adUnitId) return onPlayEnd && onPlayEnd("未知广告类型v:" + type, VideoADFailCode.UNKNOW_TYPE);

        console.log("[ToutiaoAdCtrler][showVideoAD]", adUnitId);
        let videoAd = this._createRewardedVideoAd(adUnitId);
        sound_manager.pause_music();
        if (!videoAd) return onPlayEnd && onPlayEnd("不支持视频广告，请更新头条版本:" + type, VideoADFailCode.NOT_SUPPORT);
        this.lastVideoPlayTime = Date.now();
        let onClose: fw.cb1<wx.RewardedVideoAd.onClose_res> = res => {
            console.log("[ToutiaoAdCtrler][videoAd][onClose]", res);
            sound_manager.resume_music();
            videoAd.offClose(onClose);
            let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
            onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
        }
        videoAd.onClose(onClose);
        videoAd.load().then(() => videoAd.show()).catch(e => {
            console.error("[ToutiaoAdCtrler][showVideoAD] error", e);
            videoAd.offClose(onClose);
            sound_manager.resume_music();
            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });

        // common.videoMgr.playVideo({
        //     src:"https://static.zuiqiangyingyu.cn/wb_webview/zqddn_zhb/quanminshaonao/tt/test.mp4",
        //     start:()=>{
        //         sound_manager.pause_music();
        //     },
        //     error:()=>{
        //         onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        //         sound_manager.resume_music();
        //     },
        //     end:()=>{
        //         onPlayEnd && onPlayEnd("", VideoADFailCode.NOT_COMPLITE);
        //         sound_manager.resume_music();
        //     }
        // });
    }

    //#endregion [video]

    //#region [banner]

    bannerC: ToutiaoBannerCtrler;

    // overwrite for baidu banner
    _createBannerCtrler() { return new ToutiaoBannerCtrler(); }
    _checkAndGetId(type: string): string | void {
        if (typeof wx.createBannerAd !== "function") return console.log("stop call banner ad, typeof wx.createBannerAd is not function");
        this.bannerC.hide();

        let adUnitId = this.idDict[type];
        if (!adUnitId) return console.log("未知广告类型b:" + type);

        return adUnitId;
    }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        console.log("[ToutiaoAdCtrler][showBannerAd_withNode]", type, this.idDict[type]);
        if (common.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithNode(adUnitId, node, onShow);
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void, args?: any) {
        console.log("[ToutiaoAdCtrler][showBannerAd_withStyle]", type, this.idDict[type]);
        if (common.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithStyle(adUnitId, style, onShow);
    }
    hideBannerAd() { this.bannerC.hasHide = true; this.bannerC.hide(); }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any): WxBanner {
        let adUnitId = this.idDict[type];
        if (!adUnitId) {
            console.log("未知广告类型b:" + type);
            return;
        }
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

    _MoreGamesButton: TTMoreGamesButton;

    showMoreGameBtn(moreGameBtn: cc.Node) {
        if (this._MoreGamesButton) {
            console.log("[ToutiaoAdCtrler][showMoreGameBtn]已存在更多游戏按钮");
            this._MoreGamesButton.show();
        } else {
            let wxSysInfo = wx.getSystemInfoSync();
            if (!(window['tt'] != undefined && tt.createMoreGamesButton && wxSysInfo.platform == "android")) return;
            let wxSrnW = wxSysInfo.screenWidth;
            let wxSrnH = wxSysInfo.screenHeight;
            let ccCvsW = cc.Canvas.instance.node.width;
            let ccCvsH = cc.Canvas.instance.node.height;
            let cc2wxScale = wxSrnH / ccCvsH;
            // let wx2ccScale = ccCvsH / wxSrnH;
            let btWidth = moreGameBtn.width * cc2wxScale;
            let btHeight = moreGameBtn.height * cc2wxScale;
            //计算出转换到微信坐标系下的按钮左上角Y(微信以左上角为零点)
            let wpos = moreGameBtn.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let left = wpos.x * cc2wxScale - btWidth / 2;
            let top = (ccCvsH - wpos.y) * cc2wxScale - btHeight / 2;
            tt.downloadFile({
                url: 'https://static.zuiqiangyingyu.cn/wb_webview/quanminshaonao/btnImages/moreGame.png',
                success: (res) => {
                    console.log("[ToutiaoAdCtrler][showMoreGameBtn]", btWidth, btHeight, left, top, res.tempFilePath);
                    this._MoreGamesButton = tt.createMoreGamesButton({
                        type: "image",
                        image: res.tempFilePath,
                        style: {
                            left: left,
                            top: top,
                            width: btWidth,
                            height: btHeight,
                            lineHeight: 40,
                            backgroundColor: "#ff0000",
                            textColor: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            borderRadius: 4,
                            borderWidth: 0,
                            borderColor: '#ff0000'
                        },
                        appLaunchOptions: [],
                        onNavigateToMiniGame(res) {
                            console.log('跳转其他小游戏', res);
                        }
                    });
                    this._MoreGamesButton.show();
                }
            });
        }
    }

    hideMoreGameBtn() {
        console.log("[ToutiaoAdCtrler][hideMoreGameBtn]")
        this._MoreGamesButton && this._MoreGamesButton.hide();
    }
}

export class ToutiaoBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _banner: wx.BannerAd;
    protected bannerAdNew: wx.BannerAd;

    constructor() {
        if (!window["wx"]) return;
        let wxSysInfo = wx.getSystemInfoSync();
        console.log("[ToutiaoBannerCtrler][constructor]", wxSysInfo)
        this._wxSrnW = wxSysInfo.screenWidth;
        this._wxSrnH = wxSysInfo.screenHeight;
        this._ccCvsW = cc.Canvas.instance.node.width;
        this._ccCvsH = cc.Canvas.instance.node.height;
        this._cc2wxScale = wxSysInfo.screenHeight / this._ccCvsH;
        this._wx2ccScale = this._ccCvsH / wxSysInfo.screenHeight;
        this._minCCWidth = 320 * this._wx2ccScale;
    }

    hasHide: boolean;


    _getBannerStyle_withNode(node) {

        if (node.width < this._minCCWidth) node.width = this._minCCWidth;
        if (node.width > this._ccCvsW) node.width = this._ccCvsW;
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        console.log("根据节点创建的广告条的node", pos)
        let style = { left: (pos.x - node.width * node.anchorX) * this._cc2wxScale, top: ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale, width: node.width * this._cc2wxScale, };
        return style;
    }


    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        console.log("[ToutiaoAdCtrler][showWithNode]");
        this.showBannerAd(adUnitId, node, onShow);
    }

    test(node: cc.Node) {
        console.log("showWithNodeTest")
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let info = tt.getSystemInfoSync();
        let node1 = cc.instantiate(node);
        node1.color = cc.Color.YELLOW;
        node1.parent = node.parent;
        let y = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;
        console.log("yyyy", y)
        let x = node.x;
        let pos1 = node1.parent.convertToNodeSpaceAR(cc.v2(x, y));
        console.log("pos1", pos1)
        node1.position = cc.v2(0, pos1.y)
    }

    showWithStyle(adUnitId: string, bStyle?: BannerADStyle, onShow?: () => void) {
        console.log("[ToutiaoAdCtrler][showWithStyle]");
        var res = tt.getSystemInfoSync();
        var width = res.screenWidth;
        var height = res.screenHeight;
        let style = {
            left: (width - 250) / 2,
            top: height - 200,
            width: 250,
        }
        this.showBannerAd(adUnitId, style, onShow);
    }

    hide() {

        this.hideBannerAd();
    }

    destroy() {
        if (this.bannerAdNew != null) {
            console.error("toutiao销毁广告条", this.bannerAdNew)
            this.bannerAdNew.destroy();
            this.bannerAdNew = null;
        }
    }

    resizeCount: 0;
    showBannerAd(adUnitId, styleOrNode, onShow) {
        // console.log("传进来的styleOrNode", styleOrNode);
        this.resizeCount = 0;
        this.hasHide = false;
        if (typeof (styleOrNode) != "number") {
            styleOrNode.active = true;
            styleOrNode.opacity = 0;
        }

        if (tt.createBannerAd) {
            if (!this.bannerAdNew) {
                var style = null;
                var res = tt.getSystemInfoSync();
                var width = res.screenWidth;
                var height = res.screenHeight;
                if (!styleOrNode) {
                    style = {
                        left: (width - 300) / 2,
                        top: height - 200,
                        width: 300,
                    }
                } else {
                    style = typeof (styleOrNode.top) === "number" ? styleOrNode : this._getBannerStyle_withNode(styleOrNode);
                }
                console.log("common实际的style2", style);
                this.bannerAdNew = tt.createBannerAd({
                    adUnitId: adUnitId,
                    style: {
                        left: style.left,
                        top: style.top,
                        width: style.width,
                    }
                })
                console.log("common创建的广告条实例", this.bannerAdNew);
                this.bannerAdNew.onLoad(() => {
                    console.log("完成广告条的加载");
                    // this.bannerAdNew.style.top = height - (this.bannerAdNew.style.width / 16 * 9);
                    // // banner.style.left = (windowWidth - res.width) / 2;
                    // this.bannerAdNew.style.left = (width - this.bannerAdNew.style.width) / 2;
                    if (onShow) {
                        onShow()
                    }
                    if (this.hasHide) return;
                    this.bannerAdNew.show();
                })

                this.bannerAdNew.onError((err) => {
                    console.log('广告素材拉取失败', err);
                    this.bannerAdNew.destroy();
                    this.bannerAdNew = null;
                })
                this.bannerAdNew.onResize((res) => {
                    console.log("广告条尺寸发生改变", height, width, res, this.resizeCount);
                    if (this.resizeCount >= 2) return;
                    this.resizeCount++;
                    this.bannerAdNew.style.top = height - res.height;
                    this.bannerAdNew.style.left = (width - res.width) / 2;
                })
            } else {
                if (onShow) {
                    onShow();
                }
                if (this.hasHide) return;
                this.bannerAdNew.show();
            }
        }
    }

    //隐藏广告条
    hideBannerAd() {
        if (this.bannerAdNew != null) {
            console.log("toutiao隐藏广告条", this.bannerAdNew)
            this.bannerAdNew.hide();
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
        console.log("[ToutiaoBannerProxy][constructor]", banner);
        banner.onLoad(this._onLoad.bind(this));
        banner.onError(this._onError.bind(this));
        banner.onResize(this._onResize.bind(this));
    }
    protected _onLoad() {
        if (!this._onBannerLoad)
            return console.log("[ToutiaoBannerProxy][onLoad] onBannerLoad is null");

        console.log("[ToutiaoBannerProxy][onLoad]");
        this._onBannerLoad();
        console.log("[ToutiaoBannerProxy][onLoad]", this._banner);
        this._banner.show();
        this._onBannerLoad = null;
        this._onBannerError = null;
    }
    protected _onError(e) {
        if (!this._onBannerError)
            return console.log("[ToutiaoBannerProxy][onError] onBannerError is null");

        console.error("[ToutiaoBannerProxy][onError]", e);
        this._onBannerError(e, this);
        this.dispose();

    }
    protected _onResize(style: wx.BannerAd.onResize_res) {
        if (!this._onBannerResize)
            return console.log("[ToutiaoBannerProxy][onResize] onBannerResize is null");

        console.log("[ToutiaoBannerProxy][onResize]");
        this._onBannerResize(this._banner, style);
        this._onBannerResize = null;
    }
    reuse(width: number, onBannerResize: WxBannerProxy.OnResize) {
        console.log("[ToutiaoBannerProxy][reuse]");
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
        console.log("[ToutiaoBanner][constructor]", this);
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

interface TTMoreGamesButton {
    /**监听按钮点击事件 */
    onTap(cb: fw.cb): void;
    /**移除 onTap 绑定的监听函数 */
    offTap(cb: fw.cb): void;
    /**销毁按钮 */
    destroy(): void;
    /**显示按钮 */
    show(): void;
    /**隐藏按钮 */
    hide(): void;

}