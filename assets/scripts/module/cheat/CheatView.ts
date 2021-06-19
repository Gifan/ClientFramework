import { MVC } from "../../framework/MVC";
import { UserVo } from "../../vo/UserVo";
import { Manager } from "../../manager/Manager";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { UIManager } from "../../manager/UIManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CheatView extends MVC.BaseView {

    @property(cc.Node)
    cheatNode: cc.Node = null;

    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Toggle)
    adToggle: cc.Toggle = null;

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调，每次打开只调用一次
     */
    public onOpen(): void {
        super.onOpen();
        if (wonderSdk.isTest) {
            this.adToggle.check();
        } else {
            this.adToggle.uncheck();
        }
    }

    public onShowFinish() {
        super.onShowFinish();
        this.offTouch();
    }
    /*
     * 关闭界面回调，每次打开只调用一次
     */
    public onClose(): void {
        super.onClose();
    }



    public onCheatClick() {
        this.cheatNode.active = !this.cheatNode.active;
        this.desc.string = this.cheatNode.active ? "关闭" : "秘籍";
    }

    public resetUserVo() {
        let a = new UserVo();
        Manager.vo.userVo.updatetUserVo(a);
        Manager.vo.updateLocalUserData(JSON.stringify(a.serializeAll()))
    }

    public onPhysicDrawSwitch(target: cc.Toggle) {
        let boo = target.isChecked;
        Notifier.send(ListenID.Cheat_PhysicsDebug, boo);
    }

    public setStage() {
        let stageid = this.editBox.string;
        let num = Number(stageid);
    }

    public addMoney() {
        Manager.vo.setGold(2000);
        Manager.vo.setPower(10);
    }

    public onWatchVideo(target: cc.Toggle) {
        let boo = target.isChecked;
        wonderSdk.isTest = boo;
    }

    public onClickAdDebug() {
        Notifier.send(ListenID.Ad_ShowAdDebuggView);
    }

    public addADay(){
        Manager.vo.userVo.loginDay++;
        Manager.vo.saveUserData();
    }
}
