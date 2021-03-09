import { MVC } from "../../framework/MVC";

export default class LoadingModel extends MVC.BaseModel {

    private static _instance: LoadingModel = null;

    private constructor() {
        super();
        if (LoadingModel._instance == null) {
            LoadingModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): LoadingModel {
        if (LoadingModel._instance == null) {
            LoadingModel._instance = new LoadingModel();
        }
        return LoadingModel._instance;
    }
}