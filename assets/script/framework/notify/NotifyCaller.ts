import { Log } from "../Log";
import { CallID } from "../../CallID";

interface ICallerMap {
    [key: number]: { "func": Function, "context": any };
}

export class NotifyCaller {
    public constructor() { }
    private _calls: ICallerMap = {};

    public Register(notifyid: number, callback: Function, context: any): boolean {
        if (callback == null) {
            Log.error(`[NotifyCaller].Register:${notifyid} callback null`);
            return false;
        }
        const handler = this._calls[notifyid];
        if (handler != null) {
            Log.error(`[NotifyCaller].Register:${notifyid} register repeat ${handler} ${callback}`);
            return false;
        }
        this._calls[notifyid] = { "func": callback, "context": context };
    }

    public Unregister(notifyid: number, callback: Function, context: any): boolean {
        const handler = this._calls[notifyid];
        if (handler == null || handler.func !== callback || handler.context != context) {
            Log.warn(`[NotifyCaller].Unregister can't find: ${CallID[notifyid]} callback ${handler}`);
            return false;
        }
        delete this._calls[notifyid];
        return true;
    }

    public Call(notifyid: number, ...argsArray: any[]): any {
        const handler = this._calls[notifyid];
        if (handler == null) {
            Log.error(`[NotifyCaller].Call can't find: ${CallID[notifyid]}`);
            return undefined;
        }
        return handler.func.call(handler.context, ...argsArray);
    }
}