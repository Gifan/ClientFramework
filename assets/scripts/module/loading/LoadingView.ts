import { MVC } from "../../framework/MVC";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("ViewComponent/Loading/LoadingView")
export class LoadingView extends MVC.BaseView {

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

    /**
     * 主动隐藏游戏
     */
    public hide() {
        super.hide();
    }
    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }

    /*
     * 关闭界面后回调一次
     */
    public onClose(): void {
        super.onClose();
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
        if (this._openArgs.param && this._openArgs.param.openCb) {
            this._openArgs.param.openCb();
        }
    }

    /*
     * 完全隐藏界面后
     */
    public onHideFinish(): void {
        super.onHideFinish();
        this.node.active = false;
    }

    /*
     * 点击到this.node节点
     */
    protected onClickFrame(event) {
        super.onClickFrame(event);
    }

    public onActionReady() {
        if (this._openArgs.param && this._openArgs.param.closeCb) {
            this._openArgs.param.closeCb();
        }
    }
}
