import { MVC } from "../MVC";

export class MoveHorTransition implements MVC.ITransition {
    private _view: MVC.BaseView;
    private _moveInAct: cc.Action;
    private _moveOutAct: cc.Action;

    private _animSpeed: number = 0.2;
    private _moveDist: number = 1000;

    init(view: MVC.BaseView): void {
        this._view = view;
        this._view.node.x += this._moveDist;
    }
    show(): void {
        this._view.node.active = true;
        this._view.node.opacity = 0;
        cc.tween(this._view.node).to(this._animSpeed, { opacity: 255, x: this._view.node.x - this._moveDist }).call(() => {
            this.onMoveInFinish();
        }).start();
    }
    hide(): void {
        cc.tween(this._view.node).to(this._animSpeed, { opacity: 0, x: this._view.node.x + this._moveDist }).call(() => {
            this.onMoveOutFinish();
        }).start();
    }

    // 弹进动画完成回调
    private onMoveInFinish() {
        this._view.onShowFinish();
    };

    // 弹出动画完成回调
    private onMoveOutFinish() {
        this._view.node.active = false;
        this._view.onHideFinish();
    };
}