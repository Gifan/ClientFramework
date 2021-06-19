import { Cfg } from "../../config/Cfg";
import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import EventModel from "./EventModel";

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
    }

    public onSendEvent(keyId: number | string, param) {
        if (keyId == null) return;
        let data = Cfg.Event.get(keyId);
        if (data) {
            // cc.log(data.name, param);
            if (!param) param = "none";
            wonderSdk.sendEvent(data.name, param);
        } else {
            // Log.warn("can't find event id" + keyId, param);
        }
    }
}

