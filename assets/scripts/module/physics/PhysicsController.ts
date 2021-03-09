import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import PhysicsModel from "./PhysicsModel";

/*
 * desc
 */
export class PhysicsController extends MVC.MController<PhysicsModel> {
    public constructor() {
        super();
        this.setup(PhysicsModel.getInstance);
        this.initPhysics();
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "PhysicsController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Cheat_PhysicsDebug, this.physicsDebug, this);
        // Notifier.changeListener(enable, ListenID.Physics_SetLookDown, this.setIsLookDown, this);
        Notifier.changeListener(enable, ListenID.Physics_SetEnable, this.setEnable, this);
    }

    private setEnable(bool:boolean){
        cc.director.getPhysicsManager().enabled = bool;
    }

    private initPhysics() {
        let manager = cc.director.getPhysicsManager();
        if (manager) {
            manager.enabled = true;
            // manager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit|cc.PhysicsManager.DrawBits.e_jointBit;
            manager.gravity = cc.v2(0, -555);
            // 开启物理步长的设置
            // manager.enabledAccumulator = true;
            // 物理步长，默认 FIXED_TIME_STEP 是 1/60
            // cc.PhysicsManager.FIXED_TIME_STEP = 0.0166;
            // 每次更新物理系统处理速度的迭代次数，默认为 10
            // cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
            // // 每次更新物理系统处理位置的迭代次数，默认为 10
            // cc.PhysicsManager.POSITION_ITERATIONS = 8;
        }
    }

    // private setIsLookDown(isLookDown: boolean) {
    //     let manager = cc.director.getPhysicsManager();
    //     if (manager) {
    //         if (isLookDown) {
    //             manager.gravity = cc.v2(0, 0);
    //         } else {
    //             manager.gravity = cc.v2(0, -555);
    //         }
    //     }
    // }

    private physicsDebug(boo: boolean) {
        let manager = cc.director.getPhysicsManager();
        if (boo) {
            manager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_jointBit |
                cc.PhysicsManager.DrawBits.e_shapeBit;
        } else {
            manager.debugDrawFlags = 0;
        }
    }
}

