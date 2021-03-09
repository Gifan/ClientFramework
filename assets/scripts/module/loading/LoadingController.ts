import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { UIManager } from "../../manager/UIManager";
import LoadingModel from "./LoadingModel";

/*
 * desc
 */
export class LoadingController extends MVC.MController<LoadingModel> {
    public constructor() {
        super();
        this.setup(LoadingModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "LoadingController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Loading_StartLoad, this.changeToStage, this);
        Notifier.changeListener(enable, ListenID.Loading_EndLoad, this.closeLoading, this);
    }

    private changeToStage(loadingIn, loadingOut) {
        UIManager.Open("ui/loading/LoadingView", MVC.openArgs().setTransition(MVC.eTransition.AnimLoad).setUiLayer(MVC.eUILayer.Loading).setParam({ openCb: loadingIn, closeCb: loadingOut }));
    }

    private closeLoading() {
        let view = UIManager.getView("ui/loading/LoadingView");
        if(view && view.isShowed){
            view.hide();
        }
    }
}

