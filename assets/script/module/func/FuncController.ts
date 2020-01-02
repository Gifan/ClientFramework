import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import FuncModel from "./FuncModel";
import { NotifyID } from "../../framework/notify/NotifyID";
import { Cfg } from "../../config/Cfg";
import { Log } from "../../framework/Log";
import { UIManager } from "../../framework/manager/UIManager";

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
        Notifier.changeListener(enable, NotifyID.Func_Open, this.open, this);
    }

    private open(args :MVC.OpenArgs){
        let cfg = Cfg.Func.get(args.id);
        if (cfg == null) {
            Log.error("FuncLogic.open error id", args.id);
            return;
        }
        if (cfg.father != null) {
            args.setTab(args.id);
            args.setId(cfg.father);
        }
        UIManager.Open(args.id, args);
    }
}

