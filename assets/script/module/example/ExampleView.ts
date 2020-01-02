import { MVC } from "../../framework/MVC";
import { DefaultTransition } from "../../framework/transition/DefaultTransition";
import { Log } from "../../framework/Log";
import { Time } from "../../framework/manager/Time";


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
        Time.delay(2, this.close, null, this);
    }
    public close() {
        super.close();
    }
    public onClose(): void {
        super.onClose();
    }

    public onShowFinish(): void {
        super.onShowFinish();
    }

    public onHideFinish(): void {
        super.onHideFinish();
    }

}
