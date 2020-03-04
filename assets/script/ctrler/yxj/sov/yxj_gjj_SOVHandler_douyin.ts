import SOVHandler_Base from "./yxj_gjj_SOVHandler";
import { ShareLaunchQuery } from "../../../sdk/wx/yxj_gjj_WxChannelCtrler";
import { ProjectConst } from "../../../config/yxj_gjj_projectConst";
declare var wx:any;
export default class SOVHandler_Douyin extends SOVHandler_Base {

    protected _hasCbVersion: boolean;
    protected _shareHandler: WxShareHandler;
    protected _useAldShare: boolean;

    constructor() {
        super();
        let useAldShare: boolean = this._useAldShare = ProjectConst.AppConst.ALD_SDK_ID !== "";
        if (useAldShare) {
            this._shareHandler = new WxShareHandler_ald();
            wx.aldOnShareAppMessage && wx.aldOnShareAppMessage(() => this._getShareInfo_onMenuCb());
        }
        else {
            this._calculVersion(fw.bb.bms_launchConfig.value.shareVersion);
            wx.onShareAppMessage && wx.onShareAppMessage(() => this._getShareInfo_onMenuCb());
        }
        wx.updateShareMenu && wx.updateShareMenu({ withShareTicket: true }); // 获取群唯一标记, 去掉之后可以群发分享
    }

    protected on_bms_launchConfig_vc(nv: any) {
        super.on_bms_launchConfig_vc(nv);
        this._useAldShare || this._calculVersion(nv.shareVersion);
    }

    protected _calculVersion(shareVersion: string) {
        this._hasCbVersion = fw.Util.compareVersion(wx.getSystemInfoSync().version, shareVersion) === -1;
        console.log("[对比版本]", wx.getSystemInfoSync().version, shareVersion, this._hasCbVersion);
        this._shareHandler && this._shareHandler.dispose();
        this._shareHandler = new WxShareHandler_RealCB();
    }

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj) {
        typeof spfOrPath === "string" ?
            this._wxShare_customConfig(title, spfOrPath, null, false, null, query) :
            this._wxShare_customConfig(title, this.img2path(spfOrPath), null, false, null, query);
    }
    commonShare(type?: string, query?: PathObj) {
        this._wxShare_bmsConfig(null, false, type, query);
    }
    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj) {
        console.log("[SOVHandler_Wx][cbShare]");
        this._wxShare_bmsConfig(onCpl, false, type, query);
    }
    groupShare(onCpl: fw.cb, shareGroupType: string, query?: PathObj) {
        console.log("[SOVHandler_Wx][groupShare]");
        this._wxShare_bmsConfig(onCpl, true, shareGroupType, query);
    }

    img2path(spf: cc.SpriteFrame) {
        console.log("[SOVHandler_Wx][img2path]");
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
            console.error("[SOVHandler_Wx][img2path] error", e);
            return this._defaultShareConfig.image;
        }
    }

    private _wxShare_bmsConfig(onCpl?: (failReason?: string) => void, isGroupReturn?: boolean, type?: string, query?: ShareLaunchQuery) {
        let config = this._getRandomConfig();
        if (!config) return onCpl && onCpl("素材还没准备好哦");
        if (!query) query = {};
        query.bms = JSON.stringify(config);
        this._wxShare_customConfig(config.title, config.image, onCpl, isGroupReturn, type, query);
        this._rq_BMS_SHARE_SHOW(config);
    }

    private _wxShare_customConfig(
        title: string,
        image: string,
        onCpl?: (failReason?: string) => void,
        isGroupReturn?: boolean,
        type?: string,
        query?: ShareLaunchQuery
    ) {
        console.log("[SOVHandler_Wx][_wxShare_customConfig]" + isGroupReturn);
        if (!query) query = {};
        // if (fw.lsd.firstSource.value) {
        //     query.promoSource = fw.lsd.firstSource.value;
        //     query.promoLv = fw.lsd.promoLv.value;
        // }
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
    constructor() { console.log("启用真抖音回调"); }
    dispose() { console.log("移除真抖音回调"); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        if (onCpl) {
            //shareInfo.success = (res) => { onCpl(res.shareTickets ? undefined : "请分享到群"); };
            shareInfo.success = (res) => onCpl(); // 群发不能判断群
            shareInfo.fail = (res) => onCpl("分享失败");
        }
        wx.shareAppMessage(shareInfo);
        console.log("分享信息:", shareInfo);
    }
}
class WxShareHandler_FakeCB implements WxShareHandler {
    delay = 0;
    constructor() { console.log("启用假抖音回调"); wx.onShow(this._fakeCb_bind); }
    dispose() { console.log("移除假抖音回调"); wx.offShow(this._fakeCb_bind); }
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo, isGroupReturn: boolean) {
        console.log("[WxShareHandler_FakeCB][share]" + isGroupReturn);
        this._isGroupReturn = isGroupReturn;
        this._fakeShareCb_temp = onCpl;
        this._fakeShareTime_temp = Date.now();
        console.log("分享信息:" + isGroupReturn + this._isGroupReturn, shareInfo);
        setTimeout(() => wx.shareAppMessage(shareInfo));
    }
    protected _isGroupReturn: boolean;
    protected _fakeCb_bind = this._fakeCb.bind(this);
    protected _fakeShareCb_temp: (failReason?: string) => void;
    protected _fakeShareTime_temp: number;
    protected _fakeCb() {
        if (!this._fakeShareCb_temp) return;
        let cb = this._fakeShareCb_temp;
        this._fakeShareCb_temp = null;
        console.log("[假分享回屏] 离屏用时:" + (Date.now() - this._fakeShareTime_temp)
            + ", 今日分享次数:" + fw.lsd.shareCount.value, this._isGroupReturn);
        if (Date.now() - this._fakeShareTime_temp < this.delay)
            return cb("分享失败");

        if (this._isGroupReturn)
            return cb();

        let successMsg: string;
        let failReason: string;
        switch (++fw.lsd.shareCount.value) {
            case 1: successMsg = "本次为赠送提示，下次分享群可得提示"; break;
            case 2: successMsg = "即将获得奖励"; break;
            case 3: failReason = "分享检查失败，麻烦请重新分享群"; break;
            case 4:
            case 5: successMsg = "即将获得奖励"; break;
            case 6: failReason = "分享失败，请重新分享群"; fw.lsd.shareCount.value = 3; break;
            default: successMsg = "";
        }

        if (failReason) return cb(failReason);

        // fw.ui.showToast(successMsg);
        setTimeout(() => cb(), 2000);
    }
}
class WxShareHandler_ald extends WxShareHandler_FakeCB {
    share(onCpl: (failReason?: string) => void, shareInfo: ShareInfo) {
        this._fakeShareCb_temp = onCpl;
        this._fakeShareTime_temp = Date.now();
        console.log("分享信息:", shareInfo);
        wx.aldShareAppMessage(shareInfo);
    }
}