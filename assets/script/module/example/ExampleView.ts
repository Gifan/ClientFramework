import { MVC } from "../../framework/MVC";
import { DefaultTransition } from "../../framework/transition/DefaultTransition";


export class ExampleView extends MVC.BaseView {
    public constructor() {
        super("ui/example/ExampleUI", MVC.eUILayer.Panel, MVC.eUIQueue.None, new DefaultTransition());
    }

    protected onLoad(): void {

    }

    protected onUnLoad(): void {

    }

    protected changeListener(enable: boolean): void {

    }

    protected onOpen(): void {
        super.onOpen();
    }

    public onClose(): void {
        super.onClose();
    }

    public onShowFinish(): void {
        super.onShowFinish();
    }

    protected onHideFinish(): void {
        super.onHideFinish();
    }

}
