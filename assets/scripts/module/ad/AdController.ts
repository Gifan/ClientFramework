import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import AdModel from "./AdModel";
import { Const } from "../../config/Const";
import { AlertManager } from "../alert/AlertManager";
import { NotifyID } from "../../framework/notify/NotifyID";

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
        Notifier.changeListener(enable, ListenID.Ad_ShowBanner, this.showBanner, this);
        Notifier.changeListener(enable, ListenID.Ad_HideBanner, this.hideBanner, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowVideo, this.showVideo, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowFullVideo, this.showFullVideo, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowInsertAd, this.showInsertAd, this);
        Notifier.changeListener(enable, NotifyID.Game_Update, this.update, this);
        Notifier.changeListener(enable, ListenID.Ad_ShowAdDebuggView, this.showDebugView, this);
        Notifier.changeListener(enable, ListenID.Login_Finish, this.loginFinish, this);
    }
    loginFinish() {
    }

    public update(dt) {
    }

    public showBanner(type: Const.BannerADType = Const.BannerADType.LV_END) {//sdk自行控制
        wonderSdk.showBanner(<number>type, () => {

        });
    }
    public hideBanner() {
        wonderSdk.hideBanner();
    }
    private _isvideoOn: boolean = false;
    public showVideo(call: Function = null) {
        if (this._isvideoOn) return;
        this._isvideoOn = true;
        wonderSdk.showVideoAD(0, (code: wonderSdk.VideoAdCode, msg: string) => {
            this._isvideoOn = false;
            if (code == wonderSdk.VideoAdCode.COMPLETE) {
                call && call(1);
            } else if (code == wonderSdk.VideoAdCode.SHOW_SUCCESS) {

            }
            else {
                if (msg && msg != "") {
                    AlertManager.showNormalTips(msg);
                }
                call && call(0);
            }
        });
    }

    public showFullVideo() {
        wonderSdk.showFullVideoAD(0, (code: wonderSdk.VideoAdCode, msg: string) => {
            if (code == wonderSdk.VideoAdCode.SHOW_SUCCESS) {

            }
        });
    }

    public showInsertAd() {
        wonderSdk.showInsertAd();
    }

    private showDebugView() {
        if (wonderSdk.isGoogleAndroid || wonderSdk.isIOS) {
            //@ts-ignore
            wonderSdk._sdk.showDebugAdView();
        }
    }
}

