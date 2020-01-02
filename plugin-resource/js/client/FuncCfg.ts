import { TConfig } from "./TConfig";


export interface FuncCfg extends IConfig {id:number;define?:string;name?:string;view?:string;father?:number;icon?:string;unlock?:object;pics?:string[];}

export const FuncDefine = {
    "Login": 1,
    "Setting": 2
}

export class FuncCfgReader extends TConfig<FuncCfg> {
    protected _name : string = "Func";

    public constructor() {
        super();
        this.initByMap({
    "1": {
        "id": 1,
        "define": "Login",
        "name": "登录界面",
        "view": "LoginView"
    },
    "2": {
        "id": 2,
        "define": "Setting",
        "name": "设置界面",
        "view": "SettingView"
    }
});
    }
}