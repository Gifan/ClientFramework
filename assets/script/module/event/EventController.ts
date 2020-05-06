import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import EventModel from "./EventModel";
import { Cfg } from "../../config/Cfg";
import { Log } from "../../framework/Log";

/*
 * desc
 */
export class EventController extends MVC.MController<EventModel> {
    public constructor() {
        super();
        this.setup(EventModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "EventController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Event_SendEvent, this.onSendEvent, this);
        //    Notifier.changeCall(enable, CallID.Scene_IsEnter, this.isEnter, this);
    }

    public onSendEvent(keyId: number, param) {
        let data = null;//cfg.Event.get(keyId);
        if (data) {
            if (!param) param = "none";
            wonderSdk.sendEvent(data.name, param);
        } else {
            Log.warn("can't find event id" + keyId,param);
        }
    }
}

