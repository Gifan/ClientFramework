import { MVC } from "../../framework/MVC";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("视图组件/Example/ExampleView")
export class ExampleView extends MVC.BaseView {
    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 
     */
    protected onOpen(): void {
        super.onOpen();
    }

    /*
     * 
     */
    public close(): void {
        super.close();
    }

    /*
     * 
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * 
     */
    public onShowFinish(): void {
        super.onShowFinish();
    }
    
}
