import { NotifyListener } from "./NotifyListener";
import { NotifyCaller } from "./NotifyCaller";
export const PriorLowest = -200;
export const PriorLow = -100;
export const PriorMiddle = 0;
export const PriorHigh = 100;
export const PriorHighest = 200;
export class Notifier {
    private static _listener = new NotifyListener();

    /**
     * 增加消息监听
     * @param listenId 消息id唯一标识
     * @param callback 回调函数
     * @param context target
     * @param prior 回调优先级
     */
    public static addListener(listenId: number, callback: Function, context: any, prior: number = PriorMiddle): void {
        this._listener.Register(listenId, callback, context, prior);
    }

    /**
     * 移除消息监听
     * @param listenId 
     * @param callback 
     * @param context 
     */
    public static removeListener(listenId: number, callback: Function, context: any): void {
        this._listener.Unregister(listenId, callback, context);
    }

    public static changeListener(enable: boolean, listenId: number, callback: Function, context: any, prior: number = PriorMiddle): void {
        if (enable) {
            this.addListener(listenId, callback, context, prior);
        } else {
            this.removeListener(listenId, callback, context);
        }
    }

    public static send(listenId: number, ...argArray: any[]) {
        this._listener.Send(listenId, ...argArray);
    }

    public static isExist(listenId: number): boolean {
        return this._listener.IsExist(listenId);
    }

    private static _caller = new NotifyCaller();

    /**
     * 注册函数回调
     * @param callId 注册函数
     * @param callback 回调函数
     * @param context target
     */
    public static addCall(callId: number, callback: Function, context: any): boolean {
        return this._caller.Register(callId, callback, context);
    }

    public static removeCall(callId: number, callback: Function, context: any): boolean {
        return this._caller.Unregister(callId, callback, context);
    }

    public static changeCall(enable: boolean, callId: number, callback: Function, context: any) {
        if (enable) {
            this.addCall(callId, callback, context);
        } else {
            this.removeCall(callId, callback, context);
        }
    }

    public static call(callId:number, ...argArray:any[]):any{
        return this._caller.Call(callId, ...argArray);
    }
}