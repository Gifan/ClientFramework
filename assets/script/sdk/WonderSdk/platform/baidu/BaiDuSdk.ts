import { BaseSdk, VideoAdCode, ShareType, ShareListType } from "../BaseSdk";
import { SdkAudioAdapter } from "../../adapter/AudioAdapter";
import { SdkSelectAlertAdapter } from "../../adapter/SelectAlertAdapter";
declare let swan: any;
export class BaiDuSdk extends BaseSdk {
    private _bannerAd: any = null;
    public init(appId: string) {
        super.init(appId);
        this.onAntiAddiction();
        swan.showShareMenu({});
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
        const { windowWidth, windowHeight } = swan.getSystemInfoSync();
        let targetBannerAdWidth = 300 > windowWidth ? windowWidth : 300;
        this._showBannerNum++;

        let adIds = adId.split("-");

        if (!this._bannerAd) {
            this._bannerAd = swan.createBannerAd({
                adUnitId: adIds[0],
                appSid: adIds[1],
                style: {
                    width: targetBannerAdWidth - 1,
                    top: windowHeight - targetBannerAdWidth * 0.285,
                    left: (windowWidth - targetBannerAdWidth) * 0.5,
                }
            });
            console.log("onCreate Banner");
            this._bannerAd.onResize(size => {
                console.log("onResize", size)
                this._bannerAd.style.top = windowHeight - size.height;
                this._bannerAd.style.left = (windowWidth - size.width) * 0.5;
            });
            this._bannerAd.onError(err => {
                this._showBannerNum = 0;
                this._bannerAd && this._bannerAd.destroy();
                this._bannerAd = null;
                console.log("on error", err);
            });
            this._bannerAd.style.width = targetBannerAdWidth;
            this._bannerAd.onLoad(() => {
                console.log("on load finish");
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
        if (this._bannerAd) {
            this._bannerAd.destroy();
            this._showBannerNum = 0;
            this._bannerAd = null;
        }
    }
    private lastVideoPlayTime: number = 0;
    public showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void {
        if (!swan.createRewardedVideoAd) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新头条版本");
        }
        if (Date.now() - this.lastVideoPlayTime < 1000) {
            onPlayEnd && onPlayEnd(VideoAdCode.NOT_READY, "视频广告还在准备中，请稍后尝试");
            return;
        }
        let adIds = adId.split("-");
        let videoAd = swan.createRewardedVideoAd({ adUnitId: adIds[0], appSid: adIds[1] });
        if (!videoAd) { onPlayEnd && onPlayEnd(VideoAdCode.NOT_SUPPORT, "不支持视频广告, 请更新百度版本"); return; }
        SdkAudioAdapter.pauseMusic();
        let onClose = res => {
            SdkAudioAdapter.resumeMusic();
            videoAd.offClose(onClose);
            console.log("video onClose", res);
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
            // this._fakeShareTime_temp = Date.now();
            // this._fakeShareCbSuccess_temp = success;
            // this._fakeShareCbFail_temp = fail;
            // qq.onShow(this._fakeCb_bind);
            setTimeout(() => {
                swan.shareAppMessage({
                    title: data.title,
                    imageUrl: data.image,
                    success: (res) => {
                        success && success();
                    },
                    fail: (err) => {
                        fail && fail(err);
                    }
                }, 2)
            });

        } else {
            fail && fail("找不到对应分享信息");
        }
    }

    // private _fakeCb_bind = this._fakeCb.bind(this);
    // private _fakeShareTime_temp: number;
    // private _fakeShareCbSuccess_temp: Function;
    // private _fakeShareCbFail_temp: Function;
    // private delay: number = 2500;
    // private _fakeCb() {
    //     qq && qq.offShow(this._fakeCb_bind);
    //     let timeUp = Date.now() - this._fakeShareTime_temp >= this.delay;
    //     if (timeUp) {
    //         this._fakeShareCbSuccess_temp && this._fakeShareCbSuccess_temp();
    //     } else {
    //         this._fakeShareCbFail_temp && this._fakeShareCbFail_temp();
    //     }
    // }

    public showInsertAd(adId: string) {

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
            swan.onShareAppMessage(() => ({
                title: data.title,
                imageUrl: data.image // 图片 URL
            }))
        }
    }

    public vibrate(type: number = 0) {
        if (type == 0) {
            swan.vibrateShort({
                success(res) {
                    console.log(`${res}`);
                },
                fail(res) {
                    console.log(`vibrateShort调用失败`);
                }
            });
        } else {
            swan.vibrateLong({
                success(res) {
                    console.log(`${res}`);
                },
                fail(res) {
                    console.log(`vibrateLong调用失败`);
                }
            });
        }
    }

    public onAntiAddiction() {
        let info = swan.getSystemInfoSync();
        if (info.platform != "android") return console.log("[BdPlatformToolsCtrler][onAntiAddiction]非安卓平台不做百度防沉迷限制");
        if (!swan.getAntiAddiction) return console.log("[BdPlatformToolsCtrler][onAntiAddiction]低版本不做百度防沉迷限制");
        let api = swan.getAntiAddiction();
        console.log("[BdPlatformToolsCtrler][onAntiAddiction]开启防沉迷监听")
        api.onAntiAddiction(({ state, msg }) => {
            console.log("[BdPlatformToolsCtrler][onAntiAddiction]state: ", state);
            let time = 20;
            let title = "健康提示";
            let info;
            switch (state) {
                case 10001:
                    info = "健康提示，您今日游戏时长已达到90分钟，为了您的身心健康，请明天再来";
                    break;
                case 10002:
                    info = "健康提示，您今日游戏时长已达到180分钟，为了您的身心健康，请明天再来";
                    break;
                case 10003:
                    info = "健康提示，每日22:00至次日8:00禁止未成年人游戏，为了您的身心健康，请明天再来哈。晚安，好梦！";
                    break;
            }
            console.log("[BdPlatformToolsCtrler][onAntiAddiction]今日游戏时间达到上限，20秒后进入防沉迷限制")
            setTimeout(() => {
                let data = {
                    title: "健康提示",
                    desc: info,
                    confirmText: "我知道了",
                    cancelText: "退出",
                    confirm: () => { swan && swan.exit(); },
                    cancel: () => { swan && swan.exit(); },
                }
                SdkSelectAlertAdapter.showAlert(data);
            }, time * 1000);

        });
    }
    public showFavoriteGuide() {
        let sys = swan.getSystemInfoSync();
        let type1 = "bar"
        if (sys.version >= "11.22") {
            type1 = "tip";
        }
        console.log(sys.version, "百度版本号", type1);
        swan.showFavoriteGuide({
            type: type1,
            content: '一键添加到我的小程序',
            success: res => {
                console.log('添加成功：', res);
            },
            fail: err => {
                console.log('添加失败：', err);
            }
        })
    }
}