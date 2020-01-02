import { MVC } from "../../framework/MVC";
import { DefaultTransition } from "../../framework/transition/DefaultTransition";
import { Log } from "../../framework/Log";


export class ExampleView extends MVC.BaseView {
    public constructor() {
        super("ui/example/testView", MVC.eUILayer.Panel, MVC.eUIQueue.None, new DefaultTransition());
    }

    protected onLoad(): void {

    }

    protected onUnLoad(): void {

    }

    protected changeListener(enable: boolean): void {

    }

    protected onOpen(): void {
        super.onOpen();
        cc.director.getScheduler().schedule(this.close,this,2);
    }
    public close(){
        super.close();
    }
    public onClose(): void {
        cc.director.getScheduler().unschedule(this.close, this);
        super.onClose();
    }

    public onShowFinish(): void {
        super.onShowFinish();
    }

    public onHideFinish(): void {
        super.onHideFinish();
    }

}
