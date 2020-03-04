import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import { ProjectConst } from "../../config/yxj_gjj_projectConst";
import { GameConst } from "../../config/yxj_gjj_const";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
let common = require('zqddn_zhb_Common');
export default class OppoAdCtrler implements IADCtrler {
    _banner: oppoBanner;
    videoAd:any;
    onPlayEnd:any;
    onShow: () => void;
    /** Android 广告控制器的初始化流程 */
    constructor(protected idDict: { [type: string]: string }) {
        let appid = ProjectConst.AppConst.OPPO_APPID;
        console.log("[OppoAdCtrler][constructor]", appid);
        // qg.initAdService({
        //     appId: appid,
        //     isDebug: false,
        //     success: (res) => {
        //         console.log("initAdService_success", res);
        //     },
        //     fail: (res) => {
        //         console.log("initAdService_fail:" + res.code + res.msg);
        //     },
        //     complete: (res) => {
        //         console.log("initAdService_complete", res);
        //     }
        // })
    }
    setBid(bid: string) {
        if (bid) {
            this.idDict["defaultv"] = bid;
            this.idDict[GameConst.BannerADType.LV_TIPS] = bid;
            this.idDict[GameConst.BannerADType.LV_END] = bid;
            this.idDict[GameConst.BannerADType.AUTO] = bid;
        }
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
        let pid = this.idDict[type];
        console.log("Videopid", pid)
        this.onPlayEnd = onPlayEnd;
        if(!this.videoAd){

            this.videoAd = qg.createRewardedVideoAd({
                adUnitId: pid,
            })
            this.videoAd.onError((res) => {
                console.log("激励视频加载失败", JSON.stringify(res));
                this.onPlayEnd && this.onPlayEnd("内容正在加载中，请稍后再试！", VideoADFailCode.AD_ERROR);
                // this.videoAd.offError();
                // this.videoAd.offLoad();
                // videoAd.offClose();
                // videoAd.destroy();
                // videoAd = null;
            })
            this.videoAd.onLoad(() => {
                console.log("激励视频加载成功");
                this.videoAd.show();
                // videoAd.offLoad();
                // videoAd.offError();
            })
            this.videoAd.onClose((res) => {
                if (res.isEnded) {
                    console.log('激励视频广告完成，发放奖励',this.onPlayEnd,JSON.stringify(this.onPlayEnd))
                    this.onPlayEnd && this.onPlayEnd();
                } else {
                    console.log('激励视频广告取消关闭，不发放奖励',this.onPlayEnd,JSON.stringify(this.onPlayEnd))
                    let reason = (res && res.isEnded || res === undefined) ? "" : "未完整观看视频广告";
                    this.onPlayEnd && this.onPlayEnd(reason, VideoADFailCode.NOT_COMPLITE);
                }
                // videoAd.offLoad();
                // videoAd.offClose();
                // videoAd.destroy();
                // videoAd = null;
            });

        }

        
        this.videoAd.load();
        

    }

    showInsertAd(type: string) {
        if (!this.canShowBanner()) return;

        let iid = this.idDict[type];
        console.log('插屏广告', iid)
        var insertAd = qg.createInsertAd({
            adUnitId: iid,
        });
        insertAd.load()
        insertAd.onLoad(() => {
            console.log("插屏广告加载");
            insertAd.offError();
            insertAd.offLoad();
            insertAd.show()
        })
        insertAd.onShow(() => {
            console.log("插屏广告展示");
            insertAd.offShow();
        })
        insertAd.onError((err) => {
            console.log('插屏广告失败', err);
            insertAd.offError();
            insertAd.offLoad();
            insertAd.offShow();
        })
    }

    creatBanner(bid: string) {
        this._banner = qg.createBannerAd({
            adUnitId: bid,
        });
        // this.bannerAd.load();

        this._banner.show()


        this._banner.onError((res) => {

            console.log("banner广告加载失败", JSON.stringify(res));
            this._banner.offError();
            this._banner.offShow();
        })
        this._banner.onShow(() => {
            console.log("banner 广告显示");
            this._banner.offError();
            this._banner.offShow();
        })
    }

    show(bid: string) {
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
        this._banner = null;
    }

    destoryBannerAd() { /* 留待实现 */ }

    createBannerAd(type?: string, style?: BannerADStyle, args?: any) {
        let bid = this.idDict[type];
        return qg.createBannerAd({
            adUnitId: type,
        });
    }

    //#endregion [banner]
}
interface oppoBanner {
    /** 指示广告是否到达可以展示的状态(如加载/出错等导致) */
    canShow: boolean;
    /** 展示此广告 */
    show();
    /** 隐藏此广告 */
    hide();
    /** 此广告展示成功的回调 */
    onShow(cb: () => void);
    /** 移除此广告展示成功的回调 */
    offShow();
    /** 此广告关闭成功的回调 */
    onHide(cb: () => void);
    /** 移除此广告关闭成功的回调 */
    offHide();
    /** 此广告的异常回调 */
    onError(cb: (e) => void);
    /** 关闭此广告的异常回调 */
    offError();
    destroy();
}