import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
let common = require('zqddn_zhb_Common');
declare var qttGame:any;
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
export default class H5_QTTAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    onbannerShow: () => void
    /** Android 广告控制器的初始化流程 */
    constructor(protected pid: { [type: string]: string }) {
        // <script type="text/javascript" src="//newidea4-gamecenter-frontend.1sapp.com/sdk/prod/h5.v1.0.0.js?spread=required"></script>
        // <meta name="app_id" content="value">
    }

    setBid(bid: string) {

    }
    canShowVideoAD() {
        return common.isAuditing === 0;
    }

    canShowBanner() {
        return common.isAuditing === 0;
    }

    callback(obj) {
        console.log('代码:' + obj.code + ',消息:' + obj.message)
        if (obj.code === 10000) {
            console.log('趣头条视频开始播放')
        } else if (obj.code === 10001) {
            console.log('趣头条视频广告播放结束')
            this.onPlayEnd && this.onPlayEnd()
        } else {
            console.log('趣头条视频广告异常')
            this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
        }
    }

    //#region [video]

    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        // if (!this.canShowVideoAD()) return fw.ui.showToast("该功能暂未开放")
        this.onPlayEnd = null;
        this.onPlayEnd = onPlayEnd;
        console.log('趣头条视频开始尝试播放')
        sound_manager.pause_music();
        let options = {
            gametype: Math.ceil(Math.random() * 3),//互动游戏类型，1(砸金蛋)  2(laba)  3(大转盘)
            rewardtype: 1,//互动广告框，只有 1
            data: {
                title: "游戏奖励"
            },
            callback: (res) => {
                //回调函数
                console.log("趣头条抽奖结果", res)
                if (res == 1) {
                    //播放完成，发放奖励
                    console.log("抽中了")
                    this.onPlayEnd && this.onPlayEnd()
                } else {
                    //res = 0    填充不足
                }
            }
        };

        window["qttGame"] && qttGame.showVideo((res) => {
            console.log('趣头条视播放情况1', res)
            sound_manager.resume_music();
            if (res == 1) {
                this.onPlayEnd && this.onPlayEnd && this.onPlayEnd();
            } else {
                if (res === 0) {
                    console.log('趣头条视频广告填充率不足，视频没有准备好，咱们来抽抽奖吧');
                    // this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
                    // this.onPlayEnd && this.onPlayEnd("视频没有准备好，咱们来抽抽奖吧", VideoADFailCode.NOT_READY);
                    window["qttGame"] && qttGame.showHDAD(options);
                }
                if (res === 2) {
                    console.log('趣头条视频广告未看完');
                    this.onPlayEnd && this.onPlayEnd("未完整观看视频广告", VideoADFailCode.NOT_COMPLITE);
                }
                //res = 2    提前关闭
            }
        });
    }

    //#endregion [video]

    //#region [banner]

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        console.log('[H5_QTTAdCtrler][showBannerAd_withNode] 展示广告条')
        if (!this.canShowBanner()) return;
        window["qttGame"] && qttGame.showBanner();
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        console.log('[H5_QTTAdCtrler][showBannerAd_withStyle] 展示广告条')
        if (!this.canShowBanner()) return;
        window["qttGame"] && qttGame.showBanner();
    }
    hideBannerAd() {
        window["qttGame"] && qttGame.hideBanner();
    }

    destoryBannerAd() { /* 留待实现 */ }
    createBannerAd(type?: string, style?: BannerADStyle, args?: any): AndroidBanner { return new AndroidBanner(type, style, args); }

    //#endregion [banner]
}
class AndroidBanner implements IBanner {
    /** Banner 广告对象的初始化流程 */
    constructor(type?: string, style?: BannerADStyle, args?: any) { /* 留待扩展 */ }
    /** 指示广告是否到达可以展示的状态(如加载/出错等导致) */
    canShow: boolean;
    /** 展示此广告 */
    show() { /* 留待实现 */ }
    /** 隐藏此广告 */
    hide() { /* 留待实现 */ }
    /** 删除此广告 */
    dispose() { /* 留待实现 */ }
    /** 此广告的加载完成回调 */
    onLoad(cb: () => void) { /* 留待实现 */ }
    /** 此广告的异常回调 */
    onError(cb: (e: Error) => void) { /* 留待实现 */ }
}