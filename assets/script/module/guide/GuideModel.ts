import { MVC } from "../../framework/MVC";
import { Manager } from "../../util/Manager";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";

export default class GuideModel extends MVC.BaseModel {

    private static _instance: GuideModel = null;
    public isGuiding: boolean = false;//是否在引导中
    private constructor() {
        super();
        if (GuideModel._instance == null) {
            GuideModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): GuideModel {
        if (GuideModel._instance == null) {
            GuideModel._instance = new GuideModel();
        }
        return GuideModel._instance;
    }

    public getGuideId() {
        return Manager.vo.userVo.guideId;
    }

    public setGuideId(id: number) {
        let eventid = id + 9;
        Notifier.send(ListenID.Event_SendEvent, eventid, 1);
        Manager.vo.userVo.guideId = id;
        Manager.vo.saveUserData();
    }
}