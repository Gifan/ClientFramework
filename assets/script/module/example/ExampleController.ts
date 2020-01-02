import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import ExampleModel from "./ExampleModel";

/*
 * desc
 */
export class ExampleController extends MVC.MController<ExampleModel> {
    public constructor() {
        super();
        this.setup(ExampleModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void {}

    public get classname(): string {
        return "ExampleController";
    }
    protected registerAllProtocol(): void {

    }
    
    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
    }
}