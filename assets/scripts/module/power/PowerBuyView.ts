import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { AlertManager } from "../alert/AlertManager";
import { Const } from "../../config/Const";
import PowerModel from "./PowerModel";
import { Manager } from "../../manager/Manager";
import { EventDefine } from "../../config/EventCfg";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Power/PowerBuyView")
export class PowerView extends MVC.BaseView {

    @property(cc.Label)
    tipsText: cc.Label = null;

    @property(cc.Label)
    powerText: cc.Label = null;

    @property(cc.Node)
    bgClose: cc.Node = null;

    protected changeListener(enable: boolean): void {

    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
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

    public onClickClose() {
        this.close();
    }

    public onClickGetKey() {
        Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_noenergy);
        Notifier.send(ListenID.Ad_ShowVideo, code => {
            if (code == 1) {
                let add = 10;//PowerModel.getInstance.getCurPower();
                if (add > 0) {
                    Manager.vo.setPower(add);
                    AlertManager.showCurrency(add, Const.CurrencyType.Power);
                } else {
                    AlertManager.showNormalTipsOnce("体力已满");
                }
                if(this._openArgs.callback){
                    this._openArgs.callback(0,null);
                    this._openArgs.setCallback(null);
                }
                this.close();
            }
        });
    }

}
