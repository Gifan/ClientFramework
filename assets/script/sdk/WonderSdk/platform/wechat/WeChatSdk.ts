import { BaseSdk, VideoAdCode, ShareType, ShareListType } from "../BaseSdk";
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
declare let wx: any;
export class WeChatSdk extends BaseSdk {
    private _bannerAd: any = null;
    public init(appId: string) {
        super.init(appId);
        wx.showShareMenu({ withShareTicket: true });
    }

    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve();
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow)
    }
    private _showBannerNum: number = 0;
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void): void {
        const { screenWidth, screenHeight } = wx.getSystemInfoSync();
        let targetBannerAdWidth = screenWidth;
        this._showBannerNum++;
        if (!this._bannerAd) {
            this._bannerAd = wx.createBannerAd({
                adUnitId: adId,
                style: {
                    width: targetBannerAdWidth,
                    // top: windowHeight - (targetBannerAdWidth / 16) * 9
                }
            });

            this._bannerAd.onResize(size => {
                console.log("onResize = ", size);
                this._bannerAd.style.top = screenHeight - size.height;
                this._bannerAd.style.left = (screenWidth - size.width) * 0.5;
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
                    onshow && onshow();
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

    }
    private lastVideoPlayTime: number = 0;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        if (!wx.createRewardedVideoAd) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新头条版本");
        }
        if (Date.now() - this.lastVideoPlayTime < 1000) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_READY, "视频广告还在准备中，请稍后尝试");
            return;
        }
        let videoAd = wx.createRewardedVideoAd({ adUnitId: adId });
        if (!videoAd) { onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新wx版本"); return; }
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
    public share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {
        if (this._shareList[type] && this._shareList[type].length > 0) {
            let min = 0;
            let max = this._shareList[type].length;
            let index = min + Math.floor(Math.random() * (max - min));
            let data = this._shareList[type][index];
            this._fakeShareTime_temp = Date.now();
            this._fakeShareCbSuccess_temp = success;
            this._fakeShareCbFail_temp = fail;
            wx.onShow(this._fakeCb_bind);
            setTimeout(() => {
                wx.shareAppMessage({
                    title: data.title,
                    imageUrl: data.image,
                    success: (res) => {
                    },
                    fail: (err) => {
                    }
                }, 2)
            });

        } else {
            fail && fail("找不到对应分享信息");
        }
    }

    private _fakeCb_bind = this._fakeCb.bind(this);
    private _fakeShareTime_temp: number;
    private _fakeShareCbSuccess_temp: Function;
    private _fakeShareCbFail_temp: Function;
    private delay: number = 2500;
    private _fakeCb() {
        wx && wx.offShow(this._fakeCb_bind);
        let timeUp = Date.now() - this._fakeShareTime_temp >= this.delay;
        if (timeUp) {
            this._fakeShareCbSuccess_temp && this._fakeShareCbSuccess_temp();
        } else {
            this._fakeShareCbFail_temp && this._fakeShareCbFail_temp();
        }
    }

    public showInsertAd(adId: string) {
        try {
            if (wx && wx.createInterstitialAd) {
                let interstitialAd = wx.createInterstitialAd({
                    adUnitId: adId
                });
                let onclose = () => {
                    if (interstitialAd) {
                        interstitialAd.offClose(onclose);
                        interstitialAd.destroy();
                        interstitialAd = null;
                    }
                }
                interstitialAd.onClose(onclose);
                interstitialAd.load().then(() => {
                    interstitialAd.show().then(() => {
                    }).catch(err => {
                        console.log("插屏失败", err);
                    });
                })
                    .catch(err => {
                        console.log(err);
                    });
            }
        } catch (error) {
            console.error(error);
        }

    }

    private _appBox: any = null;
    private _hasAppBox: boolean = false;
    public createAppBox(adId: string, node?: any) {
        if (!wx.createAppBox) {
            node && (node.active = false);
            return;
        }
        if (this._hasAppBox) return;
        this._appBox = wx.createAppBox({
            adUnitId: adId,
        });
        this._appBox.load().then(() => {
            console.log("wx appbox load success");
            this._hasAppBox = true;
            node && (node.active = true);
        }).catch(e => { console.log("appbox load fail", e) });
    }

    public showAppBox(adId: string) {
        if (this._hasAppBox) {
            this._appBox.show().then(() => {
                console.log("showAppBox success");
            }).catch(e => {
                console.log("showAppBox fail", e);
            });
        }
    }

    public setShareList(list: Array<ShareListType>) {
        for (let i = 0, len = list.length; i < len; i++) {
            let data: ShareListType = list[i];
            if (!this._shareList[data.position]) {
                this._shareList[data.position] = [];
            }
            this._shareList[data.position].push(data);
        }
        if (this._shareList[ShareType.SHARE_NORMAL].length > 0) {
            let data = this._shareList[ShareType.SHARE_NORMAL][0];
            wx.onShareAppMessage(() => ({
                title: data.title,
                imageUrl: data.image // 图片 URL
            }))
        }
    }

    public vibrate(type: number = 0) {
        if (type == 0) {
            wx.vibrateShort({
                success(res) {
                    console.log(`${res}`);
                },
                fail(res) {
                    console.log(`vibrateShort调用失败`);
                }
            });
        } else {
            wx.vibrateLong({
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