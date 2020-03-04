import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import { ProjectConst } from "../../config/yxj_gjj_projectConst";
import { GameConst } from "../../config/yxj_gjj_const";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
let common = require('zqddn_zhb_Common');
export default class VivoAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void = null;
    _banner: vivoBanner;
    _rewardedVideoAd: vivoRewardedVideoAd;
    onShow: () => void;
    /** Android 广告控制器的初始化流程 */
    constructor(protected idDict: { [type: string]: string }) {

    }
    setBid(bid: string) {

    }
    canShowVideoAD() {
        return common.isAuditing === 0
    }

    canShowBanner() {
        return common.isAuditing === 0
    }

    //#region [video]

    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        // common.sceneMgr.showTipsUI("暂无广告，请尽情期待！");
        // this.onPlayEnd && this.onPlayEnd("暂无广告，请尽情期待！", VideoADFailCode.AD_ERROR)
        // return;              //第一次审核不显示视频广告
        
        this.onPlayEnd = onPlayEnd;
        let pid = this.idDict[type];
        if (window["qg"].getSystemInfoSync().platformVersionCode < 1041) this.onPlayEnd && this.onPlayEnd("平台版本过低，请更新平台", VideoADFailCode.NOT_SUPPORT);
        console.log("Videopid", pid)
        if (!this._rewardedVideoAd) {
            this._rewardedVideoAd = window["qg"].createRewardedVideoAd({
                posId: pid,
            })
            this._rewardedVideoAd.onLoad(() => {
                console.log("激励视频加载成功");
                this._rewardedVideoAd.show().then(() => {
                    sound_manager.pause_music();
                    console.log("激励视频广告显示成功");
                }).catch(err => {
                    console.log("激励视频广告显示失败", err);
                    this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
                });
            })
            this._rewardedVideoAd.onError((res) => {
                console.log("激励视频加载失败", JSON.stringify(res));
                this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
            })
            this._rewardedVideoAd.onClose((res) => {
                sound_manager.resume_music();
                if (res.isEnded) {
                    console.log('激励视频广告完成，发放奖励')
                    this.onPlayEnd && this.onPlayEnd();
                } else {
                    console.log('激励视频广告取消关闭，不发放奖励')
                    let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
                    this.onPlayEnd && this.onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
                }
            });
        }else {
            this._rewardedVideoAd.load().then(() => {
                console.log("激励视频广告加载成功");
            }).catch(err => {
                console.log("激励视频广告加载失败", err);
                this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
            });
        }


    }

    showInsertAd(type: string) {
        // return
        if (!this.canShowVideoAD()) return;
        let iid = this.idDict[type];
        console.log('插屏广告', iid)
        var insertAd = window["qg"].createInterstitialAd({
            posId: iid,
        });
        // insertAd.load()
        // insertAd.onLoad(() => {
        //     console.log("插屏广告加载");
        //     insertAd.offError();
        //     insertAd.offLoad();
        //     insertAd.show()
        // })
        // insertAd.onError((err) => {
        //     console.log('插屏广告失败', err);
        //     insertAd.offError();
        //     insertAd.offLoad();
        // })

        let adShow =  insertAd.show();
        adShow && adShow.then(() => {
            console.log("插屏广告展示成功");
            
          }).catch((err) => {
            switch (err.code) {
              case 30003:
                  console.log("插屏广告展示失败：30003，新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入")
                  
                  break;
              case 30009:
                  console.log("插屏广告展示失败：30009,10秒内调用广告次数超过1次，10秒后再调用")
                  break;
              case 30002:
                  console.log("插屏广告展示失败：30002，load广告失败，重新加载广告");
                  
                //重新加载视频
                let adShowRetey = insertAd.show()
                adShowRetey && adShowRetey.catch((error)=>{
                    console.log("插屏广告展示失败-重试")
                    console.log(JSON.stringify(error))
                })
                  break;              
              default:
                  // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                  console.log("插屏广告展示失败")
                  console.log(JSON.stringify(err))
                  break;
              }         
          });

    }


    creatBanner(bid: string) {
        // return
        
        console.log('banner广告', bid)
        this._banner = window["qg"].createBannerAd({
            posId: bid,
            style: {}
        });
        // this.bannerAd.load();

        this._banner.onError((res) => {

            console.log("banner广告加载失败", JSON.stringify(res));
            // this._banner.offError();
            // this._banner.offLoad();
        })
        this._banner.onLoad(() => {
            console.log("banner 广告显示");
            // this._banner.offError();
            // this._banner.offLoad();
        })
        this._banner.show()
    }

    show(bid: string) {
        this.hideBannerAd();
        this.onShow && this.onShow();
        this.creatBanner(bid);
    }

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        this.showBannerAd(type, onShow);
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) {
        this.showBannerAd(type, onShow);
    }
    showBannerAd(type: string, onShow: () => void) {
        if (!this.canShowBanner()) return;
        let bid = this.idDict[type];
        console.log("Bideopid", bid)
        this.onShow = null;
        this.onShow = onShow;
        this.show(bid);
    }

    hideBannerAd() {
        if (!this._banner) return;
        this._banner.hide()
        this._banner.destroy();
    }

    destoryBannerAd() { /* 留待实现 */ }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any) {
        let bid = this.idDict[type];
        return window["qg"].createBannerAd({
            posId: type,
        });
    }

    //#endregion [banner]
}
interface vivoBanner {
    /** 展示此广告 */
    show();
    /** 隐藏此广告 */
    hide();
    /** 此广告展示成功的回调 */
    onLoad(cb: () => void);
    /** 移除此广告展示成功的回调 */
    offLoad();
    /** 此广告关闭成功的回调 */
    onClose(cb: () => void);
    /** 移除此广告关闭成功的回调 */
    offClose();
    /** 此广告的异常回调 */
    onError(cb: (e) => void);
    /** 关闭此广告的异常回调 */
    offError();
    /** 此广告的异常回调 */
    onSize(cb: (res) => void);
    /** 关闭此广告的异常回调 */
    offSize();
    /** 销毁此广告 */
    destroy();
}

interface vivoRewardedVideoAd {
    /** 隐藏激励视频广告
     * @returns 激励视频广告加载数据的结果
     */
    load(): Promise<any>;

    /** 显示激励视频广告。激励视频广告将从屏幕下方推入。
     * @returns 激励视频广告显示操作的结果
     */
    show(): Promise<any>;

    /** 监听激励视频广告加载事件
     * @param callback 激励视频广告加载事件的回调函数
     */
    onLoad(callback: fw.cb): void;

    /** 取消监听激励视频广告加载事件
     * @param callback 激励视频广告加载事件的回调函数
     */
    offLoad(): void;

    /** 监听激励视频错误事件
     * @param callback 激励视频错误事件的回调函数
     */
    onError(callback: fw.cb1<wx.RewardedVideoAd.onError_res>): void;

    /** 取消监听激励视频错误事件
     * @param callback 激励视频错误事件的回调函数
     */
    offError(): void;

    /** 监听用户点击 关闭广告 按钮的事件
     * @param callback 用户点击 关闭广告 按钮的事件的回调函数
     */
    onClose(callback: fw.cb1<wx.RewardedVideoAd.onClose_res>): void;

    /** 取消监听用户点击 关闭广告 按钮的事件
     * @param callback 用户点击 关闭广告 按钮的事件的回调函数
     */
    offClose(): void;
}