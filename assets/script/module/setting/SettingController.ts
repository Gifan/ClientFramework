import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import SettingModel from "./SettingModel";
import { CallID } from "../../CallID";
import { Manager } from "../../util/Manager";
import { StorageID } from "../../StorageID";
import { Const } from "../../config/Const";
import { Log } from "../../framework/Log";

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
        Notifier.changeListener(enable, ListenID.Setting_MuteMusic, this.reqMuteMusic, this);
    }

    private onSettingInit() {
        let storagedata = Manager.storage.getString(StorageID.Setting_Data, "");
        if (storagedata && storagedata != "") {
            this._model.initSetting(JSON.parse(storagedata));
            Manager.audio.setMusicEnable(this._model.muteAudio, 1);
            Manager.audio.setEnableAudio(this._model.muteAudio);
        }
    }

    private isMuteMusic(): boolean {
        return this._model.muteMusic;
    }

    private isMuteAudio(): boolean {
        return this._model.muteAudio;
    }

    private getRealDesign(): cc.Size {
        return this._model.getRealDesignSize();
    }

    private reqMuteMusic(enable: boolean) {
        this._model.muteMusic = !!enable;
        this._model.muteAudio = !!enable;
        Manager.audio.setMusicEnable(!!enable);
        Manager.audio.setEnableAudio(!!enable);
        this.reqSave();
    }

    public reqSave() {
        Manager.storage.setString(StorageID.Setting_Data, this._model.serialize());
    }
}

