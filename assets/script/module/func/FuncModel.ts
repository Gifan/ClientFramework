import { MVC } from "../../framework/MVC";

export default class FuncModel extends MVC.BaseModel {

    private static _instance: FuncModel = null;

    public constructor() {
        super();
        if (FuncModel._instance == null) {
            FuncModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): FuncModel {
        if (FuncModel._instance == null) {
            FuncModel._instance = new FuncModel();
        }
        return FuncModel._instance;
    }
}