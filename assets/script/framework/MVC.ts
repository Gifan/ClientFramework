import { GameLog } from "./Log";

export namespace MVC {
    export abstract class BaseModel {
        public abstract reset(): void;
    }

    export abstract class BaseController {
        public constructor() {
            ControllerContainer.add(this);
            this.registerAllProtocol();
        }
        public abstract get classname(): string;
        public abstract reset(): void;
        protected abstract registerAllProtocol(): void;
        protected changeListener(enable: boolean): void { }
        protected registerProtocol(msgId: number, func: Function, context: any): void {

        }
    }

    export class ControllerContainer {
        private static _container: Array<BaseController> = [];
        public static add<T extends BaseController>(instance: BaseController): void {
            const name = instance.classname;
            if (ControllerContainer.getInstance(name) != null) {
                GameLog.error(`ControllerContainer.Add repeat:${name}`);
                return;
            }
            ControllerContainer._container.push(instance);
        }
        public static getInstance<T extends BaseController>(name: string): T {
            for (const item of ControllerContainer._container) {
                if (item.classname == name) {
                    return item as T;
                }
            }
            return null;
        }

        public static reset(): void {
            let len = ControllerContainer._container.length;
            for (let i = 0; i < len; i++) {
                ControllerContainer._container[i].reset();
            }
        }
    }

    type LoadAssetHandler = (name: string, path: string, type: typeof cc.Asset, callback: (name: string, asset: object) => void, target: any) => void;
    type Node = cc.Node;
    type Prefab = cc.Prefab;

    export class ViewHandler {
        private static _loadAssetHandler: LoadAssetHandler;
        public static get loadAssetHandler(): LoadAssetHandler {
            return ViewHandler._loadAssetHandler;
        }

        private static _unloadAssetHandler: (name: string) => void;
        public static get unloadAssetHandler(): (name: string) => void {
            return ViewHandler._unloadAssetHandler;
        }

        public static initAssetHandler(loadAsset: LoadAssetHandler, unloadAsset: (name: string) => void): void {
            ViewHandler._loadAssetHandler = loadAsset;
            ViewHandler._unloadAssetHandler = unloadAsset;
        }

        private static _onOpenEvent: (view: BaseView) => void;
        public static get onOpenEvent(): (view: BaseView) => void {
            return ViewHandler._onOpenEvent;
        }

        private static _onCloseEvent: (view: BaseView) => void;
        public static get onCloseEvent(): (view: BaseView) => void {
            return ViewHandler._onCloseEvent;
        }

        public static initUIEvent(onOpen: (view: BaseView) => void, onClose: (view: BaseView) => void): void {
            ViewHandler._onOpenEvent = onOpen;
            ViewHandler._onCloseEvent = onClose;
        }
    }

    export enum eLoadState {
        Unload,
        Loading,
        Loaded,
    }

    export enum eUILayer {
        /// 场景UI
        Scene,
        /// 主界面
        Main,
        /// 打开的界面
        Panel,
        /// 弹出的次级界面
        Popup,
        /// 弹出的二级界面
        SubPopup,
        /// 临时存在的提示
        Tips,
        /// 新手引导界面
        Guide,
        /// 进度加载界面
        Loading,

        Max
    }

    export enum eUIQueue {
        Panel,
        None,
    }

    export interface ITransition {
        init(view:BaseView): void;
        show(): void;
        hide(): void;
    }

    /**
     * 打开ui时附带参数
     */
    export class OpenArgs {
        private _id: number;
        public get id(): number {
            return this._id;
        }

        public setId(id: number): OpenArgs {
            this._id = id;
            return this;
        }

        private _index: number;
        public get index(): number {
            return this._index;
        }

        public setIndex(index: number): OpenArgs {
            this._index = index;
            return this;
        }

        private _tab: number;
        public get tab(): number {
            return this._tab;
        }
        public setTab(tab: number): OpenArgs {
            this._tab = tab;
            return this;
        }

        private _select: number;
        public get select(): number {
            return this._select;
        }
        public setSelect(select: number): OpenArgs {
            this._select = select;
            return this;
        }

        private _num: number;
        public get num(): number {
            return this._num;
        }
        public setNum(num: number): OpenArgs {
            this._num = num;
            return this;
        }

        private _callback: (result: number, param: object) => void;
        public get callback() {
            return this._callback;
        }

        public setCallback(callback: (result: number, param: object) => void): OpenArgs {
            this._callback = callback;
            return this;
        }

        private _context: any;
        public get context(): any {
            return this._context;
        }
        public setContext(context: any): OpenArgs {
            this._context = context;
            return this;
        }

        private _param: object;
        public get param(): object {
            return this._param;
        }
        public SetParam(param: object): OpenArgs {
            this._param = param;
            return this;
        }
    }

    export abstract class BaseView {
        public constructor(asset: string | Node, uiLayer: eUILayer, uiQueue: eUIQueue, transition: ITransition) {
            this._uiLayer = uiLayer;
            this._uiQueue = uiQueue;
            this._transition = transition;

            if (typeof asset === "string") {
                let names = asset.split(`/`);
                this._assetName = names[names.length - 1];
                this._assetPath = asset;
            }
        }
        private _transition: ITransition;
        private _assetName: string;
        private _assetPath: string;
        public get assetPath() {
            return this._assetPath;
        }

        private BlockEvents = ['touchstart', 'touchmove', 'touchend',
            'mousedown', 'mousemove', 'mouseup',
            'mouseenter', 'mouseleave', 'mousewheel'];

        private _uiLayer: eUILayer;
        public get uiLayer(): eUILayer {
            return this._uiLayer;
        }

        private _uiQueue: eUIQueue = eUIQueue.None;
        public get uiQueue(): eUIQueue {
            return this._uiQueue;
        }

