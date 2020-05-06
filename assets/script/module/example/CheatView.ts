import { MVC } from "../../framework/MVC";
import { Manager } from "../../util/Manager";
import { UserVo } from "../../vo/UserVo";
import { Notifier } from "../../framework/notify/Notifier";
import { CallID } from "../../CallID";
import { ListenID } from "../../ListenID";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CheatView extends MVC.BaseView {

    @property(cc.Node)
    cheatNode: cc.Node = null;

    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调，每次打开只调用一次
     */
    public onOpen(): void {
        super.onOpen();
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

    public addMoney() {
        Manager.vo.setGold(100000);
        Manager.vo.setDiamond(100000);

    }
}
