import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import SettingModel from "./SettingModel";
import { CallID } from "../../CallID";
import { Manager } from "../../framework/manager/Manager";
import { StorageID } from "../../StorageID";

/*
 * desc
 */
export class SettingController extends MVC.MController<SettingModel> {
    public constructor() {
        super();
        this.setup(SettingModel.getInstance);
        this.changeListener(true);
        this.onSettingInit();
    }
    public reset(): void { }

    public get classname(): string {
        return "SettingController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
        Notifier.changeCall(enable, CallID.Setting_IsMuteMusic, this.isMuteMusic, this);
        Notifier.changeCall(enable, CallID.Setting_IsMuteAudio, this.isMuteAudio, this);
        Notifier.changeCall(enable, CallID.Setting_GetRealDesignSize, this.getRealDesign, this);
    }

    private onSettingInit() {
        let storagedata = Manager.storage.getString(StorageID.Setting_Data, "");
        if (storagedata && storagedata != "") {
            SettingModel.getInstance.initSetting(JSON.parse(storagedata));
            Manager.audio.setMusicEnable(!SettingModel.getInstance.muteAudio);
            Manager.audio.setEnableAudio(!SettingModel.getInstance.muteAudio);
        }
    }

    private isMuteMusic(): boolean {
        return SettingModel.getInstance.muteMusic;
    }

    private isMuteAudio(): boolean {
        return SettingModel.getInstance.muteAudio;
    }

    private getRealDesign(): cc.Size {
        return SettingModel.getInstance.getRealDesignSize();
    }
}

