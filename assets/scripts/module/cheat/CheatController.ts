import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { NotifyID } from "../../framework/notify/NotifyID";
import { ListenID } from "../../ListenID";
import CheatModel from "./CheatModel";

/*
 * desc
 */
export class CheatController extends MVC.MController<CheatModel> {
    public constructor() {
        super();
        this.setup(CheatModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "CheatController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Login_Finish, this.onLoginFinish, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
    }

    private onLoginFinish() {
        // if (wonderSdk.isTest) {
        let cheatobj = new MVC.OpenArgs();
        cheatobj.setUiLayer(MVC.eUILayer.Guide);
        Notifier.send(NotifyID.Func_Open, "ui/cheat/CheatView", cheatobj);
        // }
    }
}

