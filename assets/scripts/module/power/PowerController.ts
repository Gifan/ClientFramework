import { CallID } from "../../CallID";
import { Const } from "../../config/Const";
import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { NotifyID } from "../../framework/notify/NotifyID";
import { ListenID } from "../../ListenID";
import { Manager } from "../../manager/Manager";
import { Time } from "../../manager/Time";
import { UIManager } from "../../manager/UIManager";
import PowerModel from "./PowerModel";

/*
 * desc
 */
export class PowerController extends MVC.MController<PowerModel> {
    public constructor() {
        super();
        this.setup(PowerModel.getInstance);
        this.changeListener(true);
    }
    private isInit: boolean = false;
    public reset(): void { }

    public get classname(): string {
        return "PowerController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, NotifyID.Game_Update, this.updateModel, this);
        Notifier.changeCall(enable, CallID.Power_GetPowerCountTime, this.getPowerCountTime, this);
        Notifier.changeListener(enable, ListenID.Power_OpenBuyView, this.onOpenBuyView, this);
        Notifier.changeListener(enable, ListenID.Power_CloseBuyView, this.onCloseBuyView, this);
        Notifier.changeListener(enable, ListenID.Login_Finish, this.initTime, this);
        Notifier.changeListener(enable, ListenID.Power_SetPowerVisible, this.onOpenPowerView, this);
    }

    public onOpenPowerView(boo) {
        let obj = new MVC.OpenArgs();
        obj.setUiLayer(MVC.eUILayer.Tips).setParam(boo);
        UIManager.Open('ui/power/PowerView', obj);
    }

    public onOpenBuyView(callback) {
        let obj = MVC.openArgs().setUiLayer(MVC.eUILayer.SubPopup).setTransition(MVC.eTransition.EaseScale).setCallback(callback);
        UIManager.Open('ui/power/PowerBuyView', obj);
    }
    public onCloseBuyView() {
        UIManager.Close('ui/power/PowerBuyView');
    }

    public initTime() {
        this.isInit = true;
        if (Manager.vo.userVo.powerRecoverTime <= 0) {
            Manager.vo.userVo.powerRecoverTime = Time.serverTimeMs;
            Manager.vo.userVo.nextPowerTime = Manager.vo.userVo.powerRecoverTime + this._model.powerRecorverTime * 1000;
        } else if (Manager.vo.userVo.nextPowerTime <= 0) {
            Manager.vo.userVo.nextPowerTime = Manager.vo.userVo.powerRecoverTime + this._model.powerRecorverTime * 1000;
        }
        this.refreshPowerTime();
    }
    public updateModel(dt) {
        if (Manager.vo.isGetData && this.isInit) {
            this._model.updatePower(dt);
        }
    }
    public refreshPowerTime() {
        if (Manager.vo.isGetData) {
            this._model.refreshPowerTime();
        }
    }
    public getPowerCountTime() {
        return this._model.countTime;
    }
}

