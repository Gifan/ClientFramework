import SOVHandler_Base from "./yxj_gjj_SOVHandler";
import { ShareLaunchQuery } from "../../../sdk/sina/yxj_cz_SinaChannelCtrler";

export default class SOVHandler_sina extends SOVHandler_Base {

    protected _shareHandler: SinaShareHandler;

    constructor() {
        console.log("[SOVHandler_sina][ctor]")
        super();
        this._calculVersion();
        window["wb"] && wb.onShareAppMessage && wb.onShareAppMessage(this._getShareInfo_onMenuCb.bind(this));
    }

    protected on_bms_launchConfig_vc(nv: dto.HTTP.BMS_LAUNCH_CONFIG.rp) {
        super.on_bms_launchConfig_vc(nv);
        this._calculVersion();
    }

    protected _calculVersion() {
        this._shareHandler && this._shareHandler.dispose();
        this._shareHandler = new SinaShareHandler_FakeCB();
    }

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj) {
        typeof spfOrPath === "string" ?
            this._wbShare_customConfig(title, spfOrPath, null, false, null, query) :
            this._wbShare_customConfig(title, this.img2path(spfOrPath), null, false, null, query);
    }
    commonShare(type?: string, query?: PathObj) {
        this._wbShare_bmsConfig(null, false, type, query);
    }
    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj) {
        console.log("[SOVHandler_Wb][cbShare]");
        this._wbShare_bmsConfig(onCpl, true, type, query);
    }
    groupShare(onCpl: fw.cb, shareGroupType: string, query?: PathObj) {
        console.log("[SOVHandler_Wb][groupShare]");
        this._wbShare_bmsConfig(onCpl, true, shareGroupType, query);
    }

    img2path(spf: cc.SpriteFrame) {
        console.log("[SOVHandler_Wb][img2path]");
        return null;
    }

    private _wbShare_bmsConfig(onCpl?: (failReason?: string) => void, isGroupReturn?: boolean, type?: string, query?: ShareLaunchQuery) {
        let config = this._getRandomConfig();
        if (!config) return onCpl && onCpl("素材还没准备好哦");
        if (!query) query = {};
        query.bms = JSON.stringify(config);
        this._wbShare_customConfig(config.title, config.image, onCpl, isGroupReturn, type, query);
        this._rq_BMS_SHARE_SHOW(config);
    }

    private _wbShare_customConfig(
        title: string,
        image: string,
        onCpl?: (failReason?: string) => void,
        isGroupReturn?: boolean,
        type?: string,
        query?: ShareLaunchQuery
    ) {
        console.log("[SOVHandler_wb][_wbShare_customConfig]" + isGroupReturn);
        if (!query) query = {};
        if (fw.lsd.firstSource.value) {
            query.promoSource = fw.lsd.firstSource.value;
            query.promoLv = fw.lsd.promoLv.value;
        }
        let shareInfo: any = {
            data: {
                title: title,
                imageUrl: image,
                url: "http://sng.sina.com.cn/gamecenter/game/tryplay/appkey/wbg_5d75c4dfbc0d7",
                query: query && fw.Util.objToPath(query as PathObj),
            },

        };
        this._shareHandler.share(onCpl, shareInfo, isGroupReturn);
    }

    private _getShareInfo_onMenuCb() {
        let config = this._getRandomConfig();
        let query = { bms: JSON.stringify(config) };
        return {
            shareType: 1,
            data: {
                title: config.title,
                imageUrl: config.image,
                url: "http://sng.sina.com.cn/gamecenter/game/tryplay/appkey/wbg_5d75c4dfbc0d7",
                query: query && fw.Util.objToPath(query),
            },
        };
    }
}

