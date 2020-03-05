import { UserVo } from "./UserVo";
import { SwitchVo } from "./SwitchVo";
import { Manager } from "../framework/manager/Manager";
import { StorageID } from "../StorageID";

export class VoManager {
    private static _instance: VoManager = null;
    private _userVo: UserVo;
    private _switchVo: SwitchVo;
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

    public uodateSwitchVo(res: Object) {
        this.switchVo.updateSwitchVo(res);
    }

    public saveUserData(): Promise<any> | void {
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
}