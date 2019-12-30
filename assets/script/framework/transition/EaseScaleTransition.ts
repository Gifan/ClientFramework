import { MVC } from "../MVC";

export class EaseScaleTransition implements MVC.ITransition {
    private _view: MVC.BaseView;
    private _scaleInAct: cc.Action;
    private _scaleOutAct: cc.Action;

    private _animInSpeed: number = 0.3;
    private _animOutSpeed: number = 0.3;
    init(view: MVC.BaseView): void {
        this._view = view;
        var easeScaleOutCallback = cc.callFunc(this.onFadeOutFinish, this);
        var easeScaleInCallback = cc.callFunc(this.onFadeInFinish, this);
        this._scaleInAct = cc.sequence(cc.scaleTo(this._animInSpeed, 1.0).easing(cc.easeBackOut()), easeScaleInCallback);
        this._scaleOutAct = cc.sequence(cc.scaleTo(this._animOutSpeed, 0).easing(cc.easeBackIn()), easeScaleOutCallback);
    }
    show(): void {
        this._view.node.active = true;
        this._view.node.scale = 0.1;
        this._view.node.runAction(this._scaleInAct);
    }
    hide(): void {
        this._view.node.runAction(this._scaleOutAct);
    }
    // 弹进动画完成回调
    private onFadeInFinish() {
        this._view.onShowFinish();
    };

    // 弹出动画完成回调
    private onFadeOutFinish() {
        this._view.node.active = false;
    };
}