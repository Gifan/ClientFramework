import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import AdModel from "./AdModel";
import { Const } from "../../config/Const";
// import { EventDefine } from "../../config/EventCfg";
import { AlertManager } from "../alert/AlertManager";
import { Log } from "../../framework/Log";

/*
 * desc
 */
export class AdController extends MVC.MController<AdModel> {
    public constructor() {
        super();
        this.setup(AdModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "AdController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowBanner, this.showBanner, this);
        Notifier.changeListener(enable, ListenID.Ad_HideBanner, this.hideBanner, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowVideo, this.showVideo, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowFullVideo, this.showFullVideo, this);
    }

    private _showBannerNum: number = 0;
    public showBanner(type: Const.BannerADType = Const.BannerADType.LV_END) {//sdk自行控制
        // this._showBannerNum++;
        wonderSdk.showBanner(<number>type, () => {
            // if (this._showBannerNum <= 0) {
            // fw.sdk.hideBannerAd();
            // }
        });
    }
    public hideBanner() {
        // this._showBannerNum--; sdk自己控制对应处理逻辑
        // if (this._showBannerNum <= 0) {
        // this._showBannerNum = 0;
        // fw.sdk.hideBannerAd();
        // }
        wonderSdk.hideBanner();
    }
    public showVideo(call: Function = null) {
        // Notifier.send(ListenID.Event_SendEvent, EventDefine.ad_success_rewarde_count, 1);
        wonderSdk.showVideoAD(0, (code: wonderSdk.VideoAdCode, msg: string) => {
            if (code == wonderSdk.VideoAdCode.COMPLETE) {
                call && call(1);
            } else if (code == wonderSdk.VideoAdCode.SHOW_SUCCESS) {
                // Notifier.send(ListenID.Event_SendEvent, EventDefine.out_rewarde_count, 1);
            }
            else {
                if (msg && msg != "") {
                    AlertManager.showNormalTips(msg);
                }
                call && call(0);
            }
        });
        // s => s ? (call && call(0), AlertManager.showNormalTips(s)) : (Notifier.send(ListenID.Task_UpdateTaskProgress, Const.TaskSubType.LookVideo, 1), call && call(1))
    }

    public showFullVideo(){
        wonderSdk.showFullVideoAD(0, (code: wonderSdk.VideoAdCode, msg: string) => {
            if(code == wonderSdk.VideoAdCode.SHOW_SUCCESS){
                Log.log("showFull success");
            }
        });
    }
}

