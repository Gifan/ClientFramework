import { BaseSdk, VideoAdCode, ShareType, ShareListType } from "../BaseSdk";
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
import { FullVideoIdList, EPlatform, BannerIdList } from "../../config/SdkConfig";
import { BaseNet, BaseUrl, Url } from "../../net/BaseNet";
declare let wx: any;
export class WeChatSdk extends BaseSdk {
    private _bannerAd: any = null;
    public init(appId: string) {
        super.init(appId);

        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        wx.onAudioInterruptionEnd(() => {
            console.log("音频中断结束");
            SdkAudioAdapter.resumeMusic();
        });
        wx.onAudioInterruptionBegin(() => {
            console.log("音频中断开始");
            SdkAudioAdapter.pauseMusic();
        });
        if (wx.getUpdateManager) {
            const updateManager = wx.getUpdateManager()

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })

            updateManager.onUpdateFailed(function () {
                // 新版本下载失败
            })
        }

        wx.onShow((res) => {
            console.log("进入前台onshow", res);
            this.checkFlag(res && res.query);
        })
    }

    public checkFlag(query) {
        if (query && query.share_id) {
            if (query.open_id == this.getOpenId() || this.getOpenId() == '') {
                console.log("Openid相同或空无需上报");
                return;
            }
            BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_CARD_SHARE, { open_id: query.open_id, hit_open_id: "1", app_name: wonderSdk.BMS_APP_NAME, share_id: `${query.share_id}` }, "POST").then(data => {
                console.log("微信分享卡片", data);
            }).catch(err => {
                console.log("微信分享卡片上报失败", err);
            })

        }
    }

    /**
     * @description 请求分享列表配置
     * @author 吴建奋
     * @date 2020-04-28
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    public requestCardConfig(): Promise<any> {
        return BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_CARD_SHARE_INFO, { app_name: wonderSdk.BMS_APP_NAME, open_id: this.getOpenId(), share_id: "1" }, "POST");
    }

    public login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        //发起网络请求
                        BaseNet.Request(BaseUrl.ServerDomain + Url.BMS_SIGN_IN_WX, { app_name: wonderSdk.BMS_APP_NAME, code: res.code }, "POST")
                            .then(data => {
                                this.setOpenId(data.data.open_id);
                                let launcheroption = wx.getLaunchOptionsSync();
                                this.checkFlag(launcheroption && launcheroption.query);
                                resolve(null);
                            }).catch(err => {
                                resolve(err);
                            })
                    } else {
                        console.log('登录失败！' + res.errMsg);
                        success && success(null);
                        resolve(null);
                    }
                }
            })
        });
    }
    public showBannerWithNode(adId: string, node: { x: number; y: number; width: number; height: number; }, onShow?: () => void): void {
        this.showBannerWithStyle(adId, {}, onShow)
    }
    private _showBannerNum: number = 0;
    private _bannerHeight: number = 0;
    private _bannerWidth: number = 0;
    private showBannerSuc: number = 0;//成功展示banner次数
    private showAndDestroyTime: number = 3;
    private bannerRefreshTime: number = 30;
    public showBannerWithStyle(adId: string, style: { width?: number; height?: number; left?: number; bottom?: number; top?: number; }, onshow?: (param?: any) => void): void {
        const { screenWidth, screenHeight } = wx.getSystemInfoSync();
        this._showBannerNum++;
        this.createBanner(adId);
        this._bannerAd.show().then(() => {
            this.showBannerSuc++;
            onshow && onshow({ screenHeight, screenWidth, bannerWidth: this._bannerWidth, bannerHeight: this._bannerHeight });
        }).catch(err => {
            console.error("广告组件出现问题", err);
            this._showBannerNum--;
            if (this._showBannerNum < 0) this._showBannerNum = 0;
        })
        // }
    }
    public hideBanner(): void {
        this._showBannerNum--;
        if (this._showBannerNum <= 0) {
            this._showBannerNum = 0;
            if (this.showBannerSuc >= this.showAndDestroyTime) {
                this._bannerAd && this._bannerAd.destroy();
                this._bannerAd = null;
                let id = BannerIdList[EPlatform.WECHAT_GAME]["0"];
                this.showBannerSuc = 0;
                this.createBanner(id);
            } else {
                this._bannerAd && this._bannerAd.hide();
            }
        }
    }
    public createBanner(adId: string) {
        const { screenWidth, screenHeight } = wx.getSystemInfoSync();
        let targetBannerAdWidth = 300;
        let offset = 0;
        if (screenHeight / screenWidth >= 1.9) offset = 10;
        if (!this._bannerAd) {
            this._bannerAd = wx.createBannerAd({
                adUnitId: adId,
                adIntervals: this.bannerRefreshTime,
                style: {
                    width: targetBannerAdWidth,
                    top: screenHeight - (targetBannerAdWidth / 16) * 9,
                    left: (screenWidth - targetBannerAdWidth) * 0.5,
                }
            });
            this._bannerHeight = 90;
            this._bannerHeight = 300;
            this._bannerAd.onError((res) => {
                this._showBannerNum--;
                if (this._showBannerNum <= 0) this._showBannerNum = 0;
                if (this._bannerAd) {
                    this._bannerAd.destroy();
                    this._bannerAd = null;
                }
            });
            this._bannerAd.onResize(size => {
                this._bannerHeight = size.height;
                this._bannerWidth = size.width;
                this._bannerAd.style.top = (screenHeight - size.height) - offset;
                this._bannerAd.style.left = (screenWidth - size.width) * 0.5;
            });
        }
        return this._bannerAd;
    }

    public setBmsVo(res: any) {
        super.setBmsVo(res);
        if (res && res.recreate_num) {
            this.showAndDestroyTime = res.recreate_num;
        }
        if (res && res.banner_refresh_time) {
            this.bannerRefreshTime = res.banner_refresh_time;
        }
    }
    public destroyBanner(): void {
        // this._showBannerNum = 0;
        // this._bannerAd && this._bannerAd.destroy();
        // this._bannerAd = null;
    }
    private lastVideoPlayTime: number = 0;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        if (!wx.createRewardedVideoAd) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新微信版本");
            return;
        }
        if (Date.now() - this.lastVideoPlayTime < 1000) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_READY, "视频广告还在准备中，请稍后尝试");
            return;
        }
        let videoAd = wx.createRewardedVideoAd({ adUnitId: adId });
        if (!videoAd) { onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新微信版本"); return; }
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
        videoAd.onError((error) => {
            console.error(error);
        });
    }
    public sendEvent(key: string, param: any): void {
        if (wx.uma) {
            // console.log("sendEvent ", key, param);
            if (param == null || param == "" || param == "none") {
                wx.uma.trackEvent(key);
            } else if (typeof param == "object") {
                wx.uma.trackEvent(key, param);
            }
        }
    }

    public preLoadRewardVideo() {
        if (wx && wx.createInterstitialAd) {
            if (!this.interstitialAd) {
                let interstitialAd = wx.createInterstitialAd({
                    adUnitId: FullVideoIdList[EPlatform.WECHAT_GAME],
                });
                this.interstitialAd = interstitialAd;
                let onclose = () => {
                    console.log("插屏广告关闭")
                }
                this.interstitialAd.onClose(onclose);
                this.interstitialAd.onLoad(() => {
                    console.log("加载成功");
                });
            }
        }
    }
    public share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void {
        this._fakeShareTime_temp = Date.now();
        this._fakeShareCbSuccess_temp = success;
        this._fakeShareCbFail_temp = fail;
        wx.onShow(this._fakeCb_bind);
        if (this._shareList[type] && this._shareList[type].length > 0) {
            let min = 0;
            let max = this._shareList[type].length;
            let index = min + Math.floor(Math.random() * (max - min));
            let data = this._shareList[type][index];
            let image = data.image;
            if (!image || image == "") {
                image = this.getshareImageByPosSize();
            }
            setTimeout(() => {
                let trackdata = wx.uma.trackShare({
                    title: data.title,
                    imageUrl: image,
                    query: param.query,
                });
                wx.shareAppMessage(trackdata);
            });
        } else {
            let trackdata = wx.uma.trackShare({
                title: param.title,
                imageUrl: param.image,
                query: param.query ? `${param.query}&open_id=${this.getOpenId()}` : `open_id=${this.getOpenId()}`,
            });
            wx.shareAppMessage(trackdata);
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
    public showFullVideoAD(adId: string) {
        this.showInsertAd(adId);
    }
    private interstitialAd = null;
    public showInsertAd(adId: string) {
        if (wx && wx.createInterstitialAd) {
            if (!this.interstitialAd) {
                let interstitialAd = wx.createInterstitialAd({
                    adUnitId: adId
                });
                this.interstitialAd = interstitialAd;
                let onclose = () => {
                    console.log("插屏广告关闭")
                }
                this.interstitialAd.onClose(onclose);
                this.interstitialAd.onLoad(() => {
                    console.log("加载成功");
                });
            }
            this.interstitialAd.show().catch(err => {
                console.log("插屏失败", err);
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
        if (this._shareList[ShareType.SHARE_CHALLENGE].length > 0) {
            let data = this._shareList[ShareType.SHARE_CHALLENGE][0];
            wx.onShareAppMessage(() => {
                let tempFilePath = this.getshareImageByPosSize();
                let share = {
                    title: data.title,
                    imageUrl: tempFilePath // 图片 URL
                }
                let trackdata = wx.uma.trackShare(share);
                return trackdata;
            });
        }
    }

    /**
     * 截图游戏显示的画图区域
     */
    public getshareImageByPosSize() {
        let sys = wx.getSystemInfoSync();
        let srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / 750,
            cc.view.getCanvasSize().height / 1334
        );
        let realWidth1 = 750 * srcScaleForShowAll;
        let realHeight1 = 1334 * srcScaleForShowAll;
        let widthratio = cc.view.getCanvasSize().width / realWidth1;
        let heightratio = cc.view.getCanvasSize().height / realHeight1;
        let width = 750 * widthratio;
        let designheight = 1334 * heightratio;
        let boxsize = [620, 770];
        let newsize = [sys.screenWidth * boxsize[0] / width, sys.screenHeight * boxsize[1] / designheight];
        let posx = 0.5 * (width - boxsize[0]);
        let posy = 0.5 * (designheight - boxsize[1]) - 56;
        let newposx = sys.screenWidth / width * posx;
        let newposy = sys.screenHeight / designheight * posy;
        //@ts-ignore
        let tempFilePath = canvas.toTempFilePathSync({
            x: newposx * sys.pixelRatio,
            y: newposy * sys.pixelRatio,
            width: newsize[0] * sys.pixelRatio,
            height: newsize[1] * sys.pixelRatio,
            destWidth: 400,
            destHeight: 300,
        });
        return tempFilePath;
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