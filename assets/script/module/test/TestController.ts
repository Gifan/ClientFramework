import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import TestModel from "./TestModel";

/*
 * desc
 */
export class TestController extends MVC.MController<TestModel> {
    public constructor() {
        super();
        this.setup(TestModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void {}

    public get classname(): string {
        return "TestController";
    }
    protected registerAllProtocol(): void {

    }
    
    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
    }
}