type ShareInfo = { data: { title: string, imageUrl: string, url: string, query: string }, success?: Function, fail?: Function };
interface SinaShareHandler { share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean); dispose(); }
class SinaShareHandler_RealCB implements SinaShareHandler {
    constructor() { console.log("启用真微信回调"); }
    dispose() { console.log("移除真微信回调"); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        console.log("[]SinaShareHandler_RealCB",shareInfo,shareInfo.data,shareInfo.data.imageUrl,shareInfo.data.title,shareInfo.data.url);
        if (onCpl) {
            console.log("有奖励的分享")
            shareInfo.success = (res) => onCpl(); 
            shareInfo.fail = (res) => onCpl("分享失败");
        }
        wb.shareAppMessage(shareInfo);
        console.log("分享信息1:", shareInfo);
    }
}
class SinaShareHandler_FakeCB implements SinaShareHandler {
    hasGetKey = false;
    delay = 2500;
    constructor() { }
    dispose() { console.log("移除假微信回调"); window["wb"] && wb.offShow(this._fakeCb_bind); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        console.error("新浪分享")
        if (fw.lsd.shareGetKeyCount.value >= 4 && isGroupReturn) {
            window["wb"] && wb.offShow(this._fakeCb_bind);
            fw.cls.sov.video(Const.VideoADType.TIPS_KEY, s => onCpl(s));
            return;
        } else {
            console.log("[SinaShareHandler_FakeCB][share]" + isGroupReturn);
            if (!isGroupReturn) return setTimeout(() => wb.shareAppMessage(shareInfo));
            window["wb"] && wb.onShow(this._fakeCb_bind);
            this._shareInfo = shareInfo;
            this._isGroupReturn = isGroupReturn;
            this._fakeShareCb_temp = onCpl;
            this._fakeShareTime_temp = Date.now();
            console.log("分享信息2:" + isGroupReturn + this._isGroupReturn, shareInfo);
            setTimeout(() => wb.shareAppMessage(shareInfo));
        }

    }
    protected _isGroupReturn: boolean;
    protected _shareInfo: ShareInfo;
    protected _fakeCb_bind = this._fakeCb.bind(this);
    protected _fakeShareCb_temp: (failReason?: string) => void;
    protected _fakeShareTime_temp: number;
    protected _fakeCb() {
        window["wb"] && wb.offShow(this._fakeCb_bind);
        console.log("[假分享回屏] 离屏用时:" + (Date.now() - this._fakeShareTime_temp)
            + ", 今日分享次数:" + fw.lsd.shareCount.value, this._isGroupReturn);
        if (!this._fakeShareCb_temp) return;
        let cb = this._fakeShareCb_temp;
        // this._fakeShareCb_temp = null;
        let timeUp = Date.now() - this._fakeShareTime_temp >= this.delay;
        if (!this._isGroupReturn) {
            cb && cb();
            return;
        }
        let successMsg: string;
        let failReason: string;
        console.log("timeUp", timeUp, Date.now() - this._fakeShareTime_temp, this.delay, Date.now() - this._fakeShareTime_temp >= this.delay)
        switch (++fw.lsd.shareCount.value) {
            case 1:
                successMsg = "本次为赠送提示，下次分享群可得提示";
                fw.lsd.shareGetKeyCount.value++;
                break;
            default:
                if (timeUp) {
                    if (this.hasGetKey) {
                        this.hasGetKey = false;
                        failReason = "同一个群一天只能领取一次，请分享不同群！";
                    } else {
                        successMsg = "即将获得奖励";
                        fw.lsd.shareGetKeyCount.value++;
                        this.hasGetKey = true;
                    }
                } else {
                    this.hasGetKey = false;
                    failReason = "分享检查失败，麻烦请重新分享群";
                }
                break;
        }
        console.log("cb", this._fakeShareCb_temp)
        if (failReason) {
            fw.ui.showChoose({
                tipsMsg: failReason,
                yesCB: () => { this.share(this._fakeShareCb_temp, this._shareInfo, this._isGroupReturn) },
                yesText: "继续分享",
                noText: "取消"
            });
            return;
        }

        fw.ui.showToast(successMsg);
        setTimeout(() => cb(), 2000);
    }
}
