import { MVC } from "../framework/MVC";
import { Log } from "../framework/Log";
import { Manager } from "./Manager";

type UINode = cc.Node
type Canvas = cc.Canvas
type Vector2 = cc.Vec2
let kWidth = 750;
let kHeight = 1334;
declare interface ViewCountMap {
    [key: number]: number;
}

declare interface FuncTypeMap {
    [key: number]: string;
}

declare interface TypeViewMap {
    [key: string]: { args: MVC.OpenArgs, asset: string, node: UINode };
}

let _instance: UIManager;

/*
* UI控制类
*/
export class UIManager {

    public static Init(): void {
        if (!_instance) {
            _instance = new UIManager();
            _instance.initRoot();
        }
    }

    private static m_func2viewTypes: FuncTypeMap = {};
    public static RegisterViewType(funcId: number, viewType: string): void {
        // let existType = UIManager.m_func2viewTypes[funcId];
        // if (existType != null) {
        //     cc.warn("UIManager.RegisterViewType repeated funcId:" + funcId + " " + existType + "->" + viewType);
        // }
        // UIManager.m_func2viewTypes[funcId] = viewType;
    }

    public static getView(assetPath: string): MVC.BaseView {
        return _instance.getView(assetPath);
    }

    public static Open(type: string, args?: MVC.OpenArgs): void {
        _instance.open(type, args);
    }

    public static Close(type: string, closeCall?: Function): void {
        _instance.close(type, closeCall);
    }

    public static CloseQueues(): void {
        // _instance.closeQueues();
    }

    public static layerRoots(uiLayer: MVC.eUILayer = MVC.eUILayer.Panel): cc.Node {
        return _instance.getLayerRoots(uiLayer);
    }

    private static viewCountList: ViewCountMap = {};
    public static getViewCountByLayerIndex(layer: MVC.eUILayer) {
        return UIManager.viewCountList[layer] || 0;
    }

    /**
     * 调整适配坐标
     */
    public static resetPosition() {
        _instance.resetPosition();
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
        cc.view.on('design-resolution-changed', () => {
            this.resetPosition();
        });
        this._root.parent = cc.director.getScene();
        this._root.width = cc.winSize.width;
        this._root.height = cc.winSize.height;
        this._root.position = cc.v3(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
        cc.game.addPersistRootNode(this._root);

        this._layerRoots = new Array<UINode>();
        for (let i = MVC.eUILayer.Scene; i < MVC.eUILayer.Max; i++) {
            this._layerRoots[i] = this.addSubCanvas(MVC.eUILayer[i]);
        }
        this.resetPosition();
    }

    private addSubCanvas(name: string): UINode {
        let node = new cc.Node(name + "_Root");
        node.group = "UI";
        node.parent = this._root;
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        node.position = cc.Vec3.ZERO;
        node.angle = 0;
        return node;
    }

    public resetPosition() {
        let size = cc.view.getDesignResolutionSize();
        let kWidth = size.width;
        let kHeight = size.height;
        let srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / kWidth,
            cc.view.getCanvasSize().height / kHeight
        );
        let realWidth1 = kWidth * srcScaleForShowAll;
        let realHeight1 = kHeight * srcScaleForShowAll;
        let widthratio = cc.view.getCanvasSize().width / realWidth1;
        let heightratio = cc.view.getCanvasSize().height / realHeight1;
        let width = kWidth * widthratio;
        let height = kHeight * heightratio;
        this._root.width = width;
        this._root.height = height;
        for (let i = MVC.eUILayer.Scene; i < MVC.eUILayer.Max; i++) {
            let node = this._layerRoots[i];
            node.width = width;
            node.height = height;
            node.position = cc.Vec3.ZERO;
            node.angle = 0;
        }
    }

    private open(assetPath: string, args: MVC.OpenArgs): void {
        let names = assetPath.split(`/`);
        if (this._views[assetPath] == null) { //每次只存在唯一一个同样的视图
            this._views[assetPath] = { asset: assetPath, args: args, node: null };
            let name = names[names.length - 1];
            MVC.ViewHandler.loadAssetHandler(assetPath, cc.Prefab, (err, resource: any) => {
                if (err) {
                    console.error(".loadCallback GameObject null:" + assetPath);
                    this._views[assetPath] = null;
                    this._countcall++;
                    if (this._countcall <= 3)//打开失败连续打开3次
                        this.open(assetPath, args);
                    return;
                } else {
                    this.onLoadCallback(resource, assetPath);
                }
            });
        } else {
            if (this._views[assetPath].node) {
                let view: MVC.BaseView = this._views[assetPath].node.getComponent(names[names.length - 1]);
                if (!args) args = MVC.openArgs();
                view.setOpenArgs(args);
                view.open();
            }
        }
    }
    private getView(assetPath): MVC.BaseView {
        let view = this._views[assetPath];
        if (view && view.node && cc.isValid(view.node)) {
            return view.node.getComponent(view.node.name);
        }
        else return null;
    }
    private onOpen(view: MVC.BaseView): void {
        let index = view.uiLayer;
        if (!UIManager.viewCountList[index]) {
            UIManager.viewCountList[index] = 0;
        }
        UIManager.viewCountList[index]++;
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

    private close(type: string, closeCall?: Function): void {
        let view = this._views[type];
        if (view == null || view.node == null) {
            Log.error(`UIManager.close:${type} null`);
            return;
        }
        view.node.getComponent(view.node.name).close(closeCall);
    }

    private onClose(view: MVC.BaseView): void {
        let index = view.uiLayer;
        UIManager.viewCountList[index]--;
        if (UIManager.viewCountList[index] < 0) {
            UIManager.viewCountList[index] = 0;
        }

        if (view.uiQueue == MVC.eUIQueue.None) {
            this._views[view.assetPath] = null;
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

    public resetRootPos() {
        this._root.width = cc.winSize.width;
        this._root.height = cc.winSize.height;
        this._root.position = cc.v3(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
    }
    public getLayerRoots(uiLayer: MVC.eUILayer): cc.Node {
        return this._layerRoots[uiLayer];
    }

    private _countcall: number = 0;
    private onLoadCallback(asset: any, assetspath: string) {
        let data = this._views[assetspath].args;
        if (!data) data = new MVC.OpenArgs();
        let node: UINode = Manager.loader.instantiate(asset);

        let names = assetspath.split(`/`);
        // try {
        let baseView: MVC.BaseView = node.getComponent(names[names.length - 1]);
        baseView.init(data.uiLayer, data.uiQueue, data.transition, assetspath);
        baseView.setNodeInfo(this._layerRoots[data.uiLayer]);
        this._views[assetspath].node = node;
        baseView.setOpenArgs(data);
        baseView.open();
        // } catch (error) {
        //     console.error("error=", error, assetspath);
        // }
        this._countcall = 1;
    }
}