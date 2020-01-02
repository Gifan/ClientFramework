import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import FuncModel from "./FuncModel";

/*
 * desc
 */
export class FuncController extends MVC.MController<FuncModel> {
    public constructor() {
        super();
        this.setup(FuncModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void {}

    public get classname(): string {
        return "FuncController";
    }
    protected registerAllProtocol(): void {

    }
    
    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
    }
}

