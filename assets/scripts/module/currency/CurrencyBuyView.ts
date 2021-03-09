import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { AlertManager } from "../alert/AlertManager";
import { Const } from "../../config/Const";
import { Manager } from "../../manager/Manager";
import CurrencyModel from "./CurrencyModel";
import { EventDefine } from "../../config/EventCfg";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Common/CurrencyBuyView")
export class PowerView extends MVC.BaseView {

    protected changeListener(enable: boolean): void {

    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
        Notifier.send(ListenID.Ad_ShowFullVideo);
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
        Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_nogold);
        Notifier.send(ListenID.Ad_ShowVideo, code => {
            if (code == 1) {
                Manager.vo.setGold(500);
                AlertManager.showCurrency(500, Const.CurrencyType.Gold);
                this.close();
            }
        });
    }

}
