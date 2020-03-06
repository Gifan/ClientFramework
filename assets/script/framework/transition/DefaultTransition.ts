import { MVC } from "../MVC";

export class DefaultTransition implements MVC.ITransition {
    private _view: MVC.BaseView;

    init(_view): void {
        this._view = _view;
    }
    show(): void {
        this._view.node.active = true;
        setTimeout(() => this._view.onShowFinish());
    }
    hide(): void {
        this._view.node.active = false;
        setTimeout(() => this._view.onHideFinish());
    }


}