        private _node: Node;
        public get node(): Node {
            return this._node;
        }

        private _parent: Node;
        public get parent(): Node {
            return this._parent;
        }

        private _uiMask: Node;
        public get uiMask(): Node {
            return this._uiMask;
        }

        public setUIMaskActive(boo: boolean): void {
            if (this._uiMask) {
                this._uiMask.active = boo;
            }
        }

        public setParent(parent: Node): void {
            this._parent = parent;
            if (this._node != null) {
                this._node.parent = parent;
                this._node.position = cc.Vec2.ZERO;
                this._node.angle = 0;
                this._node.scale = 1;
            }
        }

        private _loadState: eLoadState = eLoadState.Unload;
        public get loadState(): eLoadState {
            return this._loadState;
        }

        private load(): void {
            if (ViewHandler.loadAssetHandler == null) {
                GameLog.log(`${this._assetName}.load need init loadAssetEvent first`);
                return;
            }
            if (this._loadState != eLoadState.Unload) {
                GameLog.error(`${this._assetName}.load multi times`);
                return;
            }
            ViewHandler.loadAssetHandler(this._assetName, this._assetPath, cc.Prefab, this.onLoadCallBack, this);
        }


        private onLoadCallBack(name: string, asset: Object): void {
            let prefab: Prefab = asset as Prefab;
            if (prefab == null) {
                GameLog.error(`${this._assetName}.loadCallback GameObject null:${name}`);
                return;
            }
            if (this._loadState != eLoadState.Loading) {
                return;
            }
            this._loadState = eLoadState.Loaded;
            let node: Node = cc.instantiate(prefab);

            this.onSetNode(node);
        }

        protected abstract onLoad(): void;

        private onSetNode(node: Node): void {
            this._node = node;
            this._node.group = "UI";
            this.setParent(this._parent);
            this._transition.init(this);
            this._uiMask = this._node.getChildByName("UIMask");
            if (!this._uiMask) {
                let maskNode: Node = new cc.Node();
                maskNode.width = this._node.width;
                maskNode.height = this._node.height;
                maskNode.scale = this._node.scale;
                maskNode.addComponent(cc.BlockInputEvents);
                this._node.addChild(maskNode, 1 << 50, "UIMask");
            }
            this.onLoad();

            if (!this._isOpened) {
                //中途关闭界面
                this._transition.hide();
                this.setUIMaskActive(true);
                return;
            }

            this.onOpen();
        }

        private _isOpened: boolean = false;
        public get isOpened(): boolean {
            return this._isOpened;
        }

        public open(): void {
            if (this._isOpened) return;
            this._isOpened = true;
            this._isWaitingShow = true;

            switch (this._loadState) {
                case eLoadState.Unload:
                    this.load();
                    break;
                case eLoadState.Loading:
                    break;
                case eLoadState.Loaded:
                    this.onOpen();
                    break;
                default:
                    GameLog.error(`${this._assetName}.Open unsupport loadState:${this._loadState}`);
                    break;
            }
        }

        protected onOpen(): void {
            for (var i = 0; i < this.BlockEvents.length; i++) {
                this.node.on(this.BlockEvents[i], this.onClickFrame, this);
            }
            this.changeListener(true);
            ViewHandler.onOpenEvent(this);
            if (this._isWaitingShow) {
                this._isWaitingShow = false;
                this.show();
            }
        }

        private _isWaitingShow: boolean = false;
        private _isShowed: boolean = false;
        public get isShowed(): boolean {
            return this._isShowed;
        }

        public show(): void {
            if (this._loadState < eLoadState.Loaded) {
                this._isWaitingShow = true;
            }
            if (this._isShowed) return;
            this._isShowed = true;
            this.setUIMaskActive(true);
            this._transition.show();
            this.onShow();
        }

        protected onShow(): void {
        }

        public onShowFinish(): void {
            this.setUIMaskActive(false);
        }

        public hide(): void {
            if (this._loadState < eLoadState.Loaded) {
                this._isWaitingShow = false;
            }
            if (!this._isShowed) return;
            this._isShowed = false;
            this.setUIMaskActive(true);
            this._transition.hide();
            this.onHide();
        }

        protected onHide(): void { }

        protected onHideFinish(): void { }

        public close(): void {
            if (!this._isOpened) return;
            this._isOpened = false;
            this.hide();
            this.onClose();
        }

        protected onClose(): void {
            for (var i = 0; i < this.BlockEvents.length; i++) {
                this.node.off(this.BlockEvents[i], this.onClickFrame, this);
            }
            this.changeListener(false);
            ViewHandler.onCloseEvent(this);
        }

        public unload(): void {
            if (this._loadState == eLoadState.Unload) {
                GameLog.error(`${this._assetName}.Unload multi times`);
                return;
            }
            if (this._loadState == eLoadState.Loading) {
                this._loadState = eLoadState.Unload;
                return;
            }
            this._loadState = eLoadState.Unload;
            if (this._isOpened) {
                this.close();
            }
            this.onUnLoad();

            if (this._node != null) {
                this._node.destroy();
                this._node = null;
            }
            if (ViewHandler.unloadAssetHandler == null) {
                GameLog.error(`${this._assetName}.unload init unloadAssetHandler frist`);
                return;
            }
            //通知资源管理
            if (this._assetPath != null) {
                ViewHandler.unloadAssetHandler(this._assetPath);
            }
        }

        protected abstract onUnLoad(): void;

        protected _openArgs : OpenArgs;
        public setOpenArgs(openArgs : OpenArgs) : void {
            this._openArgs = openArgs;
        }
        
        protected abstract changeListener(enable: boolean): void;

        protected onClickFrame(event) {
            event.stopPropagation();
        }
    }
}
