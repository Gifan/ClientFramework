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
    }
    show(): void {

    }
    hide(): void {

    }


}