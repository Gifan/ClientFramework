import { FuncCfgReader } from "./FuncCfg";
import { SoundCfgReader } from "./SoundCfg";


import { Log } from "../framework/Log";
import LZString = require("../util/lzstring");
class _Cfg {
    
    private _Func = new FuncCfgReader();
    public get Func() : FuncCfgReader {
        return this._Func;
    }
    private _Sound = new SoundCfgReader();
    public get Sound() : SoundCfgReader {
        return this._Sound;
    }

    private keyjs = {}

    /*async initByMergeJson() {
        //cc.log("Cfg.initByMergeJson start:" + new Date().getTime());
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes("config/GameJsonCfg", cc.JsonAsset, function (error: Error, resource: cc.JsonAsset) {
                if (error) {
                    cc.error("Cfg.initByMergeJson error", error);
                    reject();
                    return;
                }
                const json = resource.json;
                for (const key in json) {
                    if (!this.hasOwnProperty("_" + key)) {
                        cc.warn("Cfg.initByMergeJson null, " + key);
                        continue;
                    }
                    //cc.log("Cfg.initByMergeJson " + key);

                    let reader = this["_" + key];
                    reader.initByMap(json[key]);
                }
                resolve();

                //cc.log("Cfg.initByMergeJson finish:" + new Date().getTime());
            }.bind(this));
        });
    }*/

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
    /*async initRemoteJson(filename: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        return new Promise((resolve, reject) => {
            let url = Const.JsonRemoteUrl + filename + ".json";
            if(HD_MODULE.getPlatform().isIOS()||HD_MODULE.getPlatform().isAndroid()){
                BaseProtocol.request(url, {}, "GET", null).then((obj) => {
                    if (!this1.hasOwnProperty("_" + filename)) {
                        cc.warn("Cfg.initRemoteJson null, " + filename);
                        reject("err");
                    }

                    let reader = this1["_" + filename];
                    reader.initByMap(obj);
                    resolve();
                    _Cfg.cfgLoadNum += 1;
                    if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                    if(pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10:_Cfg.cfgLoadNum) / 100;
                }).catch(() => {
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
                        if(pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10:_Cfg.cfgLoadNum) / 100;
                        resolve();

                    })
                });
            }else{
                cc.loader.load(url, function (err, obj) {
                    if (err) {
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
                            if(pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10:_Cfg.cfgLoadNum) / 100;
                            resolve();
    
                        })
                    } else {
                        if (!this1.hasOwnProperty("_" + filename)) {
                            cc.warn("Cfg.initRemoteJson null, " + filename);
                            reject("err");
                        }
    
                        let reader = this1["_" + filename];
                        reader.initByMap(obj);
                        resolve();
                        _Cfg.cfgLoadNum += 1;
                        if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                        if(pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10:_Cfg.cfgLoadNum) / 100;
                    }
                });
            }
        })
    }*/
    
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
            /*let url = Const.JsonRemoteUrl + filename + ".config";
            BaseProtocol.request(url, null, "GET", 'text').then((obj) => {
                let jsondata = JSON.parse(LZString.decompressFromBase64(obj));
                if (!this1.hasOwnProperty("_" + filename)) {
                    cc.warn("Cfg.initRemoteJson null, " + filename);
                    resolve("err");
                }
                let reader = this1["_" + filename];
                reader.initByMap(jsondata);
                _Cfg.cfgLoadNum += 1;
                if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                resolve();
                
            }).catch(err => {
                //this1.initLocalConfig(filename, test, pro);
                resolve();
            })*/
        })
    }

    public HasTag(t : any, tag : number) : boolean {
        if (t.tags == null) {
            return false;
        }
        return t.tags.indexOf(tag) >= 0;
    }

    public selectArray<T>(cfg, field : string, index : number, defaultVal : T) : T {
        const array = cfg[field];
        if (array == null) {
            return defaultVal;
        }
        const val = array[index] as T;
        return val || defaultVal;
    }
}

export const Cfg = new _Cfg();