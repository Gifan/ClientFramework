import SOVHandler_Base from "./yxj_gjj_SOVHandler";
import { ShareLaunchQuery } from "../../../sdk/wx/yxj_gjj_WxChannelCtrler";
import { Const } from "../../../config/Const";
let common = require('zqddn_zhb_Common');

export default class SOVHandler_QQMini extends SOVHandler_Base {

    protected _hasCbVersion: boolean;
    protected _shareHandler: WxShareHandler;
    protected _useAldShare: boolean;

    constructor() {
        console.log("[SOVHandler_QQMini][ctor]")
        super();
        let useAldShare: boolean = this._useAldShare = Const.AppConst.ALD_SDK_ID !== "";
        if (useAldShare) {
            this._shareHandler = new WxShareHandler_ald();
            window["wx"] && wx.aldOnShareAppMessage && wx.aldOnShareAppMessage(() => this._getShareInfo_onMenuCb());
        }
        else {
            this._calculVersion("9.9.9");
            window["wx"] && wx.onShareAppMessage && wx.onShareAppMessage(() => this._getShareInfo_onMenuCb());
        }
        window["wx"] && wx.updateShareMenu && wx.updateShareMenu({ withShareTicket: true }); // 获取群唯一标记, 去掉之后可以群发分享
    }

    protected on_bms_launchConfig_vc(nv: dto.HTTP.BMS_LAUNCH_CONFIG.rp) {
        super.on_bms_launchConfig_vc(nv);
        this._useAldShare || this._calculVersion(nv.shareVersion);
    }

    protected _calculVersion(shareVersion: string) {
        this._hasCbVersion = false;
        // console.log("[对比qq版本]", wx.getSystemInfoSync().version, shareVersion, this._hasCbVersion);
        this._shareHandler && this._shareHandler.dispose();
        this._shareHandler = this._hasCbVersion ? new WxShareHandler_RealCB() : new WxShareHandler_FakeCB();
    }

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj) {
        typeof spfOrPath === "string" ?
            this._qqMiniShare_customConfig(title, spfOrPath, null, false, null, query) :
            this._qqMiniShare_customConfig(title, this.img2path(spfOrPath), null, false, null, query);
    }
    commonShare(type?: string, query?: PathObj) {
        this._qqMiniShare_bmsConfig(null, false, type, query);
    }
    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj) {
        console.log("[SOVHandler_qqMini][cbShare]");
        this._qqMiniShare_bmsConfig(onCpl, true, type, query);
    }
    groupShare(onCpl: fw.cb, shareGroupType: string, query?: PathObj) {
        console.log("[SOVHandler_qqMini][groupShare]");
        this._qqMiniShare_bmsConfig(onCpl, true, shareGroupType, query);
    }

    img2path(spf: cc.SpriteFrame) {
        console.log("[SOVHandler_qqMini][img2path]");
        try {
            let image = spf.getTexture().getHtmlElementObj();
            let canvas = wx.createCanvas();
            canvas.width = 500;
            canvas.height = 500;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, 500, 500);
            let tempFilePath = canvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: 500,
                height: 500,
                destWidth: 500,
                destHeight: 400
            });
            return tempFilePath;
        } catch (e) {
            console.error("[SOVHandler_qqMini][img2path] error", e);
            return this._defaultShareConfig.image;
        }
    }

    private _qqMiniShare_bmsConfig(onCpl?: (failReason?: string) => void, isGroupReturn?: boolean, type?: string, query?: ShareLaunchQuery) {
        let config = this._getRandomConfig();
        if (!config) return onCpl && onCpl("素材还没准备好哦");
        if (!query) query = {};
        query.bms = JSON.stringify(config);
        this._qqMiniShare_customConfig(config.title, config.image, onCpl, isGroupReturn, type, query);
        this._rq_BMS_SHARE_SHOW(config);
    }

    private _qqMiniShare_customConfig(
        title: string,
        image: string,
        onCpl?: (failReason?: string) => void,
        isGroupReturn?: boolean,
        type?: string,
        query?: ShareLaunchQuery
    ) {
        console.log("[SOVHandler_qqMini][_qqMiniShare_customConfig]" + isGroupReturn);
        if (!query) query = {};
        let shareInfo: any = {
            title,
            imageUrl: image,
            query: query && fw.Util.objToPath(query as PathObj),
        };
        this._shareHandler.share(onCpl, shareInfo, isGroupReturn);
    }

    private _getShareInfo_onMenuCb() {
        let config = this._getRandomConfig();
        if (!config) return;
        let query = { bms: JSON.stringify(config) };
        return {
            title: config.title,
            imageUrl: config.image,
            query: query && fw.Util.objToPath(query),
        };
    }
}

