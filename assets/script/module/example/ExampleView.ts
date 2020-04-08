import { MVC } from "../../framework/MVC";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("视图组件/Example/ExampleView")
export class ExampleView extends MVC.BaseView {
    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
    }

    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }

    /*
     * 关闭界面后
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
    }
    
}
