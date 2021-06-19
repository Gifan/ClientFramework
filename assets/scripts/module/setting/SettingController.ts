import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import SettingModel from "./SettingModel";
import { CallID } from "../../CallID";
import { StorageID } from "../../StorageID";
import { Manager } from "../../manager/Manager";
import { UIManager } from "../../manager/UIManager";

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
        Notifier.changeCall(enable, CallID.Setting_IsMuteShake, this.isMuteShake, this);
        Notifier.changeCall(enable, CallID.Setting_GetRealDesignSize, this.getRealDesign, this);
        Notifier.changeListener(enable, ListenID.Setting_MuteMusic, this.reqMuteMusic, this);
        Notifier.changeListener(enable, ListenID.Setting_MuteShake, this.reqMuteShake, this);
        Notifier.changeListener(enable, ListenID.Setting_PlayShake, this.shakeDevice, this);
        Notifier.changeListener(enable, ListenID.Setting_OpenView, this.openSettingView, this);
    }

    private onSettingInit() {
        let storagedata = Manager.storage.getString(StorageID.Setting_Data, "");
        if (storagedata && storagedata != "") {
            this._model.initSetting(JSON.parse(storagedata));
            Manager.audio.setMusicEnable(!this._model.muteAudio, 1);
            Manager.audio.setEnableAudio(!this._model.muteAudio);
        }
        Manager.vo.designSize = this._model.getRealDesignSize();
        // 关闭多点触摸
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    private isMuteMusic(): boolean {
        return this._model.muteMusic;
    }

    private isMuteAudio(): boolean {
        return this._model.muteAudio;
    }

    private isMuteShake(): boolean {
        return this._model.muteShake;
    }

    private getRealDesign(): cc.Size {
        return this._model.getRealDesignSize();
    }

    private shakeDevice(type: number = 0) {
        if (!this._model.muteShake) {
            wonderSdk.vibrate(type);
        }
    }

    private reqMuteMusic(enable: boolean) {
        this._model.muteMusic = !!enable;
        this._model.muteAudio = !!enable;
        Manager.audio.setMusicEnable(!enable);
        Manager.audio.setEnableAudio(!enable);
        this.reqSave();
    }

    private reqMuteShake(enable: boolean) {
        this._model.muteShake = !!enable;
        this.reqSave();
    }

    public reqSave() {
        Manager.storage.setString(StorageID.Setting_Data, this._model.serialize());
    }

    public openSettingView(){
        UIManager.Open("ui/setting/SettingView", MVC.openArgs().setUiLayer(MVC.eUILayer.Popup).setTransition(MVC.eTransition.EaseScale));
    }
}