type ShareInfo = { title: string, imageUrl: string, query: string, success?: Function, fail?: Function };
interface WxShareHandler { share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean); dispose(); }
class WxShareHandler_RealCB implements WxShareHandler {
    constructor() { console.log("启用真微信回调"); }
    dispose() { console.log("移除真微信回调"); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        if (onCpl) {
            //shareInfo.success = (res) => { onCpl(res.shareTickets ? undefined : "请分享到群"); };
            shareInfo.success = (res) => onCpl(); // 群发不能判断群
            shareInfo.fail = (res) => onCpl("分享失败");
        }
        wx.shareAppMessage(shareInfo);
        console.log("分享信息1:", shareInfo);
    }
}
class WxShareHandler_FakeCB implements WxShareHandler {
    hasGetKey = false;
    delay = 2000;
    constructor() {  }
    dispose() { console.log("移除假微信回调"); window["wx"] && wx.offShow(this._fakeCb_bind); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        console.error("qq分享")
        if (false) {
            window["wx"] && wx.offShow(this._fakeCb_bind);
            fw.cls.sov.video(Const.VideoADType.TIPS_KEY, s => onCpl(s));
            return;
        } else {
            console.log("[WxShareHandler_FakeCB][share]" + isGroupReturn);
            if(!isGroupReturn){
                setTimeout(() => wx.shareAppMessage(shareInfo));
                return 
            }
            window["wx"] && wx.onShow(this._fakeCb_bind);
            this._shareInfo = shareInfo;
            this._isGroupReturn = isGroupReturn;
            this._fakeShareCb_temp = onCpl;
            this._fakeShareTime_temp = Date.now();
            console.log("分享信息2:" + isGroupReturn + this._isGroupReturn, shareInfo);
            setTimeout(() => wx.shareAppMessage(shareInfo));
        }

    }
    protected _isGroupReturn: boolean;
    protected _shareInfo: ShareInfo;
    protected _fakeCb_bind = this._fakeCb.bind(this);
    protected _fakeShareCb_temp: (failReason?: string) => void;
    protected _fakeShareTime_temp: number;
    protected _fakeCb() {
        window["wx"] && wx.offShow(this._fakeCb_bind);
        console.log("[分享回屏] 离屏用时:" + (Date.now() - this._fakeShareTime_temp)
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
                break;
            default:
                if (timeUp) {
                    if (this.hasGetKey) {
                        this.hasGetKey = false;
                        failReason = "同一个群一天只能领取一次，请分享不同群！";
                    } else {
                        successMsg = "即将获得奖励";
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
            var data = {
                /** 面板的标题文字, 不传则显示'提示' */
                titleText: "提示",
                /** 面板的内容文字, 不传则隐藏节点 */
                msgText: failReason,
                /** yes选项按键上的文字, 不传则显示'同意' */
                yesText: "继续分享",
                /** no选项按键上的文字, 不传则显示'取消' */
                noText: "取消",
                /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
                yesCB: () => { this.share(this._fakeShareCb_temp, this._shareInfo, this._isGroupReturn) },
                /** no选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
                noCB: () => {  },
            }
            common.sceneMgr.showChoosePanel(data);
            return;
        }
        // common.sceneMgr.showTipsUI(successMsg);
        setTimeout(() => cb(), 200);
    }
}
class WxShareHandler_ald extends WxShareHandler_FakeCB {
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo) {
        this._fakeShareCb_temp = onCpl;
        this._fakeShareTime_temp = Date.now();
        console.log("分享信息3:", shareInfo);
        wx.aldShareAppMessage(shareInfo);
    }
}