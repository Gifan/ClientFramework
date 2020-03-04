import { GameConst } from "../../../config/yxj_gjj_const";
let common = require('zqddn_zhb_Common');
/** [视频/分享 类型] 指示下一个进行'视频/分享'操作的状态, 用于查询后显示对应的ui或文案 */
export enum VOSType {
    /** 无意义 */
    NONE,
    /** 视频广告 */
    VIDEO_AD,
    /** 任何的分享行为 */
    SHARE_ANY,
    /** 必须带有回调的分享行为 */
    SHARE_CB,
    /** 必须分享到群的分享行为 */
    SHARE_GROUP,
}

type BmsShareConfig = dto.HTTP.BMS_SHARE_CONFIG.item;
/** share and video */
export default class SOVHandler_Base {

    vosType: VOSType;
    get isIpShield(): boolean { return fw.bb.bms_ipShield.value; };
    protected _maxVideoCount = 10;
    protected _defaultShareConfig: BmsShareConfig = {
        id: "1195",
        position: "3",
        title: "让你智商充个值",
        image: "",
    } as any;

    constructor() {
        this.vosType = VOSType.NONE;
        // fw.bb.bms_launchConfig.on(this.on_bms_launchConfig_vc, this);
        // fw.bb.bms_shareConfig.on(this.on_bms_shareConfig_vc, this);
        // fw.bb.bms_ipShield.on(this.on_bms_ipShield_vc, this);
    }
    protected on_bms_launchConfig_vc(nv: dto.HTTP.BMS_LAUNCH_CONFIG.rp) {
        this.vosType = nv.tips === 1 ? VOSType.VIDEO_AD : VOSType.NONE;
        // console.log("[分享][bms] 是否使用4型分享图:" + this.use4);
    }
    protected on_bms_shareConfig_vc(nv: BmsShareConfig[]) {
        if (!nv) return;
        for (let i = 0; i < nv.length; i++) {
            const item = nv[i];
            if (item.position == "4") this.configs_4.push(item);
            else this.configs.push(item);
        }
    }
    protected on_bms_ipShield_vc(nv: boolean) {
        // console.log("[分享][ip] 是否使用4型分享图:" + this.use4);
    }

    protected configs: BmsShareConfig[] = [];
    protected configs_4: BmsShareConfig[] = [];

    protected _getRandomConfig(): BmsShareConfig {
        var data = common.getShareInfo(3);
        console.log(data,'data=================');
        return data;
    }

    protected _rq_BMS_SHARE_SHOW(config: BmsShareConfig) {
        if (!fw.bb.sys_openId.value) return;
        fw.net.httpPost(cst.Url.BMS_SHARE_SHOW, {
            app_name: GameConst.AppConst.BMS_APP_NAME,
            open_id: fw.bb.sys_openId.value,
            position: config.position,
            share_id: config.id,
            share_title: config.title,
        });
    }

    warnVideo(onCpl: (s?: string, code?) => void, type: string) {
        let onSdkVideoCpl = (s?: string, code?) => {
            if (!s) return onCpl && onCpl();
            if (code !== fw.sdk.VideoADFailCode.NOT_COMPLITE) return onCpl && onCpl(s, code);
            var data = {
                /** 面板的内容文字, 不传则隐藏节点 */
                msgText: "看完整视频才能获得奖励",
                /** yes选项按键上的文字, 不传则显示'同意' */
                yesText: "继续观看",
                /** no选项按键上的文字, 不传则显示'取消' */
                noText: "关闭",
                /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
                yesCB: () => setTimeout(() => fw.sdk.showVideoAD(onSdkVideoCpl, type), 100) && false,
                noCB: () => onCpl && onCpl("没看完视频"),
            }
            common.sceneMgr.showChoosePanel(data);
        }
        fw.sdk.showVideoAD(onSdkVideoCpl, type);
    }

    vad2Share(onCpl: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        let onSovCpl = (failReason?: string) => {
            onCpl && onCpl(failReason);
        };
        let onWarnVideoCpl = (s, code) => {
            if (!s) return onSovCpl();
            if (true) return onSovCpl(s);
            if (code === fw.sdk.VideoADFailCode.NOT_READY) return onSovCpl(s);
            setTimeout(() => this.cbShare(onSovCpl, type, query, arg), 100);
        }
        this.warnVideo(onWarnVideoCpl, type);
    }

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj, arg?: any) {
        // fw.ui.showNotify({
        //     titleText: "本平台暂不支持分享",
        //     tipsMsg: "分享内容如下:\n[非配置内容] [" + title + "]\n"
        //         + (query ? "[" + fw.Util.objToPath(query) + "]\n" : "") + "此分享不需要回调",
        //     acceptText: "分享结束",
        // });
    }

    commonShare(type?: string, query?: PathObj, arg?: any) {
        console.log("commonShare")
        let config = this._getRandomConfig();
        if (!config) return;
        // fw.ui.showNotify({
        //     titleText: "本平台暂不支持分享",
        //     tipsMsg: "分享内容如下:\n[" + config.id + "] [" + config.title + "]\n"
        //         + (query ? "[" + fw.Util.objToPath(query) + "]\n" : "") + "此分享不需要回调",
        //     acceptText: "分享结束",
        // });
    }

    groupShare(onCpl: fw.cb, shareGroupType: string, query?: PathObj) {
        this.cbShare(onCpl, shareGroupType, query);
    }

    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        let config = this._getRandomConfig();
        if (!config) return;
        var data = {
            titleText: "本平台暂不支持分享",
            /** 面板的内容文字, 不传则隐藏节点 */
            msgText: "分享内容如下:\n[" + config.id + "] [" + config.title + "]\n选择分享回调是否成功",
            /** yes选项按键上的文字, 不传则显示'同意' */
            yesText: "分享成功",
            /** no选项按键上的文字, 不传则显示'取消' */
            noText: "分享失败",
            /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            yesCB: () => (onCpl(), false),
            noCB: () => (onCpl("由于神秘原因导致分享失败"), false),
        }
        common.sceneMgr.showChoosePanel(data);
    }
}
