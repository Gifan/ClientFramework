import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectAlert extends MVC.BaseView {

    @property(cc.Label)
    reasonDesc: cc.Label = null;

    @property(cc.Label)
    wayDesc: cc.Label = null;

    @property(cc.Label)
    confirmText: cc.Label = null;

    @property(cc.Label)
    cancelText: cc.Label = null;

    @property(cc.Node)
    videoIcon: cc.Node = null;

    // 设置事件监听
    protected changeListener(enable: boolean): void {

    };

    private cbConfirm: Function = null;
    private cbCancel: Function = null;
    public onOpen() {
        super.onOpen();
        let args: any = this._openArgs.param;
        this.cbConfirm = args && args.confirm;
        this.cbCancel = args && args.cancel;
        this.reasonDesc.string = args && args.desc || "";
        this.wayDesc.string = args && args.title || "";
        this.confirmText.string = args && args.confirmText || "是";
        this.cancelText.string = args && args.cancelText || "否";
        this.videoIcon.active = !!this._openArgs.param.isVideo;
    }

    public close() {
        super.close();
    }

    public onConfirm() {
        if (this._openArgs.param.isVideo) {
            Notifier.send(ListenID.Ad_ShowVideo, (code) => {
                if (code == 1) {
                    this.cbConfirm && this.cbConfirm();
                    this.close();
                }
            })
        } else {
            this.cbConfirm && this.cbConfirm();
            this.close();
        }
    }

    public onCancel() {
        this.cbCancel && this.cbCancel();
        this.close();
    }
    // update (dt) {}
}
