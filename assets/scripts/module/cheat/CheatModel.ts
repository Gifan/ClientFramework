import { MVC } from "../../framework/MVC";

export default class CheatModel extends MVC.BaseModel {

    private static _instance: CheatModel = null;

    private constructor() {
        super();
        if (CheatModel._instance == null) {
            CheatModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): CheatModel {
        if (CheatModel._instance == null) {
            CheatModel._instance = new CheatModel();
        }
        return CheatModel._instance;
    }
}