import { UserVo } from "./UserVo";
import { SwitchVo } from "./SwitchVo";
import { StorageID } from "../StorageID";
import { Const } from "../config/Const";
import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
import { Manager } from "../manager/Manager";

let generateRoleTag = (function genTag() {
    var tag = 1;
    function a() { tag += 1; return tag; };
    return a;
})();

export class VoManager {
    private static _instance: VoManager = null;
    private _userVo: UserVo;
    private _switchVo: SwitchVo;
    public isGetData: boolean = false;
    public designSize: { width: number, height: number, radioHeight: number, radioWidth: number } = null;

    public static get getInstance(): VoManager {
        if (VoManager._instance == null) {
            VoManager._instance = new VoManager();
        }
        return VoManager._instance;
    }

    public constructor() {
        this._userVo = new UserVo();
        this._switchVo = new SwitchVo();
    }

    public get switchVo(): SwitchVo {
        return this._switchVo;
    }
    public get userVo(): UserVo {
        return this._userVo;
    }

    public get isNewUser() {
        return this._userVo.isNewUser;
    }
    public set isNewUser(boo) {
        this._userVo.isNewUser = !!boo;
    }

    public updateSwitchVo(res: Object) {
        this.switchVo.updateSwitchVo(res);
    }

    public saveUserData(): Promise<any> | void {
        if (!this.isGetData) return;
        let data = this.userVo.serializeAll();
        this.updateLocalUserData(data);
    }

    public updateLocalUserData(data: string) {
        try {
            let newdata = data;
            if (data == "" || data == null) {
                newdata = this.userVo.serializeAll();
            }
            Manager.storage.setString(StorageID.UserData, newdata);
        } catch (error) {
            console.error(error);
        }
    }

    public getLocalData(key?: string) {
        let a = Manager.storage.getString(StorageID.UserData, "{}");
        return JSON.parse(a);
    }

    public getGold(): number {
        return this._userVo.gold;
    }

    public setGold(gold: number, from: number = 0) {
        this._userVo.gold += gold;
        Notifier.send(ListenID.Game_UpdateGold, gold, from)
    }

    public getNewId(): number {
        return generateRoleTag();
    }

    public setPower(power: number, way: Const.PowerUse = Const.PowerUse.GetDefault) {
        this._userVo.power += power;
        if (this._userVo.power < 0) this._userVo.power = 0;
        // this._userVo.power = cc.misc.clampf(this._userVo.power, 0, Const.MaxPower);
        Notifier.send(ListenID.Game_UpdatePower, power, way);
    }
    public getPower(): number {
        return this._userVo.power;
    }
}