import { UserVo } from "./UserVo";
import { SwitchVo } from "./SwitchVo";
import { StorageID } from "../StorageID";
import { Const } from "../config/Const";
import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
import { Manager } from "../manager/Manager";
import { EventDefine } from "../config/EventCfg";

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

    public setSkinState(id: number | string, state: number) {
        if (!this._userVo.skinList[id]) return;
        let oldstate = this._userVo.skinList[id].curState;
        this._userVo.skinList[id].curState = state;
        if (state >= 1) {
            this._userVo.skinList[id].curProgress = this._userVo.skinList[id].allProgress;
        }
        if (oldstate == 0 && state == 1) {
            // if (id == this._userVo.curTrialSkinId) {
            //     this._userVo.curTrialSkinId = 0;
            //     this._userVo.curTrialStageNum = 0;
            // }
            if (id == 101) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.skin_101);
            } else if (id == 102) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.skin_102);
            } else if (id == 103) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin103);
            } else if (id == 104) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin104);
            } else if (id == 105) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.skin_105);
            } else if (id == 106) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.skin_106);
            } else if (id == 107) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin107);
            } else if (id == 108) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin108);
            } else if (id == 109) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin109);
            } else if (id == 110) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin110);
            } else if (id == 111) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin111);
            } else if (id == 112) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_skin112);
            }
        }
        Notifier.send(ListenID.Skin_UpdateSkinStateFinish, id);
    }

    public setWeaponState(id: number | string, state: number) {
        if (!this._userVo.weaponList[id]) return;
        let oldstate = this._userVo.weaponList[id].curState;
        this._userVo.weaponList[id].curState = state;
        if (state >= 1) {
            this._userVo.weaponList[id].curProgress = this._userVo.weaponList[id].allProgress;
        }
        if (oldstate == 0 && state == 1) {
            if (id == 14) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_weapon14);
            } else if (id == 15) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_weapon15);
            } else if (id == 16) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_weapon16);
            } else if (id == 17) {
                Notifier.send(ListenID.Event_SendEvent, EventDefine.click_video_weapon17);
            }
        }
        Notifier.send(ListenID.Skin_UpdateWeaponStateFinish, id);
    }

    public getSkinState(id: number | string) {
        return this._userVo.skinList[id] && this._userVo.skinList[id].curState;
    }

    public getWeaponState(id: number | string) {
        return this._userVo.weaponList[id] && this._userVo.weaponList[id].curState;
    }
}