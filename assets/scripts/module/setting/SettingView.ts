import { CallID } from "../../CallID";
import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import SettingModel from "./SettingModel";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Setting/SettingView")
export class SettingView extends MVC.BaseView {

    @property(cc.Node)
    btnAudo: cc.Node = null;

    @property(cc.Node)
    btnShake: cc.Node = null;

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调
     * 打开的时候回调一次
     */
    protected onOpen(): void {
        super.onOpen();
        let bool = SettingModel.getInstance.muteMusic;
        this.setAudioEnable(!bool);
        bool = SettingModel.getInstance.muteShake;
        this.setShakeEnable(!bool);
        Notifier.send(ListenID.Ad_ShowFullVideo);
        
    }

    private setAudioEnable(enable: boolean) {
        this.btnAudo.children[0].active = !enable;
        this.btnAudo.children[1].active = enable;
    }

    private setShakeEnable(enable: boolean) {
        this.btnShake.children[0].active = !enable;
        this.btnShake.children[1].active = enable;
    }

    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }

    /*
     * 关闭界面后
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
    }

    public onClickAudio() {
        let bool = SettingModel.getInstance.muteMusic;// Notifier.call(CallID.Setting_IsMuteMusic);
        Notifier.send(ListenID.Setting_MuteMusic, !bool);
        this.setAudioEnable(bool);
    }

    public onClickShake() {
        let bool = SettingModel.getInstance.muteShake;// Notifier.call(CallID.Setting_IsMuteShake);
        Notifier.send(ListenID.Setting_MuteShake, !bool);
        this.setShakeEnable(bool);
    }

}
