import { MVC } from "../../framework/MVC";

export default class EventModel extends MVC.BaseModel {

    private static _instance: EventModel = null;

    private constructor() {
        super();
        if (EventModel._instance == null) {
            EventModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): EventModel {
        if (EventModel._instance == null) {
            EventModel._instance = new EventModel();
        }
        return EventModel._instance;
    }
}