import { MVC } from "../../framework/MVC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonAlert extends MVC.BaseView {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    private cbConfirm:Function = null;
    start() {

    }
    // 设置事件监听
    protected changeListener(enable: boolean): void {

    };

    public onOpen() {
        super.onOpen();
        let args:any = this._openArgs.param;
        this.title.string = args.title ? args.title : "提示";
        this.desc.string = args.desc ? args.desc : "";
        this.cbConfirm = args && args.errorcb;
    }

    public onClose() {
        super.onClose();
        this.cbConfirm && this.cbConfirm();

    }
    // update (dt) {}
}
