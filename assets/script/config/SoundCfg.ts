import { TConfig } from "./TConfig";


export interface SoundCfg extends IConfig {id:number;define?:string;name:string;volume:number;path:string;loop:number;}

export const SoundDefine = {
    "BtnAffirm": 1,
    "bgm1": 2
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
        "volume": 1,
        "path": "audio/button",
        "loop": 0
    },
    "2": {
        "id": 2,
        "define": "bgm1",
        "name": "背景音乐",
        "volume": 1,
        "path": "audio/bgm",
        "loop": 1
    }
});
    }
}