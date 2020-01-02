import { MVC } from "../../framework/MVC";
import { DefaultTransition } from "../../framework/transition/DefaultTransition";
import { Log } from "../../framework/Log";
import { Time } from "../../framework/manager/Time";
import { testViewUI } from "../uiGen/testViewUI";
import { GameUtil } from "../../util/GameUtil";


export class ExampleView extends MVC.BaseView {
    public constructor() {
        super("ui/example/testView", MVC.eUILayer.Panel, MVC.eUIQueue.None, new DefaultTransition());
    }
    private _ui: testViewUI;
    protected onLoad(): void {
        this._ui = new testViewUI(this.node);
        this._ui.button.audioId = 107;
        GameUtil.setListener(this._ui.button.node, this.onClick, this);
    }

    protected onUnLoad(): void {

    }

    protected changeListener(enable: boolean): void {

    }

    protected onOpen(): void {
        super.onOpen();
        // Time.delay(2, this.close, null, this);
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

    public onClick() {

    }
}
