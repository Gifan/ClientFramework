import IADCtrler, { BannerADStyle, IBanner } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";

export default class QQPlayAdCtrler implements IADCtrler {
    constructor() {
        BK.Advertisement.fetchBannerAd((retCode: number, msg, adBannerHandle: BK.AdBannerHandler) => {
            if (retCode != 0) return console.error("[QQPlayAdCtrler][fetchBannerAd] fail : " + retCode + ", " + msg);
            adBannerHandle.onClickContent(() => console.log("[QQPlayAdCtrler][fetchBannerAd] user click content"));
            adBannerHandle.onClickClose(() => console.log("[QQPlayAdCtrler][fetchBannerAd] user click close"));
            this.adBannerHandle = adBannerHandle;
        });
    }
    setBid(bid: string) {

    }
    showVideoAD(onPlayEnd: (notCplReason?: string) => void) {
        this.isCpl = null;
        var videoType = 0; //激励视频广告场景 0.游戏页面挂件广告 1.游戏结算页广告 2.游戏任务广告  3.游戏复活广告 
        BK.Advertisement.fetchVideoAd(videoType, (retCode, msg, handle) => { // retCode 返回错误码, msg 返回信息, handle 广告句柄 
            if (retCode != 0) return onPlayEnd && onPlayEnd("拉取视频广告失败"); // 返回码0表示成功 
            handle.setEventCallack(
                null, // (code, msg) => this.printMsg("关闭游戏（不再使用不需要监听）, " + "code:" + code + " msg:" + msg),
                (code, msg) => this.isCpl = true, // (code, msg) => this.printMsg("达到看广告时长要求，可以下发奖励, " + "code:" + code + " msg:" + msg),
                (code, msg) => { onPlayEnd && onPlayEnd(this.isCpl ? "" : "请完整看15秒视频"); this.isCpl = null }, // (code, msg) => this.printMsg("关闭视频, " + "code:" + code + " msg:" + msg),
                null, // (code, msg) => this.printMsg("开始播放视频, " + "code:" + code + " msg:" + msg),
            );
            handle.jump();
        });
    }
    isCpl: boolean;

    adBannerHandle: BK.AdBannerHandler;
    hasBannerAdClosed: boolean = true;
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) { this._showBannerAd(onShow); }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) { this._showBannerAd(onShow); }
    _showBannerAd(onShow: () => void) {
        if (!this.hasBannerAdClosed) return;
        this.hasBannerAdClosed = false;
        this.adBannerHandle && this.adBannerHandle.show((succCode, msg, handle) => {
            if (succCode != 0) return console.error("[QQPlayAdCtrler][showBannerAd] fail : " + succCode + ", " + msg);
            if (this.hasBannerAdClosed) this.adBannerHandle && this.adBannerHandle.close();
            else onShow && onShow();
        });

        return;
        BK.Script.loadlib("GameRes://script/core/build/qqPlayCore.js");
        BK.Advertisement.fetchBannerAd(function (retCode, msg, adBannerHandle) {
            if (retCode == 0) {
                //2.开发者 使用adBannerHanlde 
                //2.1 决定是否展示
                adBannerHandle.show(function (succCode, msg, handle) {
                    if (succCode == 0) {
                        //
                    }
                    else {
                        BK.Script.log(1, 1, "展示失败 msg:" + msg);
                    }
                });
                //2.2 开发者主动关闭广告。
                //adBannerHandle.close(); 
                //2.3 开发者监听事件
                adBannerHandle.onClickContent(function () {
                    //用户点击了落地页
                });
                adBannerHandle.onClickClose(function () {
                    //用户点击了X关闭广告
                });
            }
            else {
                BK.Script.log(1, 1, "fetchBannerAd failed. retCode:" + retCode);
            }
        }.bind(this));
    }
    hideBannerAd() {
        if (this.hasBannerAdClosed) return;
        this.hasBannerAdClosed = true;
        this.adBannerHandle && this.adBannerHandle.close();
    }
    destoryBannerAd() { this.hideBannerAd(); }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any): QQPlayBanner {
        return null;
    }
}
class QQPlayBanner implements IBanner {
    constructor(
        adUnitId: string,
        style?: BannerADStyle
    ) {
        this._bannerAd = typeof wx.createBannerAd === "function" && wx.createBannerAd({
            adUnitId: adUnitId,
            style: WxAdCtrler.createBannerStyle_withStyle(style),
        });
        if (!this._bannerAd) return;
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
