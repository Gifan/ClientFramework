import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { UIManager } from "../../manager/UIManager";
import CurrencyModel from "./CurrencyModel";

/*
 * desc
 */
export class CurrencyController extends MVC.MController<CurrencyModel> {
    public constructor() {
        super();
        this.setup(CurrencyModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "CurrencyController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Currency_OpenBuyView, this.onOpenBuyView, this);
        Notifier.changeListener(enable, ListenID.Currency_SetCurrencyVisible, this.onOpenCurrencyView, this);
    }

    public onOpenCurrencyView(boo) {
        let obj = new MVC.OpenArgs();
        obj.setUiLayer(MVC.eUILayer.Tips).setParam(boo);
        UIManager.Open('ui/common/CurrencyView', obj);
    }

    public onOpenBuyView() {
        let obj = MVC.openArgs().setUiLayer(MVC.eUILayer.SubPopup).setTransition(MVC.eTransition.EaseScale);
        UIManager.Open('ui/common/CurrencyBuyView', obj);
    }
}

