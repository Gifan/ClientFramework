import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
import { GameConst } from "../../config/yxj_gjj_const";
export default class QQPlayPlatformToolsCtrler implements IPlatformToolsCtrler {
    protected _kefuUrl;
    showKefu() {
        if (fw.bb.bms_launchConfig.value.kefutest) return this._showKefu();
        let tofus = fw.bb.bms_tofuConfig.value;
        for (let i = 0; i < tofus.length; i++)
            if (tofus[i].flag === "serviceQR")
                return BK.MQQ.Webview.open(tofus[i].poster);
        BK.MQQ.Webview.open("https://game.zuiqiangyingyu.net/wb_webview/sfq_gjj_privateMoney193/qqImage/kefu.html");
    }
    protected _defaultKefuUrl = "https://game.zuiqiangyingyu.net/wb_webview/sfq_gjj_privateMoney193/qqImage/kefu.html";
    _showKefu() {
        if (!this._kefuUrl) {
            let tofus = fw.bb.bms_tofuConfig.value;
            for (let i = 0; i < tofus.length; i++)
                if (tofus[i].flag !== "serviceQR") {
                    this._kefuUrl = this._defaultKefuUrl + "?url=" + encodeURIComponent(tofus[i].poster);
                    break;
                }
        }
        BK.MQQ.Webview.open(this._kefuUrl || this._defaultKefuUrl);

        //https://static.zuiqiangyingyu.cn/wxgame/ad/201901/dnRT27ypSN2ExyFQ.jpg
        //https://game.zuiqiangyingyu.net/wb_webview/sfq_gjj_privateMoney193/qqImage/kefu.html
    }
    showImage(url: string) { BK.MQQ.Webview.open(url); }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {
        var extendInfo = JSON.stringify({ "appname": GameConst.AppConst.BMS_APP_NAME }); //额外参数，必须为字符串
        console.log("要跳转的appId, extraData : ", appId, extendInfo);
        if (BK.QQ.skipGame) {
            BK.QQ.skipGame(appId, extendInfo);
            onCpl();
        } else {
            // fw.ui.showToast("QQ版本过低，跳转不了其它游戏");
            onCpl("请升级QQ版本才能跳转到其他游戏哦~");
        }
    }
}