import IADCtrler, { VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
declare var wb:any;
export default class SinaAdCtrler implements IADCtrler {
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[WbAdCtrler][ctor]", idDict);
        this.bannerC = this._createBannerCtrler();
    }

    setBid(bid: string) {

    }

    //#region [video]

    lastVideoPlayTime: number;


    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        if (!(window["wb"] && window["wb"].createRewardedVideoAd))
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新微博版本", VideoADFailCode.NOT_SUPPORT);
        if (Date.now() - this.lastVideoPlayTime < 1000)
            return onPlayEnd && onPlayEnd("视频广告还在准备中，请稍后尝试", VideoADFailCode.NOT_READY);
        let adUnitId = this.idDict[type];
        if (!adUnitId) adUnitId = this.idDict["defaultv"];
        if (!adUnitId) return onPlayEnd && onPlayEnd("未知广告类型v:" + type, VideoADFailCode.UNKNOW_TYPE);
        console.log("[WbAdCtrler][showVideoAD]", adUnitId);
        wb.createRewardedVideoAd({
            adUnitId: adUnitId,
            onError: function (res) {
                console.log(res.wbcode);
                console.log(res.wbmsg);
                if (res.wbcode === -1) {
                    onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
                } else if (res.wbcode === -2) {
                    onPlayEnd && onPlayEnd("今天的广告看完了", VideoADFailCode.AD_ERROR);
                }

            },
            onClose: function (res) {
                console.log(res.isEnded);
                let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
                onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
            }
        });

    }

    //#endregion [video]

    //#region [banner]

    bannerC: WbBannerCtrler;

    _createBannerCtrler() { return new WbBannerCtrler(); }
    _checkAndGetId(type: string): string | void {
        if (typeof wb.createBannerAd !== "function") return console.log("stop call banner ad, typeof wb.createBannerAd is not function");
        this.bannerC.hide();
        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);

        return adUnitId;
    }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        if (fw.bb.bms_launchConfig.value.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithNode(adUnitId, node, onShow);
    }
    showBannerAd_withStyle(type: string, style: WbBannerADStyle, onShow: () => void, args?: any) {
        if (fw.bb.bms_launchConfig.value.isAuditing === 1) return;
        let adUnitId = this._checkAndGetId(type)
        if (!adUnitId) return;
        this.bannerC.showWithStyle(adUnitId, style, onShow);
    }
    hideBannerAd() { WbBannerCtrler.hasHide = true; this.bannerC.hide(); }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: WbBannerADStyle, args?: any) {
        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);
        return <any>this.bannerC.createRealBanner(adUnitId, style);
    }

    /** 转换Banner广告的Style格式
     * @param style.width [广告宽度|默认300] 非法值(超过300-375)会作裁剪
     * @param style.bottom [底部对齐|默认0] 传入距离底部的高度(微信的像素单位), 非法值会调整到屏幕内
     * @param style.top [顶部对齐|默认不执行|会覆盖前一参数] 距离顶部的高度(微信的像素单位), 非法值会调整到屏幕内
     */
    static createBannerStyle_withStyle(style: WbBannerADStyle = {}) {
        let { screenWidth, screenHeight } = wb.getSystemInfoSync();
        if (!style.width) style.width = 300; // 300-375
        if (style.width < 300) style.width = 300; if (style.width > screenWidth) style.width = screenWidth;
        let height = style.width * 0.285;
        let maxTop = screenHeight - height;
        if (!style.top) style.top = maxTop - (style.bottom || 0);
        if (style.top < 0) style.top = 0; if (style.top > maxTop) style.top = maxTop;
        return { gravity: 7, left: 0, bottom: 0, width: screenWidth, height: 200 };
    }

    //#endregion [banner]
}

export class WbBannerCtrler {

    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;

    protected _adUnitId;

    constructor() {
        let wxSysInfo = wb.getSystemInfoSync();
        this._wxSrnW = wxSysInfo.screenWidth;
        this._wxSrnH = wxSysInfo.screenHeight;
        this._ccCvsW = cc.Canvas.instance.node.width;
        this._ccCvsH = cc.Canvas.instance.node.height;
        this._cc2wxScale = wxSysInfo.screenHeight / this._ccCvsH;
        this._wx2ccScale = this._ccCvsH / wxSysInfo.screenHeight;
        this._minCCWidth = 300 * this._wx2ccScale;
    }

    public static hasHide: boolean;

    createRealBanner(adUnitId: string, style: WbBannerADStyle, onShow?: () => void) {
        let sysInfo = wb.getSystemInfoSync();
        console.log("showWithNode", sysInfo,adUnitId);
        wb.createBannerAd({
            adUnitId: adUnitId,
            success: (res) => {
                this._adUnitId = res.adUnitId;
                if (WbBannerCtrler.hasHide) return;
                wb.bannerAdShow({
                    adUnitId: res.adUnitId,
                    style: {
                        left: 0,
                        top: sysInfo.windowHeight - res.style.height,
                        width: res.style.width,
                        height:res.style.height
                    },
                    success: (res) => {
                        console.log("[wb.bannerAdShow][success]", res.wbcode, res.wbmsg);
                    },
                    fail: (res) => {
                        console.log("[wb.bannerAdShow][fail]", res.wbcode, res.wbmsg);
                    }
                });
            },
            fail: (res) => {
                console.log("[wb.createBannerAd][fail]", res.wbcode, res.wbmsg);
            }
        });
    }

    protected _show(adUnitId: string, style: WbBannerADStyle, onShow: () => void) {
        if (WbBannerCtrler.hasHide) return;
        // if (this._adUnitId) {
        //     onShow && onShow();
        //     wb.bannerAdShow({ adUnitId: this._adUnitId});
        //     return;
        // }
        this.createRealBanner(adUnitId, style, onShow);
    }

    showWithNode(adUnitId: string, node: cc.Node, onShow: () => void) {
        WbBannerCtrler.hasHide = false;
        if (node.width < this._minCCWidth) node.width = this._minCCWidth;
        if (node.width > this._ccCvsW) node.width = this._ccCvsW;
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let left = (pos.x - node.width * node.anchorX) * this._cc2wxScale;
        let width = node.width * this._cc2wxScale;
        let height = node.height * this._cc2wxScale;
        let top = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;

        this._show(adUnitId, { width: width, left: left, top: top, height: height }, onShow);
    }

    showWithStyle(adUnitId: string, bStyle?: WbBannerADStyle, onShow?: () => void) {
        WbBannerCtrler.hasHide = false;
        let wxSysInfo = wb.getSystemInfoSync();
        this._show(adUnitId, bStyle, onShow);
    }

    hide() {
        console.log("[WbBanner][hide]");
        if (this._adUnitId) {
            wb.bannerAdHide({ adUnitId: this._adUnitId });
        }
    }

    destroy() {
        console.log("[WbBanner][destroy]");
        if (this._adUnitId) {
            wb.bannerAdDestroy({ adUnitId: this._adUnitId });
            this._adUnitId = null;
        }
    }


}
type WbBannerADStyle = {
    gravity?: number // 0:左上 1： 顶部居中 2：右上  3：左边垂直居中 4：居中 5：右边垂直居中 6：左下 7：底部居中 8：右下 （默认为0）
    left?: number, // 左 边 margin 
    top?: number, // 顶 部 margin 
    bottom?: number, // 底部margin 
    right?: number, // 右 边 margin 
    width?: number,
    height?: number,//如果不设置高度，会按比例适配
}
