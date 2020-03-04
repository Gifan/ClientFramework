import IADCtrler, { VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
let common = require('zqddn_zhb_Common');
let _uc = window["uc"] as ucAdApi;
declare var uc:any;
type ucAdApi = {
    createBannerAd(style: wx.BannerAd.create_style): wx.BannerAd;
    createRewardVideoAd(): wx.RewardedVideoAd;
}
export default class H5_UCAdCtrler implements IADCtrler {
    constructor(protected idDict: { [type: string]: string }) {
        console.log("[UCAdCtrler][ctor]", idDict);
        this.bannerC = this._createBannerCtrler();
    }

    setBid(bid: string) {

    }

    //#region [video]

    lastVideoPlayTime: number;


    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        if (!_uc.createRewardVideoAd)
            return onPlayEnd && onPlayEnd("不支持视频广告，请更新UC版本", VideoADFailCode.NOT_SUPPORT);

        if (Date.now() - this.lastVideoPlayTime < 1000)
            return onPlayEnd && onPlayEnd("视频广告还在准备中，请稍后尝试", VideoADFailCode.NOT_READY);

        let videoAd = _uc.createRewardVideoAd();
        if (!videoAd) return onPlayEnd && onPlayEnd("不支持视频广告，请更新UC版本:" + type, VideoADFailCode.NOT_SUPPORT);
        this.lastVideoPlayTime = Date.now();
        let onClose: fw.cb1<wx.RewardedVideoAd.onClose_res> = res => {
            console.log("[UCAdCtrler][videoAd][onClose]", res);
            videoAd.offClose(onClose);

            let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
            onPlayEnd && onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
        }
        let onError: fw.cb1<wx.RewardedVideoAd.onError_res> = res => {
            console.log('激励视频 广告加载失败', res)
            videoAd.offClose(onClose);
            videoAd.offError(onError);
            videoAd.offLoad(onLoad);

            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        }
        let onLoad: fw.cb = () => {
            console.log('激励视频 广告加载成功，准备播放')
            videoAd.offError(onError);
            videoAd.offLoad(onLoad);

        }
        videoAd.onError(onError)
        videoAd.onLoad(onLoad)
        videoAd.onClose(onClose);
        videoAd.load().then(() => videoAd.show()).catch(e => {
            console.error("[UCAdCtrler][showVideoAD] error", e);
            videoAd.offClose(onClose);
            onPlayEnd && onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        });

        // let videoAd = uc.createRewardVideoAd();

        // videoAd.onLoad(() => {
        //     console.log('激励 广告加 成功')
        // })
        // videoAd.onError(err => {
        //     console.log('激励 广告加失败', err)
        // })

        // videoAd.onClose((res) => { // 用 点 了【关 广告】按
        //     if (res && res.isEnded) {
        //         // 正常播放 束，可以下 游 励
        //         console.log('激励视频广告完成，发放奖励')
        //         cc.game.emit("unityAds1"); //通知游戏界面过关动画开始
        //     } else {
        //         console.log('激励视频广告取消关闭，不发放奖励')
        //         cc.game.emit("unityAds0"); //通知游戏界面过关动画开始
        //         // 播放中途退出，不下 游 励 }
        //     }
        // })
        // videoAd.show();
    }

    //#endregion [video]

    //#region [banner]

    bannerC: UCBannerCtrler;

    _createBannerCtrler() { return new UCBannerCtrler(); }

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void, notNeedCreate?: any) {
        if (common.isAuditing === 1) return;
        this.bannerC.showWithNode(node, onShow);
    }
    showBannerAd_withStyle(type: string, style: UCBannerADStyle, onShow: () => void, args?: any) {
        if (common.isAuditing === 1) return;
        this.bannerC.showWithStyle(style, onShow);
    }
    hideBannerAd() { UCBannerCtrler.hasHide = true; this.bannerC.hide(); }
    destoryBannerAd() { this.bannerC.destroy(); }

    createBannerAd(type?: string, style?: UCBannerADStyle, args?: any) {
        let adUnitId = this.idDict[type];
        // if (!adUnitId) return fw.ui.showToast("未知广告类型b:" + type);
        return <any>this.bannerC.createRealBanner(style);
    }

    /** 转换Banner广告的Style格式
     * @param style.width [广告宽度|默认300] 非法值(超过300-375)会作裁剪
     * @param style.bottom [底部对齐|默认0] 传入距离底部的高度(微信的像素单位), 非法值会调整到屏幕内
     * @param style.top [顶部对齐|默认不执行|会覆盖前一参数] 距离顶部的高度(微信的像素单位), 非法值会调整到屏幕内
     */
    static createBannerStyle_withStyle(style: UCBannerADStyle = {}) {
        let { screenWidth, screenHeight } = uc.getSystemInfoSync();
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

export class UCBannerCtrler {



    protected _banner;

    constructor() {

    }

    public static hasHide: boolean;

    createRealBanner(style: UCBannerADStyle, onShow?: () => void) {
        // console.log("createRealBanner")
        // let bannerAd = uc.createBannerAd({
        //     style: {
        //         gravity: 7, // 0:左上 1： 顶部居中 2：右上3：左边垂直居中 4：居中 5：右边垂直居中 6：左下 7：底部居中 8：右下 （默认为0）
        //         left: 0, // 左 边 margin 
        //         bottom: 0, // 底部margin 
        //         width: cc.winSize.width,
        //         height: 200,//如果不设置高度，会按比例适配
        //     }
        // })
        // bannerAd.show()
        // return;
        console.log("parm", style);
        this._banner = uc.createBannerAd({ style: style });
        console.log("uc广告条实例", this._banner);
        this._banner.onLoad(() => {
            console.log("[UCBanner][onLoad]");
            onShow && onShow();
        })
        this._banner.onError((err) => {
            onShow && onShow();
            this.destroy();
            console.log(' banner 广告错误', err);
        })
        this._banner.show();
    }

    protected _show(style: UCBannerADStyle, onShow: () => void) {
        if (this._banner) {
            onShow && onShow();
            this._banner.show();
            return;
        }
        this.createRealBanner(style, onShow);
    }

    showWithNode(node: cc.Node, onShow: () => void) {
        UCBannerCtrler.hasHide = false;
        let wxSysInfo = uc.getSystemInfoSync();
        console.log("showWithNode1", wxSysInfo);
        console.log("showWithNode2", wxSysInfo.screenWidth, wxSysInfo.screenHeight, wxSysInfo.pixelRatio, wxSysInfo.windowHeight);
        this._show({ gravity: 7, left: 0, bottom: 0, width: wxSysInfo.screenWidth, height: 200 }, onShow);
    }

    showWithStyle(bStyle?: UCBannerADStyle, onShow?: () => void) {
        UCBannerCtrler.hasHide = false;
        let wxSysInfo = uc.getSystemInfoSync();
        this._show({ gravity: 7, left: 0, bottom: 0, width: wxSysInfo.screenWidth, height: 200 }, onShow);
    }

    hide() {
        console.log("[UCBanner][hide]", this._banner);
        if (this._banner) {
            this._banner.hide()
        }
    }

    destroy() {
        console.log("[UCBanner][destroy]", this._banner);
        if (this._banner) {
            this._banner.hide();
            this._banner.destroy();
            this._banner = null;
        }
    }


}
type UCBannerADStyle = {
    gravity?: number // 0:左上 1： 顶部居中 2：右上  3：左边垂直居中 4：居中 5：右边垂直居中 6：左下 7：底部居中 8：右下 （默认为0）
    left?: number, // 左 边 margin 
    top?: number, // 顶 部 margin 
    bottom?: number, // 底部margin 
    right?: number, // 右 边 margin 
    width?: number,
    height?: number,//如果不设置高度，会按比例适配
}
