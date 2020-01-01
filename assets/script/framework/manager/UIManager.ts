import { MVC } from "../MVC";
import { Log } from "../Log";
type UINode = cc.Node
type Canvas = cc.Canvas
type Vector2 = cc.Vec2


declare interface FuncTypeMap {
    [key: number]: string;
}

declare interface TypeViewMap {
    [key: string]: MVC.BaseView;
}

const kWidth = 1280;
const kHeight = 720;

let _instance: UIManager;

/*
* UI控制类
*/
export class UIManager {

    public static Init(): void {
        _instance = new UIManager();
        _instance.initRoot();
    }



    //----------------- 内部实现 --------------------------
    private _root: UINode;
    private _canvas: Canvas;
    private _layerRoots: UINode[];
    private _views: TypeViewMap;
    private _viewQueues: MVC.BaseView[][];

    private initRoot(): void {
        this._root = new cc.Node("_UIRoot");
        this._root.parent = cc.director.getScene();
        this._root.width = kWidth;
        this._root.height = kHeight;
        this._root.position = cc.v2(kWidth / 2, kHeight / 2);
        cc.game.addPersistRootNode(this._root);

        this._layerRoots = new Array<UINode>();
        for (let i = MVC.eUILayer.Scene; i < MVC.eUILayer.Max; i++) {
            this._layerRoots[i] = this.addSubCanvas(MVC.eUILayer[i]);
        }
    }

    private addSubCanvas(name: string): UINode {
        let node = new cc.Node(name + "_Root");
        node.group = "UI";
        node.parent = this._root;
        node.width = kWidth;
        node.height = kHeight;
        node.position = cc.Vec2.ZERO;
        node.angle = 0;
        return node;
    }

    private open(type: string, args: MVC.OpenArgs): void {
        let view: MVC.BaseView = this._views[type];
        if (view == null) {
            let mod = require(type);
            let modClass = mod[type];
            view = new modClass() as MVC.BaseView;
            view.setParent(this._layerRoots[view.uiLayer]);
            this._views[type] = view;
        }
        if (view.isOpened) {
            Log.error(`UIManager.open:${type} is repeatedly`);
            return;
        }
        view.setOpenArgs(args);
        view.open();
    }

    private onOpen(view: MVC.BaseView): void {
        if (view.uiQueue == MVC.eUIQueue.None) {
            return;
        }
        let viewQueue = this._viewQueues[view.uiQueue];
        if (viewQueue.length > 0) {
            let lastView = viewQueue[viewQueue.length - 1];
            lastView.hide();
        }
        viewQueue.push(view);
    }

    private close(type: string): void {
        let view: MVC.BaseView = this._views[type];
        if (view == null) {
            Log.error(`UIManager.close:${type} null`);
            return;
        }
        if (!view.isOpened) {
            Log.error(`UIManager.close:${type}is repeatedly`);
            return;
        }
        view.close();
    }

    private onClose(view: MVC.BaseView): void {
        if (view.uiQueue == MVC.eUIQueue.None) {
            return;
        }

        let viewQueue = this._viewQueues[view.uiQueue];
        if (viewQueue.length <= 0) {
            Log.log(`UIManager.onClose:${view.assetPath} viewQueue:${view.uiQueue} Count < 0`);
            //closeQueues 会清空队列
            return;
        }
        let lastView = viewQueue[viewQueue.length - 1];
        if (lastView != view) {
            let index = viewQueue.indexOf(view);
            let suss = true;
            if (index < 0) suss = false;
            viewQueue.splice(index, 1);
            if (!suss) {
                Log.warn("UIManager.onClose:" + view.assetPath + " can't find, last:" + lastView.assetPath);
            }
            return;
        }
        viewQueue.pop();
        //恢复上一个界面显示
        if (viewQueue.length > 0) {
            lastView = viewQueue[viewQueue.length - 1];
            lastView.show();
        }
    }
}