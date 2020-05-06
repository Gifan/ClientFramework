import { BaseSdk, VideoAdCode, ShareType } from "../BaseSdk"
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";

declare let tt: any;

export default class ByteDance extends BaseSdk {
    private _bannerAd: any = null;
    public init(appId: string) {
        super.init(appId);
        tt && tt.showShareMenu({ withShareTicket: true });
    }
    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve();
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    private _showBannerNum: number = 0;
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void): void {
        console.log("showBannerWithStyle",tt.createBannerAd)
        if (!this._isByteDancePlatform || !tt.createBannerAd) { console.log("not support"); return; };
        const { windowWidth, windowHeight } = tt.getSystemInfoSync();
        var targetBannerAdWidth = 208;
        this._showBannerNum++;
        if (!this._bannerAd) {
            // 创建一个居于屏幕底部正中的广告
            this._bannerAd = tt.createBannerAd({
                adUnitId: adId,
                adIntervals: 30,
                style: {
                    width: targetBannerAdWidth,
                    top: windowHeight - (targetBannerAdWidth / 16) * 9 // 根据系统约定尺寸计算出广告高度
                }
            });
            // 也可以手动修改属性以调整广告尺寸
            this._bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;

            // 尺寸调整时会触发回调，通过回调拿到的广告真实宽高再进行定位适配处理
            // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
            this._bannerAd.onResize(size => {
                this._bannerAd.style.top = windowHeight - size.height;
                this._bannerAd.style.left = (windowWidth - size.width) / 2;
            });
            this._bannerAd.onLoad(() => {
                onshow && onshow();
                if (this._showBannerNum > 0)
                    this._bannerAd.show().then(() => {
                        console.log("广告展示成功");

                    }).catch(err => {
                        console.error("广告组件出现问题", err);
                        this._showBannerNum--;
                        if (this._showBannerNum < 0) this._showBannerNum = 0;
                    })
            });
        } else {
            if (this._showBannerNum <= 1) {
                this._bannerAd.show().then(() => {
                    console.log("广告展示成功");
                }).catch(err => {
                    console.error("广告组件出现问题", err);
                    this._showBannerNum--;
                    if (this._showBannerNum < 0) this._showBannerNum = 0;
                })
            }
        }
    }
    public hideBanner(): void {
        this._showBannerNum--;
        if (this._showBannerNum <= 0) {
            this._showBannerNum = 0;
            this._bannerAd && this._bannerAd.hide();
        }
    }
    public destroyBanner(): void {
        this._bannerAd.destroy();
        this._bannerAd = null;
    }

    private lastVideoPlayTime: number = 0;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        if (!this._isByteDancePlatform || !tt.createRewardedVideoAd) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新头条版本");
        }
        if (Date.now() - this.lastVideoPlayTime < 1000) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_READY, "视频广告还在准备中，请稍后尝试");
            return;
        }
        let videoAd = tt.createRewardedVideoAd({ adUnitId: adId });
        if (!videoAd) { onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新头条版本"); return; }
        SdkAudioAdapter.pauseMusic();
        let onClose = res => {
            SdkAudioAdapter.resumeMusic();
            videoAd.offClose(onClose);
            if (res && res.isEnded || res === undefined) {
                onPlayEnd && onPlayEnd(VideoAdCode.COMPLETE, "")
            } else {
                onPlayEnd && onPlayEnd(VideoAdCode.NOT_COMPLITE, "未完整观看视频广告");
            }
        }
        videoAd.onClose(onClose);
        videoAd.load().then(() => {
            videoAd.show().catch(err => {
                onPlayEnd && onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
            })
        }).catch(e => {
            videoAd.offClose(onClose);
            SdkAudioAdapter.resumeMusic();
            onPlayEnd && onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
        })
    }
    public sendEvent(key: string, param: any): void {

    }
    public share(type:ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {
        if (param) {
            tt.shareAppMessage({
                channel: param.channel || "article",
                extra: param.extra,
                title: param.title,
                imageUrl: param.imageUrl,
                success: () => {
                    success && success();
                },
                fail: (e) => {
                    fail && fail(e);
                }
            })
        }
    }

    public showInsertAd(adId: string) {
        const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
        // 插屏广告仅今日头条安卓客户端支持
        if (isToutiaio && tt.createInterstitialAd) {
            const interstitialAd = tt.createInterstitialAd({
                adUnitId: adId
            });
            interstitialAd
                .load()
                .then(() => {
                    interstitialAd.show();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    private get _isByteDancePlatform(): boolean {
        return typeof (tt) != 'undefined';
    }

    public vibrate(type: number = 0) {
        if (type == 0) {
            tt.vibrateShort({
                success(res) {
                    console.log(`${res}`);
                },
                fail(res) {
                    console.log(`vibrateShort调用失败`);
                }
            });
        } else {
            tt.vibrateLong({
                success(res) {
                    console.log(`${res}`);
                },
                fail(res) {
                    console.log(`vibrateLong调用失败`);
                }
            });
        }
    }


}