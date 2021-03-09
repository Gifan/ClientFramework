import { MVC } from "../../framework/MVC";

export default class PhysicsModel extends MVC.BaseModel {

    private static _instance: PhysicsModel = null;

    private constructor() {
        super();
        if (PhysicsModel._instance == null) {
            PhysicsModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): PhysicsModel {
        if (PhysicsModel._instance == null) {
            PhysicsModel._instance = new PhysicsModel();
        }
        return PhysicsModel._instance;
    }
}