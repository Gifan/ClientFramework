import { MVC } from "../MVC";

export class MoveHorTransition implements MVC.ITransition {
    private _view: MVC.BaseView;
    private _moveInAct: cc.Action;
    private _moveOutAct: cc.Action;

    private _animSpeed: number = 0.2;
    private _moveDist: number = 1000;

    init(view: MVC.BaseView): void {
        this._view = view;
        this._view.node.x -= this._moveDist;
        let moveOutCallback = cc.callFunc(this.onMoveOutFinish, this);
        let moveInCallback = cc.callFunc(this.onMoveInFinish, this);
        this._moveInAct = cc.sequence(cc.spawn(cc.fadeTo(this._animSpeed, 255), cc.moveBy(this._animSpeed, this._moveDist, 0)), moveInCallback);
        this._moveOutAct = cc.sequence(cc.spawn(cc.fadeTo(this._animSpeed, 0), cc.moveBy(this._animSpeed, -this._moveDist, 0)), moveOutCallback);
    }
    show(): void {
        this._view.node.active = true;
        this._view.node.opacity = 0;
        this._view.node.runAction(this._moveInAct);
    }
    hide(): void {
        this._view.node.runAction(this._moveOutAct);
    }

    // 弹进动画完成回调
    private onMoveInFinish() {
        this._view.onShowFinish();
    };

    // 弹出动画完成回调
    private onMoveOutFinish() {
        this._view.node.active = false;
    };
}