import { MVC } from "../MVC"

type Node = cc.Node
type Animation = cc.Animation

/// <summary>
/// 动画 UI切换过渡
/// </summary>
export class AnimTransition implements MVC.ITransition {
    private m_animator: Animation;
    private isClean: boolean = false;
    private _view: MVC.BaseView;
    public init(_view): void {
        this._view = _view;
        this.m_animator = _view.node.getComponent(cc.Animation);
    }

    public show(): void {
        if (this.m_animator == null) {
            setTimeout(() => this._view.onShowFinish());
            return;
        }
        this._view.node.active = true;
        this.m_animator.play("Show");
    }
    public hide(): void {
        if (this.m_animator == null) {
            setTimeout(() => this._view.onHideFinish());
            return;
        }
        this.m_animator.play("Hide");
    }
}