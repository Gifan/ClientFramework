import IChannelCtrler, { ChannelData, ChannelType } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IChannelCtrler";

export default class DouyinChannelCtrler implements IChannelCtrler {

    data: ChannelData;
    constructor(defaultChannel: string) {
        let lauchOpts = wx.getLaunchOptionsSync();
        console.log("[微信渠道][微信启动参数]", lauchOpts);
        this.data = this._tryGetWxChannel(lauchOpts.query)
            || this._tryGetWxChannel(lauchOpts.referrerInfo && lauchOpts.referrerInfo.extraData)
            || { enterSource: defaultChannel, type: ChannelType.NONE };
        console.log("[微信渠道][获取渠道]", this.data);
        this._checkPromoSource(this.data, defaultChannel);
    }

    protected _getScene(scene: Scene) {
        switch (scene) {
            case 1011:
            case 1012:
            case 1013:
            case 1047:
            case 1048:
            case 1049:
                return ChannelType.QRCODE;
            case 1007:
            case 1008:
            case 1036:
            case 1044:
                return ChannelType.SHARE;
            case 1037:
            case 1012:
            case 1013:
                return ChannelType.EVERY_SOURCE;
            default: break;
        }
    }

    protected _tryGetWxChannel(obj: LaunchQuery) {
        let data: ChannelData;
        try {
            if (!obj) return;
            else if (obj.scene) data = { enterSource: obj.scene, type: ChannelType.QRCODE }; // 来自二维码
            else if (obj.source) data = { enterSource: obj.source, type: ChannelType.EVERY_SOURCE }; // 来自跳转
            else if (obj.bms || obj.promoSource) { // 来自分享
                let bms = obj.bms && JSON.parse(decodeURIComponent(obj.bms));
                let promoSource = obj.promoSource;
                let promoLv = obj.promoLv;
                data = { enterSource: "dialog", type: ChannelType.SHARE, bms, promoSource, promoLv };
            }
        } catch (e) { console.error("[WxChannelHandler][tryGetWxChannel]", e); }
        return data;
    }

    protected _checkPromoSource(data: ChannelData, defaultChannel: string) {
        let promo = data.promoSource || data.enterSource; // 二者不会同时存在
        if (!promo || promo === defaultChannel || promo === "dialog") {
            data.promoSource = undefined;
            console.log("[微信渠道][检查推广来源] 默认渠道不作推广来源", promo);
            return;
        }
        data.promoSource = promo;
        data.promoLv = (parseInt(data.promoLv + "") || 0) + 1;
        console.log("[微信渠道][检查推广来源] 包含推广来源", data);
    }
}

type LaunchQuery = ShareLaunchQuery & QrCodeLaunchQuery & AppJumpLaunchQuery;
export type ShareLaunchQuery = {
    /** 分享回报, 分享时写入的一个BMS分享配置,  */
    bms?: string;
    /** 推广来源 */
    promoSource?: string;
    /** 推广级别 */
    promoLv?: number;
}
type QrCodeLaunchQuery = {
    /** 二维码来源, 二维码跳转协议 */
    scene?: string;
}
type AppJumpLaunchQuery = {
    /** 渠道来源 */
    source?: string;
}

//#region [场景值]

type Scene =
    /** 发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表） */
    1001 |
    /** 顶部搜索框的搜索结果页 */
    1005 |
    /** 发现栏小程序主入口搜索框的搜索结果页 */
    1006 |
    /** 单人聊天会话中的小程序消息卡片 */
    1007 |
    /** 群聊会话中的小程序消息卡片 */
    1008 |
    /** 扫描二维码 */
    1011 |
    /** 长按图片识别二维码 */
    1012 |
    /** 手机相册选取二维码 */
    1013 |
    /** 小程序模板消息 */
    1014 |
    /** 前往体验版的入口页 */
    1017 |
    /** 微信钱包 */
    1019 |
    /** 公众号 profile 页相关小程序列表 */
    1020 |
    /** 聊天顶部置顶小程序入口 */
    1022 |
    /** 安卓系统桌面图标 */
    1023 |
    /** 小程序 profile 页 */
    1024 |
    /** 扫描一维码 */
    1025 |
    /** 附近小程序列表 */
    1026 |
    /** 顶部搜索框搜索结果页「使用过的小程序」列表 */
    1027 |
    /** 我的卡包 */
    1028 |
    /** 卡券详情页 */
    1029 |
    /** 自动化测试下打开小程序 */
    1030 |
    /** 长按图片识别一维码 */
    1031 |
    /** 手机相册选取一维码 */
    1032 |
    /** 微信支付完成页 */
    1034 |
    /** 公众号自定义菜单 */
    1035 |
    /** App 分享消息卡片 */
    1036 |
    /** 小程序打开小程序 */
    1037 |
    /** 从另一个小程序返回 */
    1038 |
    /** 摇电视 */
    1039 |
    /** 添加好友搜索框的搜索结果页 */
    1042 |
    /** 公众号模板消息 */
    1043 |
    /** 带 shareTicket 的小程序消息卡片 详情 */
    1044 |
    /** 朋友圈广告 */
    1045 |
    /** 朋友圈广告详情页 */
    1046 |
    /** 扫描小程序码 */
    1047 |
    /** 长按图片识别小程序码 */
    1048 |
    /** 手机相册选取小程序码 */
    1049 |
    /** 卡券的适用门店列表 */
    1052 |
    /** 搜一搜的结果页 */
    1053 |
    /** 顶部搜索框小程序快捷入口 */
    1054 |
    /** 音乐播放器菜单 */
    1056 |
    /** 钱包中的银行卡详情页 */
    1057 |
    /** 公众号文章 */
    1058 |
    /** 体验版小程序绑定邀请页 */
    1059 |
    /** 微信连Wi-Fi状态栏 */
    1064 |
    /** 公众号文章广告 */
    1067 |
    /** 附近小程序列表广告 */
    1068 |
    /** 移动应用 */
    1069 |
    /** 钱包中的银行卡列表页 */
    1071 |
    /** 二维码收款页面 */
    1072 |
    /** 客服消息列表下发的小程序消息卡片 */
    1073 |
    /** 公众号会话下发的小程序消息卡片 */
    1074 |
    /** 摇周边 */
    1077 |
    /** 连Wi-Fi成功页 */
    1078 |
    /** 微信游戏中心 */
    1079 |
    /** 客服消息下发的文字链 */
    1081 |
    /** 公众号会话下发的文字链 */
    1082 |
    /** 朋友圈广告原生页 */
    1084 |
    /** 微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏） */
    1089 |
    /** 长按小程序右上角菜单唤出最近使用历史 */
    1090 |
    /** 公众号文章商品卡片 */
    1091 |
    /** 城市服务入口 */
    1092 |
    /** 小程序广告组件 */
    1095 |
    /** 聊天记录 */
    1096 |
    /** 微信支付签约页 */
    1097 |
    /** 页面内嵌插件 */
    1099 |
    /** 公众号 profile 页服务预览 */
    1102 |
    /** 发现栏小程序主入口，「我的小程序」列表（基础库2.2.4版本起废弃） */
    1103 |
    /** 微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃） */
    1104;

//#endregion [场景值]
