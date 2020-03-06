import { MVC } from "../../framework/MVC";
import { Log } from "../../framework/Log";

const { ccclass, property } = cc._decorator;

@ccclass
export class TestView extends MVC.BaseView {

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
        Log.log("test onOpen");
    }

    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
        Log.log("test close");
    }

    /*
     * 关闭界面后
     */
    public onClose(): void {
        super.onClose();
        Log.log("test onClose");
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
        Log.log("test onShowFinish");
    }

}
