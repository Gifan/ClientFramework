import { TConfig } from "./TConfig";


export interface SoundCfg extends IConfig {id:number;define?:string;name:string;volume:number;path:string;loop:number;}

export const SoundDefine = {
    "bgm": 1,
    "button": 2,
    "collision": 3,
    "bomb": 4,
    "line": 5,
    "victory": 6,
    "gold": 7,
    "hit": 8,
    "wall": 9,
    "fire": 10,
    "board": 11,
    "lose": 12,
    "icescreen": 13
}

export class SoundCfgReader extends TConfig<SoundCfg> {
    protected _name : string = "Sound";


}