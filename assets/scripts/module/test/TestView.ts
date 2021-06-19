import { MVC } from "../../framework/MVC";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Test/TestView")
export class TestView extends MVC.BaseView {

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * 打开界面回调
     * 打开的时候回调一次
     */
    protected onOpen(): void {
        super.onOpen();
    }

    /*
     * 已经打开界面情况下再次打开 会直接走该方法
     */
    protected setInfo() {

    }

    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }
}
