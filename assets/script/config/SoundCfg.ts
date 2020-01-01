import { TConfig } from "./TConfig";


export interface SoundCfg extends IConfig { id: number; name: string; path: string; volume: number; loop: boolean; }


export class SoundCfgReader extends TConfig<SoundCfg> {
    protected _name: string = "Sound";
    public constructor() {
        super();
        this.initByMap({
            "101": {
                "id": 101,
                "name": "武器101",
                "path": "audio/fire101",
                "volume": 1,
                "loop": false
            },
        });

    }
}