import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { Const } from "../../config/Const";
import { GameUtil } from "../../util/GameUtil";
import { CallID } from "../../CallID";
import { NotifyID } from "../../framework/notify/NotifyID";
import { Manager } from "../../manager/Manager";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Common/CurrencyView")
export class CurrencyView extends MVC.BaseView {

    @property(cc.Label)
    lGoldText: cc.Label = null;

    @property(cc.Node)
    goldIcon: cc.Node = null;

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Game_UpdateGold, this.updateGold, this);
        Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
        Notifier.changeCall(enable, CallID.Common_GetMainViewCurrencyPosition, this.getCurrencyPosition, this);
    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
        this.fixUI();
        this.setInfo();
    }

    protected setInfo() {
        this.updateGold(0, -1);
        let param = this._openArgs.param;
        this.goldIcon.parent.active = param;
    }

    public fixUI() {

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
        this.offTouch();
    }

    public updateGold(gold, way) {
        if (this.lGoldText) {
            this.lGoldText.string = `${GameUtil.changeGoldStr(Manager.vo.userVo.gold)}`;
        }

    }

    public onUpdate(dt) {

    }

    public getCurrencyPosition(currencyType: Const.CurrencyType): cc.Vec3 {
        if (currencyType == Const.CurrencyType.Gold) {
            let vec = this.goldIcon.parent.convertToWorldSpaceAR(this.goldIcon.position);
            let pos = this.node.convertToNodeSpaceAR(vec);
            return pos;
        }
    }

    public onClickAdd() {
        Notifier.send(ListenID.Currency_OpenBuyView);
    }
}
