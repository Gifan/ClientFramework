import { Log } from "./Log";
import { HttpClient } from "./network/HttpClient";
import { NetManager, NetCallFun } from "./network/NetManager";
import { EaseScaleTransition } from "./transition/EaseScaleTransition";
import { MoveHorTransition } from "./transition/MoveHorTransition";
import { DefaultTransition } from "./transition/DefaultTransition";
import ResKeeper from "./loader/ResKeeper";
import { AnimTransition } from "./transition/AnimTransition";

export module MVC {
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
        public abstract setup(model): boolean;
        protected abstract registerAllProtocol(): void;
        protected changeListener(enable: boolean): void { }
        protected registerProtocol(cmd: number, func: NetCallFun, channelId: number = 0): void {
            NetManager.getInstance.setResponseHandler(cmd, func, this, channelId);
        }
        protected httpPost(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
            return HttpClient.httpPost(url, body, rspType);
        }
        protected httpGet(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
            return HttpClient.httpGet(url, body, rspType);
        }
    }

    export class MController<TModel extends BaseModel> extends BaseController {
        protected _model: TModel;
        public setup(model: TModel): boolean {
            this._model = model;
            return true;
        }
        public get classname(): string {
            return "MController";
        }
        public reset(): void {

        }
        protected registerAllProtocol(): void {

        }


    }

    export class ControllerContainer {
        private static _container: Array<BaseController> = [];
        public static add<T extends BaseController>(instance: BaseController): void {
            const name = instance.classname;
            if (ControllerContainer.getInstance(name) != null) {
                Log.error(`ControllerContainer.Add repeat:${name}`);
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

    type LoadAssetHandler = (path: string, type: typeof cc.Asset, callback: (asset: object, assetPath: string, args: any) => void) => void;
    type Node = cc.Node;
    type Prefab = cc.Prefab;

    export class ViewHandler {
        private static _loadAssetHandler: LoadAssetHandler;
        public static get loadAssetHandler(): LoadAssetHandler {
            return ViewHandler._loadAssetHandler;
        }

        private static _unloadAssetHandler: (name: string, type: typeof cc.Prefab) => void;
        public static get unloadAssetHandler(): (name: string, type: typeof cc.Prefab) => void {
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

    export enum eTransition {
        Default,
        EaseScale,
        Move,
        AnimLoad,
    }

    export interface ITransition {
        init(view: BaseView): void;
        show(): void;
        hide(): void;
    }

    /**
     * 打开ui时附带参数
     */
    export class OpenArgs {

        public constructor() {
            this._uiLayer = eUILayer.Main;
            this._transition = eTransition.Default;
            this._uiQueue = eUIQueue.None;
        }

        private _transition: eTransition;
        public setTransition(tr: eTransition) {
            this._transition = tr;
            return this;
        }

        public get transition(): eTransition {
            return this._transition;
        }

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

        private _param: any;
        public get param(): any {
            return this._param;
        }
        public setParam(param: any): OpenArgs {
            this._param = param;
            return this;
        }
        private _uiLayer: eUILayer
        public setUiLayer(euilayer: eUILayer) {
            this._uiLayer = euilayer;
            return this;
        }

        public get uiLayer(): eUILayer {
            return this._uiLayer;
        }

        private _uiQueue: eUIQueue = eUIQueue.None;
        public setUiQueue(uiQueue: eUIQueue): OpenArgs {
            this._uiQueue = uiQueue;
            return this;
        }
        public get uiQueue() {
            return this._uiQueue;
        }
    }

    export function openArgs(): OpenArgs {
        return new OpenArgs();
    }

    export class BaseView extends ResKeeper {
        public init(uiLayer: eUILayer, uiQueue: eUIQueue, transition: eTransition, assetspath: string) {
            this._uiLayer = uiLayer;
            this._uiQueue = uiQueue;
            this._uiLayer = uiLayer;
            this._assetPath = assetspath;
            switch (transition) {
                case eTransition.EaseScale:
                    this._transition = new EaseScaleTransition();
                    break;
                case eTransition.Move:
                    this._transition = new MoveHorTransition();
                    break;
                case eTransition.Default:
                    this._transition = new DefaultTransition();
                    break;
                case eTransition.AnimLoad:
                    this._transition = new AnimTransition();
                    break;
                default:
                    this._transition = new DefaultTransition();
                    break;
            }
        }
        private _transition: ITransition;
        private _assetName: string;
        private _assetPath: string;
        public get assetPath() {
            return this._assetPath;
        }

        private BlockEvents = ['touchstart', 'touchend'];

        private _uiLayer: eUILayer;
        public get uiLayer(): eUILayer {
            return this._uiLayer;
        }

        private _uiQueue: eUIQueue = eUIQueue.None;
        public get uiQueue(): eUIQueue {
            return this._uiQueue;
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

        public setNodeInfo(parent: Node): void {
            this.node.group = "UI";
            this.node.parent = parent;
            this.node.width = parent.width;
            this.node.height = parent.height;
            this._transition.init(this);
            this._uiMask = this.node.getChildByName("UIMask");
            let reskeeper = this.node.getComponent(ResKeeper);
            if (!reskeeper) {
                this.node.addComponent(ResKeeper);
            }
            if (!this._uiMask) {
                let maskNode: Node = new cc.Node();
                maskNode.width = this.node.width;
                maskNode.height = this.node.height;
                maskNode.scale = this.node.scale;
                maskNode.addComponent(cc.BlockInputEvents);
                this._uiMask = maskNode;
                this.node.addChild(maskNode, cc.macro.MAX_ZINDEX, "UIMask");
            }
        }

        private _isOpened: boolean = false;
        public get isOpened(): boolean {
            return this._isOpened;
        }

        public open(): void {
            if (!this._isOpened) {
                this.callClose = false;
                this.onOpen();
                this._isOpened = true;
                this.show();
            } else {
                this.show();
                this.setInfo();
            }
        }

        protected onOpen(): void {
            for (var i = 0; i < this.BlockEvents.length; i++) {
                this.node.on(this.BlockEvents[i], this.onClickFrame, this);
            }
            ViewHandler.onOpenEvent(this);
        }

        private _isShowed: boolean = false;
        public get isShowed(): boolean {
            return this._isShowed;
        }

        public show(): void {
            if (this._isShowed) return;
            this._isShowed = true;
            this.setUIMaskActive(true);
            this.changeListener(true);
            this._transition.show();
            this.onShow();
        }

        protected onShow(): void {

        }

        public onShowFinish(): void {
            this.setUIMaskActive(false);
        }

        /**打开界面之后 设置信息 */
        protected setInfo() {

        }

        public hide(): void {
            if (!this._isShowed) return;
            this._isShowed = false;
            this.setUIMaskActive(true);
            this.changeListener(false);
            this._transition.hide();
        }

        public onHideFinish(): void {
            if (this.callClose) this.onClose();
        };

        private callClose: boolean = false;
        private _closeCall: Function = null;
        public close(closeCall?: Function): void {
            if (!this._isOpened) return;
            this._closeCall = closeCall;
            this._isOpened = false;
            this.callClose = true;
            this.hide();
        }

        protected onClose(): void {
            for (var i = 0; i < this.BlockEvents.length; i++) {
                this.node.off(this.BlockEvents[i], this.onClickFrame, this);
            }
            ViewHandler.onCloseEvent(this);
            if (this.node != null) {
                this.node.destroy();
            }
            // if (ViewHandler.unloadAssetHandler == null) {
            //     Log.error(`${this._assetName}.unload init unloadAssetHandler frist`);
            //     return;
            // }
            // //通知资源管理
            // if (this._assetPath != null) {
            //     ViewHandler.unloadAssetHandler(this._assetPath, cc.Prefab);
            // }
            if (this._closeCall) {
                let call = this._closeCall;
                setTimeout(() => {
                    call();
                });
            }
        }

        protected _openArgs: OpenArgs;
        public setOpenArgs(openArgs: OpenArgs): void {
            this._openArgs = openArgs;
        }

        protected changeListener(enable: boolean): void { };

        protected onClickFrame(event) {
            event.stopPropagation();
        }
        protected offTouch() {
            for (var i = 0; i < this.BlockEvents.length; i++) {
                this.node.off(this.BlockEvents[i], this.onClickFrame, this);
            }
        }
    }
}
