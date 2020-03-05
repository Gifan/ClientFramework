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

const kWidth = 720;
const kHeight = 1280;

let _instance: UIManager;

/*
* UI控制类
*/
export class UIManager {

    public static Init(): void {
        _instance = new UIManager();
        _instance.initRoot();
    }
    private static m_func2viewTypes: FuncTypeMap = {};
    public static RegisterViewType(funcId: number, viewType: string): void {
        let existType = UIManager.m_func2viewTypes[funcId];
        if (existType != null) {
            cc.warn("UIManager.RegisterViewType repeated funcId:" + funcId + " " + existType + "->" + viewType);
        }
        UIManager.m_func2viewTypes[funcId] = viewType;
    }

    public static Open(type: number, args?: MVC.OpenArgs): void {
        let viewType = UIManager.m_func2viewTypes[type];
        if (viewType == null) {
            Log.error("UIManager.Open unregistered funcId:" + type);
            return;
        }
        _instance.open(viewType, args);
    }

    public static Close(type: number): void {
        let viewType = UIManager.m_func2viewTypes[type];
        if (viewType == null) {
            Log.error("UIManager.Close unregistered funcId:" + type);
            return;
        }
        _instance.close(viewType);
    }

    public static CloseQueues(): void {

    }


    //----------------- 内部实现 --------------------------
    private _root: UINode;
    private _canvas: Canvas;
    private _layerRoots: UINode[];
    private _views: TypeViewMap;
    private _viewQueues: MVC.BaseView[][];

    private constructor() {
        this._views = {};
        this._viewQueues = [];
        for (let i = 0; i < MVC.eUIQueue.None; i++) {
            this._viewQueues[i] = new Array<MVC.BaseView>();
        }
        MVC.ViewHandler.initUIEvent(this.onOpen.bind(this), this.onClose.bind(this));
    }
    private initRoot(): void {
        this._root = new cc.Node("_UIRoot");
        this._root.parent = cc.director.getScene();
        this._root.width = cc.winSize.width;
        this._root.height = cc.winSize.height;
        this._root.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
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
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
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