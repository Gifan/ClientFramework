import { MVC } from "../../framework/MVC";

export default class TestModel extends MVC.BaseModel {

    private static _instance: TestModel = null;

    public constructor() {
        super();
        if (TestModel._instance == null) {
            TestModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): TestModel {
        if (TestModel._instance == null) {
            TestModel._instance = new TestModel();
        }
        return TestModel._instance;
    }
}