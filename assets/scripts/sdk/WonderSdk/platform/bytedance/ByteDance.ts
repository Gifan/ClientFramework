import { BaseSdk, VideoAdCode, ShareType } from "../BaseSdk"
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
import { VideoIdList, EPlatform } from "../../config/SdkConfig";
var ttTalentCommon = require('ttTalentCommon');

declare let tt: any;

export default class ByteDance extends BaseSdk {
    private _bannerAd: any = null;
    public init(appId: string) {
        super.init(appId);
        tt && tt.showShareMenu({ withShareTicket: true });

        tt && tt.onShareAppMessage(function (d) {
            if (d && d.channel == "video") {
                return {
                    channel: 'video',
                    title: "飞刀弹弹弹",
                    imageUrl: "",
                    query: ttTalentCommon.drType == 'promote' ? (`dr_pid=${ttTalentCommon.drPid}&dr_type=share&pre_video_id=${ttTalentCommon.preVideoId}`) : "",
                    extra: {
                        withVideoId: true
                    },
                    success(e) {
                        console.warn("分享成功", e);
                        if (ttTalentCommon.drType == 'promote') { //达人
                            ttTalentCommon.uploadVideoId({
                                dr_pid: ttTalentCommon.drPid,
                                bms_app_name: wonderSdk.BMS_APP_NAME,
                                video_id: e.videoId,
                                pre_video_id: ttTalentCommon.preVideoId,
                                open_id: ttTalentCommon.promoteOpenId ? ttTalentCommon.promoteOpenId : ""
                            });
                            ttTalentCommon.getPreVideoId(ttTalentCommon.drPid);
                        }
                    },
                    fail(e) {
                        console.warn("分享失败", e);
                    },
                };
            } else {
                return {
                    title: "飞刀弹弹弹",
                    query: "k1=v1&k2=v2",
                    templateId: "16fmalu0fux1hlf2cg",
                    success() {
                        //   console.log("分享成功");
                    },
                    fail(e) {
                        //   console.log("分享失败", e);
                    },
                };
            }
        });

        if (tt.getUpdateManager) {
            const updateManager = tt.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                // console.log("onCheckForUpdate", res.hasUpdate);
                if (res.hasUpdate) {
                    tt.showToast({
                        title: "即将有更新请留意"
                    });
                }
            });

