import { EventCfgReader } from "./EventCfg";
import { SoundCfgReader } from "./SoundCfg";


import { Log } from "../framework/Log";
import LZString = require("../util/lzstring");
class _Cfg {
    
    private _Event = new EventCfgReader();
    public get Event() : EventCfgReader {
        return this._Event;
    }
    private _Sound = new SoundCfgReader();
    public get Sound() : SoundCfgReader {
        return this._Sound;
    }

    /*async initByMergeJson() {
        //cc.log("Cfg.initByMergeJson start:" + new Date().getTime());
        return new Promise((resolve, reject)=>{
            cc.resource.load("config/GameJsonCfg", cc.JsonAsset, function (error: Error, resource: cc.JsonAsset) {
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
                resolve(null);

                //cc.log("Cfg.initByMergeJson finish:" + new Date().getTime());
            }.bind(this));
        });
    }*/

    async initBySingleJson() {
        //cc.log("Cfg.initBySingleJson start:" + new Date().getTime());
        return new Promise((resolve, reject) => {
            cc.resources.loadDir("config", function (error: Error, resources: cc.JsonAsset[], urls: string[]) {
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
                resolve(null);

                //cc.Log("Cfg.initBySingleJson finish:" + new Date().getTime());
            }.bind(this));
        });
    }

    private static cfgLoadNum: number = 0;
    async initRemoteJson(filepath: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        let url = filepath + ".json";
        let filenames = filepath.split("/");
        let filename = filenames[filenames.length - 1];
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.responseType = "text";
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        let jsondata = JSON.parse(req.responseText);
                        if (!this1.hasOwnProperty("_" + filename)) {
                            cc.warn("Cfg.initRemoteJson null, " + filename);
                            reject("err");
                        }
                        let reader = this1["_" + filename];
                        reader.initByMap(jsondata);
                        _Cfg.cfgLoadNum += 1;
                        if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                        if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                        resolve(null);
                    } else {
                        cc.resources.load("config/" + filename, cc.JsonAsset, function (err, obj2) {
                            if (err) {
                                resolve("err");
                            }
                            const key = obj2.name;
                            if (!this1.hasOwnProperty("_" + key)) {
                                cc.warn("Cfg.initRemoteJson null, " + key);
                                reject("err");
                            }

                            let reader = this1["_" + key];
                            reader.initByMap((obj2 as cc.JsonAsset).json);
                            _Cfg.cfgLoadNum += 1;
                            if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                            if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                            resolve(null);

                        });
                    }
                }
            }
            req.setRequestHeader('content-type', 'application/json')
            req.timeout = 5000;
            req.ontimeout = () => {
                cc.resources.load("config/" + filename, cc.JsonAsset, function (err, obj2) {
                    if (err) {
                        resolve("err");
                    }
                    const key = obj2.name;
                    if (!this1.hasOwnProperty("_" + key)) {
                        cc.warn("Cfg.initRemoteJson null, " + key);
                        reject("err");
                    }

                    let reader = this1["_" + key];
                    reader.initByMap((obj2 as cc.JsonAsset).json);
                    _Cfg.cfgLoadNum += 1;
                    if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                    if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                    resolve(null);

                });
            }
            req.send();
        })
    }

    async initLocalJson(filename: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        return new Promise((resolve, reject) => {
            cc.resources.load("config/" + filename, cc.JsonAsset, function (err, obj2) {
                if (err) {
                    reject("err");
                }
                const key = obj2.name;
                if (!this1.hasOwnProperty("_" + key)) {
                    cc.warn("Cfg.initRemoteJson null, " + key);
                    reject("err");
                }

                let reader = this1["_" + key];
                reader.initByMap((obj2 as cc.JsonAsset).json);
                _Cfg.cfgLoadNum += 1;
                if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                resolve(null);

            })
        });
    }

    async initRemoteConfig(filepath: string, test?: cc.Label, pro?: cc.ProgressBar) {
        let this1 = this;
        let url = filepath + ".config";
        let filenames = filepath.split("/");
        let filename = filenames[filenames.length - 1];
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.responseType = "text";
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        let jsondata = JSON.parse(LZString.decompressFromBase64(req.responseText));
                        if (!this1.hasOwnProperty("_" + filename)) {
                            cc.warn("Cfg.initRemoteJson null, " + filename);
                            reject("err");
                        }
                        let reader = this1["_" + filename];
                        reader.initByMap(jsondata);
                        _Cfg.cfgLoadNum += 1;
                        if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                        if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                        resolve(null);
                    } else {
                        cc.resources.load("config/" + filename, cc.Asset, function (err, obj2) {
                            if (err) {
                                reject(err);
                            }
                            const key = filename;
                            let data = obj2 as any;
                            let jsondata = JSON.parse(LZString.decompressFromBase64(data._nativeAsset));
                            if (!this1.hasOwnProperty("_" + key)) {
                                cc.warn("Cfg.initRemoteConfig null, " + key);
                                reject("err");
                            }

                            let reader = this1["_" + key];
                            reader.initByMap(jsondata);
                            _Cfg.cfgLoadNum += 1;
                            if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                            if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                            resolve(null);

                        })
                    }
                }
            }
            req.setRequestHeader('content-type', 'text/plain')
            req.timeout = 5000;
            req.ontimeout = () => {
                cc.resources.load("config/" + filename, cc.Asset, function (err, obj2) {
                    if (err) {
                        reject(err);
                    }
                    const key = filename;
                    let data = obj2 as any;
                    let jsondata = JSON.parse(LZString.decompressFromBase64(data._nativeAsset));
                    console.log(jsondata);
                    if (!this1.hasOwnProperty("_" + key)) {
                        cc.warn("Cfg.initRemoteConfig null, " + key);
                        reject("err");
                    }

                    let reader = this1["_" + key];
                    reader.initByMap(jsondata);
                    _Cfg.cfgLoadNum += 1;
                    if (test) test.string = `${_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum}%`;
                    if (pro) pro.progress = (_Cfg.cfgLoadNum > 10 ? 10 : _Cfg.cfgLoadNum) / 100;
                    resolve(null);

                })
            }
            req.send()
        });
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