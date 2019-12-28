import { GameLog } from "../Log";

interface IListenerMap {
    [key: number]: ListenerManager;
}

const kMaxStackDepth = 15;//调用深度 防止死循环
const kWarningStackDepth = 10;

class ListenerHandler {
    private _context: any;
    private _callback: Function;
    private _prior = 0;
    private _sendTimes = 0;

    public constructor(handler: Function, context: any, prior: number) {
        this._callback = handler;
        this._context = context;
        this._prior = prior;
    }

    public get context(): any {
        return this._context;
    }

    public get callback(): Function {
        return this._callback;
    }

    public get prior(): number {
        return this._prior;
    }
}

class ListenerManager {
    private _handlers: Array<ListenerHandler>;

    private _sendTimes: number = 0;

    private _listenId: number = 0;

    public constructor(listenId: number) {
        this._listenId = listenId;
        this._handlers = new Array<ListenerHandler>();
    }

    public toString(): string {
        let str = '<ListenerManager id:%{m_id}, times:%{m_sendTimes}>';
        return str;
    }

    public IsExistHandler(callback: Function, context: any): boolean {
        let len = this._handlers.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                const handler = this._handlers[i];
                if (handler.callback === callback && handler.context == context) {
                    return true;
                }
            }
        }
        return false;
    }

    public RegisterHandler(callback: Function, context: any, prior: number): boolean {
        let handler = new ListenerHandler(callback, context, prior);
        let len = this._handlers.length;
        if (len > 0) {
            let insert = false;
            for (let i = len - 1; i >= 0; i--) {
                if (handler.prior >= this._handlers[i].prior) {//最高优先级在后面
                    this._handlers.splice(i + 1, 0, handler);
                    insert = true;
                    break;
                }
            }
            if (!insert) {
                this._handlers.unshift(handler);
            }
        } else {
            this._handlers.push(handler);
        }
        return true;
    }

    public RemoveHandler(callback: Function, context: any): boolean {
        let index = -1;
        let len = this._handlers.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                const handler = this._handlers[i];
                if (handler.callback === callback && handler.context == context) {
                    index = i;
                    break;
                }
            }
        }
        if (index == -1) {
            return false;
        }
        this._handlers.splice(index, 1)
        return true;
    }

    public Send(...argArray: any[]): void {
        let len = this._handlers.length;
        for (let i = len - 1; i >= 0; i--) {
            const handler = this._handlers[i];
            handler.callback.call(handler.context, ...argArray);
        }
    }
}

export class NotifyListener {
    public constructor() { }
    private _managers: IListenerMap = {};
    private _callStacks: Array<number> = [];

    private GetCellStackString(): string {
        let str = "[";
        for (const item of this._callStacks) {
            str += item + ",";
        }
        str += "]";
        return str;
    }

    private CheckAndPushCallStack(notifyid: number): boolean {
        const stackDepth = this._callStacks.length;
        if (stackDepth >= kMaxStackDepth) {
            cc.error("[NotifyListener].Send out call stack:" + this.GetCellStackString() + " msg:" + notifyid);
            return false;
        }
        else if (stackDepth >= kWarningStackDepth) {
            cc.warn("[NotifyListener].Send warning call stack:" + this.GetCellStackString() + " msg:" + notifyid);
            return false;
        }
        this._callStacks.push(notifyid);
        return true;
    }

    private PopCallStack(): void {
        this._callStacks.pop();
    }

    /**
     * 添加监听消息
     * @param notifyid 消息id
     * @param callback 回调函数
     * @param context target上下文
     * @param prior 优先级
     */
    public Register(notifyid: number, callback: Function, context: any, prior: number): void {
        if(callback == null){
            GameLog.error(`[NotifyListener].Register:${notifyid} callback null`);
            return;
        }
        let manager = this._managers[notifyid];
        if(manager == null){
            manager = new ListenerManager(notifyid);
            this._managers[notifyid] = manager;
        }else{
            if(manager.IsExistHandler(callback, context)){
                GameLog.error(`[NotifyListener].Register:${notifyid} callback repeat, skip ${context}`);
                return;
            }
        }
        manager.RegisterHandler(callback, context, prior);
    }

    /**
     * 移除某个监听消息
     * @param notifyid 消息id
     * @param callback 回调函数
     * @param context target上下文
     */
    public Unregister(notifyid: number, callback: Function, context: any): void {

    }

    public Send(notifyid: number) {

    }

    /**
     * 是否存在该消息id事件
     * @param notifyid 消息id
     */
    public IsExist(notifyid: number): boolean {
        return this._managers[notifyid] != null;
    }
}