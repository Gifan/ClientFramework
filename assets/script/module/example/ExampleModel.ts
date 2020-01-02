import { MVC } from "../../framework/MVC";

export default class ExampleModel extends MVC.BaseModel {

    private static _instance: ExampleModel = null;

    public constructor() {
        super();
        if (ExampleModel._instance == null) {
            ExampleModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): ExampleModel {
        if (ExampleModel._instance == null) {
            ExampleModel._instance = new ExampleModel();
        }
        return ExampleModel._instance;
    }
}