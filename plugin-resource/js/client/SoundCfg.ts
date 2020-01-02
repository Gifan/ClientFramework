import { TConfig } from "./TConfig";


export interface SoundCfg extends IConfig {id:number;define?:string;name:string;paths:string[];volume:number;loop:number;}

export const SoundDefine = {
    "BtnAffirm": 1
}

export class SoundCfgReader extends TConfig<SoundCfg> {
    protected _name : string = "Sound";

    public constructor() {
        super();
        this.initByMap({
    "1": {
        "id": 1,
        "define": "BtnAffirm",
        "name": "按钮确定音效",
        "paths": [
            "audio/button"
        ],
        "volume": 1,
        "loop": 0
    }
});
    }
}