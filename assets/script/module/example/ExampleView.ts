import { MVC } from "../../framework/MVC";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("��ͼ���/Example/ExampleView")
export class ExampleView extends MVC.BaseView {
    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
    }

    /*
     * �򿪽���ص�
     */
    protected onOpen(): void {
        super.onOpen();
    }

    /*
     * �����رս���
     */
    public close(): void {
        super.close();
    }

    /*
     * �رս����
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * ��ȫ��ʾ�����
     */
    public onShowFinish(): void {
        super.onShowFinish();
    }
    
}