            updateManager.onUpdateReady(() => {
                tt.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否立即使用？",
                    success: function (res) {
                        if (res.confirm) {
                            // 调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        } else {
                            tt.showToast({
                                icon: "none",
                                title: "小程序下一次「冷启动」时会使用新版本"
                            });
                        }
                    }
                });
            });

            updateManager.onUpdateFailed(() => {
            });
        }
    }
    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            success && success(null);
            resolve(null);
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    private _showBannerNum: number = 0;
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: () => void): void {
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
            setTimeout(() => {
                this._bannerAd && this._bannerAd.hide();
            }, 200);
        }
    }
    public destroyBanner(): void {
        this._bannerAd.destroy();
        this._bannerAd = null;
    }

    private _videoAd = null;
    private ispreLoadVideo: boolean = false;
    public preLoadRewardVideo() {
        if (tt && tt.createRewardedVideoAd) {
            this._videoAd = tt.createRewardedVideoAd({ adUnitId: VideoIdList[EPlatform.BYTE_DANCE][0] });
            this.ispreLoadVideo = true;
            // console.log("预加载");
        }
    }

    private lastVideoPlayTime: number = 0;
    private _onPlayEnd: Function = null;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        this._onPlayEnd = null;
        this._onPlayEnd = onPlayEnd;
        if (!this._isByteDancePlatform || !tt.createRewardedVideoAd) {
            this._onPlayEnd && this._onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新头条版本");
            return;
        }
        if (Date.now() - this.lastVideoPlayTime < 1000) {
            this._onPlayEnd && this._onPlayEnd(VideoAdCode.NOT_READY, "视频广告还在准备中，请稍后尝试");
            return;
        }
        let onClose = res => {
            SdkAudioAdapter.resumeMusic();
            if (res && res.isEnded || res === undefined) {
                ttTalentCommon.playVideoEnd();
                this._onPlayEnd && this._onPlayEnd(VideoAdCode.COMPLETE, "");
            } else {
                this._onPlayEnd && this._onPlayEnd(VideoAdCode.NOT_COMPLITE, "未完整观看视频广告");
            }
        }
        SdkAudioAdapter.pauseMusic();
        if (this.ispreLoadVideo && this._videoAd) {
            this._videoAd.onClose(onClose);
            this._videoAd.show().then(() => {
                console.log("视频广告展示");
                ttTalentCommon.playVideoShow();
            }).catch(err => {
                console.log(err);
                SdkAudioAdapter.resumeMusic();
                this._onPlayEnd && this._onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
            })
            this.ispreLoadVideo = false;
        } else {
            if (!this._videoAd) {
                this._videoAd = tt.createRewardedVideoAd({ adUnitId: adId });
                this._videoAd.onClose(onClose);
            }
            this.ispreLoadVideo = false;
            this._videoAd.load().then(() => {
                console.log("加载成功");
                this._videoAd.show().then(() => {
                    console.log("视频广告展示");
                    ttTalentCommon.playVideoShow();
                }).catch(err => {
                    console.log(err);
                    SdkAudioAdapter.resumeMusic();
                    this._onPlayEnd && this._onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
                })
            }).catch(err => {
                console.log(err);
                SdkAudioAdapter.resumeMusic();
                this._onPlayEnd && this._onPlayEnd(VideoAdCode.AD_ERROR, "内容正在加载中，请稍后再试！");
            });
        }
    }
    public sendEvent(key: string, param: any): void {
        if (tt.reportAnalytics) {
            if (param == null || param == "" || param == "none") {
                tt.reportAnalytics(key, {
                });
            } else if (typeof param == "object") {
                tt.reportAnalytics(key, param);
            }
        }
    }
    public share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {
        if (param) {
            if (param.channel == "video") {
                let shareTitle = [
                    "今年假期，你的智商欠费了吗？",
                    "测试一下你的智商有多高。",
                    "只有智商120才能过关哦！",
                    "假期出去玩，带上这款游戏就够了！"
                ]
                let desc = shareTitle[Math.floor(Math.random() * shareTitle.length)];
                tt.shareAppMessage({
                    channel: "video",
                    extra: param.extra,
                    title: desc,
                    desc: desc,
                    success: () => {
                        success && success();
                    },
                    fail: (e) => {
                        fail && fail(e);
                    }
                })
            } else {
                tt.shareAppMessage({
                    channel: param.channel || "article",
                    extra: param.extra,
                    templateId: "16fmalu0fux1hlf2cg",
                    // templateId: Math.random() > 0.5 ? "bf9h1gad20ha1dry2c" : "d27cg45ih1821vmk2p",
                    success: () => {
                        success && success();
                    },
                    fail: (e) => {
                        fail && fail(e);
                    }
                })
            }
        }
    }

    public showFullVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) {
        this.showInsertAd(adId);
    }
    public showInsertAd(adId: string) {
        // const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
        // 插屏广告
        // console.log("显示插屏");
        if (/*isToutiaio && */tt.createInterstitialAd) {
            let interstitialAd = tt.createInterstitialAd({
                adUnitId: adId
            });
            if (!interstitialAd) return;
            interstitialAd
                .load()
                .then(() => {
                    interstitialAd.show().then(() => {
                        // console.log("插屏广告展示成功");
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            let onclose = () => {
                interstitialAd.offClose(onclose);
                interstitialAd.destroy();
                interstitialAd = null;
            }
            interstitialAd.onClose(onclose);
        }
    }

    private get _isByteDancePlatform(): boolean {
        return typeof (tt) != 'undefined';
    }

    public vibrate(type: number = 0) {
        if (type == 0) {
            tt.vibrateShort({
                success(res) {
                    // console.log(`${res}`);
                },
                fail(res) {
                    // console.log(`vibrateShort调用失败`);
                }
            });
        } else {
            tt.vibrateLong({
                success(res) {
                    // console.log(`${res}`);
                },
                fail(res) {
                    // console.log(`vibrateLong调用失败`);
                }
            });
        }
    }
}