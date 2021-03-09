import { CallID } from "../../CallID";
import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { NotifyID } from "../../framework/notify/NotifyID";
import { ListenID } from "../../ListenID";
import { Manager } from "../../manager/Manager";
import { GameUtil } from "../../util/GameUtil";
import PowerModel from "./PowerModel";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Power/PowerView")
export class PowerView extends MVC.BaseView {

    @property(cc.Label)
    lPowerText: cc.Label = null;

    @property(cc.Node)
    powerIcon: cc.Node = null;

    @property(cc.Label)
    downTime: cc.Label = null;

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Game_UpdatePower, this.updatePower, this);
        Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
        Notifier.changeCall(enable, CallID.Common_GetMainViewPowerPosition, this.getPowerPosition, this);
    }

    /*
     * 打开界面回调
     * 打开的时候回调一次
     */
    protected onOpen(): void {
        super.onOpen();
        this.setInfo();
    }

    /*
     * 已经打开界面情况下再次打开 会直接走该方法
     */
    protected setInfo() {
        let param = this._openArgs.param;
        this.powerIcon.parent.active = param;
        this.updatePower();
        this.updateTime();
        this.fixUI();
    }

    public fixUI() {
        // let widget = this.powerIcon.parent.getComponent(cc.Widget);
        // if (!wonderSdk.isNative) {
        //     widget.top += 50;
        //     widget.updateAlignment();
        // }
    }

    /**
     * 主动隐藏游戏
     */
    public hide() {
        super.hide();
    }
    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }

    /*
     * 关闭界面后回调一次
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
        this.offTouch();
    }

    /*
     * 完全隐藏界面后
     */
    public onHideFinish(): void {
        super.onHideFinish();
    }

    /*
     * 点击到this.node节点
     */
    protected onClickFrame(event) {
        super.onClickFrame(event);
    }

    public getPowerPosition(): cc.Vec3 {
        let vec = this.powerIcon.parent.convertToWorldSpaceAR(this.powerIcon.position);
        let pos = this.node.convertToNodeSpaceAR(vec);
        return pos;
    }

    public onClickAddPower() {
        Notifier.send(ListenID.Power_OpenBuyView);
    }

    private _downTime: number = 0;
    public onUpdate(dt) {
        this._downTime += dt;
        if (this._downTime >= 1) {
            this._downTime = 0;
            this.updateTime();
        }
    }

    public updateTime() {
        let time = Notifier.call(CallID.Power_GetPowerCountTime);
        this.downTime.string = GameUtil.changeSecondToClock(Math.ceil(time));
    }

    public updatePower(power?, way?) {
        if (this.lPowerText) {
            // if (Manager.vo.userVo.power > 0) {
            this.lPowerText.string = `${Manager.vo.userVo.power}`;
            // }
            this.downTime.node.active = Manager.vo.userVo.power < PowerModel.getInstance.initPowerNum;
        }
    }
}
