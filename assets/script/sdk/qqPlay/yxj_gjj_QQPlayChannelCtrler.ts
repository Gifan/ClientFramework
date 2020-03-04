import IChannelCtrler, { ChannelData, ChannelType } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IChannelCtrler";
declare var GameStatusInfo:any;
export default class QQPlayChannelCtrler implements IChannelCtrler {
    data: ChannelData;
    constructor(defaultChannel: string) {
        let appname;
        console.log("qq的全局状态信息GameStatusInfo", GameStatusInfo)
        if (GameStatusInfo.gameParam) {
            var gameParam;
            try { gameParam = JSON.parse(GameStatusInfo.gameParam); }
            catch (e) {
                console.error("GameStatusInfo.gameParam 不是 Json", e)
                this.data = { enterSource: defaultChannel, type: ChannelType.NONE };
                return;
            }
            console.log("qq启动参数渠道拓展信息", gameParam);
            if (gameParam.appname) {
                console.log("qq启动参数渠道拓展信息2", gameParam.appname);
                appname = gameParam.appname;
                console.log("当前的跳转渠道来源appname是", appname);
                this.data = { enterSource: appname, type: ChannelType.EVERY_SOURCE }
            }
            else if (gameParam.cm_game_id) {
                console.log("qq启动参数渠道拓展信息2", gameParam.cm_game_id);
                appname = gameParam.cm_game_id;
                console.log("当前的跳转渠道来源appname是", appname);
                this.data = { enterSource: appname, type: ChannelType.EVERY_SOURCE }
            }
            else if (gameParam.bms) {
                console.log("qq启动分享拓展信息1", gameParam.bms);
                // console.log("qq启动分享拓展信息2",JSON.parse(gameParam.bms));
                this.data = { enterSource: "dialog", type: ChannelType.SHARE, bms: gameParam.bms }; // 分享
            }
            else {
                for (var k in gameParam) {
                    this.data = { enterSource: gameParam[gameParam[k]], type: ChannelType.SHARE, bms: gameParam.bms }; // 
                    break;
                }
            }
        } else {
            console.log("没有任何渠道来源")
            this.data = { enterSource: defaultChannel, type: ChannelType.NONE };
        }

    }

    protected _tryGetQQChannel(obj) {
        let data: ChannelData;
        try {
            if (!obj) return;
            else if (obj.scene) data = { enterSource: obj.scene, type: ChannelType.QRCODE }; // 二维码
            else if (obj.source) data = { enterSource: obj.source, type: ChannelType.EVERY_SOURCE }; // 渠道
            else if (obj.bms) data = { enterSource: "dialog", type: ChannelType.SHARE, bms: JSON.parse(decodeURIComponent(obj.bms)) }; // 分享
        } catch (e) { console.error("[WxChannelHandler][tryGetWxChannel]", e); }
        return data;
    }
}
