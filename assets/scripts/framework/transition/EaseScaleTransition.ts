import { MVC } from "../MVC";

export class EaseScaleTransition implements MVC.ITransition {
    private _view: MVC.BaseView;
    private _scaleInAct: cc.Action;
    private _scaleOutAct: cc.Action;

    private _animInSpeed: number = 0.3;
    private _animOutSpeed: number = 0.3;
    private maskbgOpacity: number = 155;
    init(view: MVC.BaseView): void {
        this._view = view;
        this.maskbgOpacity = this._view.node.children[0].opacity;
        if(this._view.node.children[1]){
            this._view.node.children[1].width = this._view.node.width;
            this._view.node.children[1].height = this._view.node.height;
        }
    }
    show(): void {
        this._view.node.active = true;
        if (this._view.node.children[0]) {
            this._view.node.children[0].stopAllActions();
            cc.tween(this._view.node.children[0])
                .call(() => {
                    this._view.node.children[0].opacity = 0;
                })
                .to(0.3, { opacity: this.maskbgOpacity }, { easing: cc.easing.backOut })
                .start();
        }
        if (!this._view.node.children[1]) {
            setTimeout(() => this._view.onShowFinish());
        } else {
            this._view.node.children[1].stopAllActions();
            cc.tween(this._view.node.children[1]).set({ scale: 0.1 }).to(this._animInSpeed, { scale: 1 }, { easing: cc.easing.backOut }).call(() => {
                this.onFadeInFinish()
            }).start();
        }
    }
    hide(): void {
        if (this._view.node.children[0]) {
            this._view.node.children[0].stopAllActions();
            cc.tween(this._view.node.children[0])
                .to(0.3, { opacity: 0 }, { easing: cc.easing.backIn })
                .start();
        }
        if (!this._view.node.children[1]) {
            this._view.node.active = false;
            setTimeout(() => this._view.onHideFinish());
        } else {
            this._view.node.children[1].stopAllActions();
            cc.tween(this._view.node.children[1]).to(this._animOutSpeed, { scale: 0.1 }, { easing: cc.easing.backIn }).call(() => { this.onFadeOutFinish() }).start();
        }
    }
    // 弹进动画完成回调
    private onFadeInFinish() {
        this._view.onShowFinish();
    };

    // 弹出动画完成回调
    private onFadeOutFinish() {
        this._view.node.active = false;
        this._view.onHideFinish();
    };
}