import { MVC } from "../../framework/MVC";

export default class CurrencyModel extends MVC.BaseModel {
    private static _instance: CurrencyModel = null;

    private constructor() {
        super();
        if (CurrencyModel._instance == null) {
            CurrencyModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): CurrencyModel {
        if (CurrencyModel._instance == null) {
            CurrencyModel._instance = new CurrencyModel();
        }
        return CurrencyModel._instance;
    }
}