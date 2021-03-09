import { MVC } from "../../framework/MVC";

export default class AdModel extends MVC.BaseModel {

    private static _instance: AdModel = null;

    private constructor() {
        super();
        if (AdModel._instance == null) {
            AdModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): AdModel {
        if (AdModel._instance == null) {
            AdModel._instance = new AdModel();
        }
        return AdModel._instance;
    }
}