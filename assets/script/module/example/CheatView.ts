import { MVC } from "../../framework/MVC";
import { Manager } from "../../util/Manager";
import { UserVo } from "../../vo/UserVo";
import { Log } from "../../framework/Log";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import GuideModel from "../guide/GuideModel";
import { AlertManager } from "../alert/AlertManager";
import ComposeModel from "../compose/ComposeModel";
import { Const } from "../../config/Const";
import { CallID } from "../../CallID";


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


    public onClearTimes() {
        Manager.vo.userVo.clickBuyTimes = {};
        Manager.vo.userVo.shopBuyTimesDiamond = {};
    }

    public onCheatClick() {
        this.cheatNode.active = !this.cheatNode.active;
        this.desc.string = this.cheatNode.active ? "关闭" : "秘籍";
        // let pos = Notifier.call(CallID.Common_GetMainViewCurrencyPosition, Const.CurrencyType.Diamond);
        // Notifier.send(ListenID.Common_GiftReward, 1300, pos, 1, 1);
        // Notifier.send(ListenID.Travel_CloseUnLockRole);
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


    public switchoffset(event: cc.Toggle, data) {
        // console.log(event);
        // GameVoManager.getInstance.myUserVo.isOpenOffset = event.isChecked;
    }

    public onAddDay() {
        Manager.vo.userVo.day++;
        Manager.vo.userVo.loginDay++;
        Manager.vo.userVo.composeBoxCount = 0;
        Manager.vo.userVo.composeBuyVidoeTimes = 0;
    }

    public onResetTaskLog() {
        Manager.vo.userVo.taskAchieveData = [];
        Manager.vo.userVo.taskDailyData = [];
        Manager.vo.userVo.taskLogList = {};
    }

    public setStage() {
        let id = Number(this.editBox.string);
        if (typeof id == 'number') {
            Manager.vo.userVo.topStage = id;
            AlertManager.showNormalTipsOnce("设置关卡成功!");
        }
    }

    public buyDog() {
        let id = Number(this.editBox.string);
        if (typeof id == 'number') {
            Notifier.send(ListenID.Compose_CheatBuy, id);
        }
    }

    public resetDrawTimes() {
        Manager.vo.userVo.lotteryTimes = 0;
    }

    public addRoleSpeed() {
        Notifier.send(ListenID.Travel_AddRoleSpeed);
    }

    public autoCompose() {
        ComposeModel.getInstance.setAutoComposeTime(100);
        Notifier.send(ListenID.Compose_CheckAutoCompose);
    }
}
