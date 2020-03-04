import SOVHandler_Base, { VOSType } from "./sov/yxj_gjj_SOVHandler";
import SOVHandler_Wx from "./sov/yxj_gjj_SOVHandler_wx";
import SOVHandler_Ios from "./sov/yxj_gjj_SOVHandler_ios";
import { SOVHandler_Bd } from "./sov/yxj_gjj_SOVHandler_bd";
import SOVHandler_Android from "./sov/yxj_gjj_SOVHandler_android";
import SOVHandler_Toutiao from "./sov/yxj_gjj_SOVHandler_toutiao";
import SOVHandler_H5_4399 from "./sov/yxj_gjj_SOVHandler_H5_4399";
import SOVHandler_QQMini from "./sov/yxj_gjj_SOVHandler_qqMini";
import SOVHandler_H5_MOLI from "./sov/yxj_gjj_SOVHandler_H5_moli";
import SOVHandler_H5_UC from "./sov/yxj_gjj_SOVHandler_H5_uc";
import SOVHandler_sina from "./sov/yxj_gjj_SOVHandler_sina";

type SovCB = { (failReason?: string): void }
/** [分享/视频控制器(SOV : Share or Video)] 统一封装了不同情况下对'分享/视频'需求的切换判断, 提供统一的查询和使用接口 */
export class SOVCtrler {

    VOSType = VOSType;

    /** [游戏大部分提示的类型] 如:提示二/道具说明/卡片获得 */
    get vosType(): VOSType { return this._sovHandler.vosType; }
    /** [是否ip拦截] */
    get isIpShield(): boolean { return this._sovHandler.isIpShield; }

    protected _sovHandler: SOVHandler_Base;
    constructor() {
        if (fw.isBD) {
            this._sovHandler = new SOVHandler_Bd();
            return;
        }
        /**oppo、趣头条、章鱼输入法没有分享功能，就不初始化了 */
        switch (fw.pf) {
            case fw.Platform.WECHAT_GAME: this._sovHandler = new SOVHandler_Wx(); break;
            case fw.Platform.QQ_MINI: this._sovHandler = new SOVHandler_QQMini(); break;
            case fw.Platform.NV_IPHONE: this._sovHandler = new SOVHandler_Ios(); break;
            case fw.Platform.NV_ANDROID: this._sovHandler = new SOVHandler_Android(); break;
            case fw.Platform.TOUTIAO: this._sovHandler = new SOVHandler_Toutiao(); break;
            case fw.Platform.H5_4399: this._sovHandler = new SOVHandler_H5_4399(); break;
            case fw.Platform.H5_MOLI: this._sovHandler = new SOVHandler_H5_MOLI(); break;
            case fw.Platform.H5_UC: this._sovHandler = new SOVHandler_H5_UC(); break;
            case fw.Platform.SINA: this._sovHandler = new SOVHandler_sina(); break;
            default: this._sovHandler = new SOVHandler_Base(); break;
        }
    }

    /** [回调分享] 带回调的分享 */
    share(onCpl: (failReason?: string) => void, type?: string, query?: PathObj) {
        this._sovHandler.cbShare(onCpl, type, query);
    }

    share_group(shareGroupType: string, onCpl: fw.cb, query?: PathObj) { return this.sgRest.do(arguments); }
    protected _share_group(shareGroupType: string, query?: PathObj) {
        query || (query = {});
        query.openid = fw.bb.sys_openId.value;
        query.shareGroupType = shareGroupType;
        fw.ui.showToast("分享到群\n自己进群点连接即可获得奖励");
        let onShareCpl = () => fw.ui.showChoose({
            tipsMsg: "分享到群再从群点进来即可获得奖励",
            yesCB: () => setTimeout(() => this._sovHandler.groupShare(onShareCpl, shareGroupType, query), 100) && false,
            yesText: "继续分享",
            noText: "关闭",
        });
        setTimeout(() => this._sovHandler.groupShare(onShareCpl, shareGroupType, query), 2000);
    }

    /** [通用分享] 不带任何回调的分享 */
    share_common(type?: string, query?: PathObj) {
        this._sovHandler.commonShare(type, query);
    }

    /** [自定义分享] 自定义标题及图片 */
    share_custom(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj) {
        this._sovHandler.customShare(title, spfOrPath, query);
    }

    /** [视频转分享] 观看视频失败时, 根据ip情况, 审核地区 : 回报错误, 非审核地区 : 自动转成分享 */
    videoOrShare(videoADType: string, onCpl: SovCB)
    videoOrShare(videoADType: string, query: PathObj, onCpl: SovCB)
    videoOrShare(videoADType: string, queryOrOnCpl?: SovCB | PathObj, onCpl?: SovCB, ) {
        typeof queryOrOnCpl === "object" ?
            this._sovHandler.vad2Share(onCpl, videoADType, queryOrOnCpl) :
            this._sovHandler.vad2Share(queryOrOnCpl, videoADType, undefined);
    }

    vRest = fw.Util.getRester(5, this._video, this);
    video(videoADType: string, onCpl: SovCB) { this.vRest.do(arguments); }
    protected _video(videoADType: string, onCpl: SovCB) {
        fw.ui.showToast("看完视频即可获得奖励");
        setTimeout(() => this._sovHandler.warnVideo(onCpl, videoADType), 1000);
    }
}
