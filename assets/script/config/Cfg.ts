import LZString = require("../util/lzstring");
import { SoundCfgReader } from "./SoundCfg";
import { Log } from "../framework/Log";
class _Cfg {
    private _Sound = new SoundCfgReader();
    public get Sound(): SoundCfgReader {
        return this._Sound;
    }

    async initBySingleJson() {
        //cc.log("Cfg.initBySingleJson start:" + new Date().getTime());
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir("config", function (error: Error, resources: cc.JsonAsset[], urls: string[]) {
                if (error) {
                    Log.error("Cfg.initBySingleJson error", error);
                    reject();
                    return;
                }
                for (let index = 0; index < resources.length; index++) {
                    const element = resources[index];
                    const key = element.name;
                    if (!this.hasOwnProperty("_" + key)) {
                        Log.warn("Cfg.initBySingleJson null, " + key);
                        continue;
                    }
                    //cc.Log("Cfg.initBySingleJson " + key);

                    let reader = this["_" + key];
                    reader.initByMap(element.json);
                }
                resolve();

                //cc.Log("Cfg.initBySingleJson finish:" + new Date().getTime());
            }.bind(this));
        });
    }
    private static cfgLoadNum: number = 0;
    async initLocalJson(filename: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        return new Promise((resolve, reject) => {
            cc.loader.loadRes("config/" + filename, cc.JsonAsset, function (err, obj2) {
                if (err) {
                    reject("err");
                }
                const key = obj2.name;
                if (!this1.hasOwnProperty("_" + key)) {
                    cc.warn("Cfg.initRemoteJson null, " + key);
                    reject("err");
                }

                let reader = this1["_" + key];
                reader.initByMap(obj2.json);
                _Cfg.cfgLoadNum += 1;
                if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                resolve();

            })
        })
    }

    async initRemoteConfig(filename: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        return new Promise((resolve, reject) => {
            // let url = Const.JsonRemoteUrl + filename + ".config";
            // BaseProtocol.request(url, null, "GET", 'text').then((obj) => {
            //     let jsondata = JSON.parse(LZString.decompressFromBase64(obj));
            //     if (!this1.hasOwnProperty("_" + filename)) {
            //         Log.warn("Cfg.initRemoteJson null, " + filename);
            //         resolve("err");
            //     }
            //     let reader = this1["_" + filename];
            //     reader.initByMap(jsondata);
            //     _Cfg.cfgLoadNum += 1;
            //     if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
            //     if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
            //     resolve();

            // }).catch(err => {
            //     //this1.initLocalConfig(filename, test, pro);
            //     resolve();
            // })
        })
    }
}
export const Cfg = new _Cfg();