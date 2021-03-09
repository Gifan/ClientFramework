import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { Manager } from "../../manager/Manager";
import { Time } from "../../manager/Time";

export default class PowerModel extends MVC.BaseModel {
    public powerRecorverTime: number = 300;//300秒
    public initPowerNum: number = 5;
    private static _instance: PowerModel = null;
    private startCountPower: number = 0;
    private startCountPower2: number = 0;
    private constructor() {
        super();
        if (PowerModel._instance == null) {
            PowerModel._instance = this;
        }
        this.startCountPower = 0;
        this.startCountPower2 = 0;
    }
    public reset(): void {

    }

    public static get getInstance(): PowerModel {
        if (PowerModel._instance == null) {
            PowerModel._instance = new PowerModel();
        }
        return PowerModel._instance;
    }

    public updatePower(dt) {
        if (Manager.vo.userVo.power >= this.initPowerNum) return;
        this.startCountPower += dt;
        this.startCountPower2 += dt;
        if (this.startCountPower >= 1) {
            Manager.vo.userVo.powerRecoverTime += 1000;
            this.startCountPower = 0;
            Notifier.send(ListenID.Power_DonwTime, this.countTime);
        }
        if (Manager.vo.userVo.powerRecoverTime >= Manager.vo.userVo.nextPowerTime || this.startCountPower2 >= this.powerRecorverTime) {
            Manager.vo.setPower(1);
            Manager.vo.userVo.nextPowerTime = Time.serverTimeMs + this.powerRecorverTime * 1000;
            this.startCountPower2 = 0;
        }
    }
    public refreshPowerTime() {
        let power = 0;
        if (Manager.vo.userVo.nextPowerTime <= Time.serverTimeMs) {
            let delta = (Time.serverTimeMs - Manager.vo.userVo.nextPowerTime) / 1000;
            power = Math.ceil(delta / this.powerRecorverTime);
            this.startCountPower2 = Math.floor(delta % this.powerRecorverTime);
            Manager.vo.userVo.nextPowerTime = Time.serverTimeMs + (this.powerRecorverTime - this.startCountPower2) * 1000;
        } else {
            let time = Math.floor((Manager.vo.userVo.nextPowerTime - Time.serverTimeMs) / 1000);
            this.startCountPower2 = this.powerRecorverTime - time;
            Notifier.send(ListenID.Game_UpdatePower);
        }
        Manager.vo.userVo.powerRecoverTime = Time.serverTimeMs;
        if (power > 0 && Manager.vo.userVo.power < this.initPowerNum) {
            if (power > this.initPowerNum) {
                power = this.initPowerNum - Manager.vo.userVo.power;
            }
            Manager.vo.setPower(power);
        }
    }

    public get countTime() {
        return this.powerRecorverTime - this.startCountPower2;
    }

    public getCurPower() {
        return Manager.vo.userVo.power;
    }
}