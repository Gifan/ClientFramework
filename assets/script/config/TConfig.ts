import { Log } from "../framework/Log";

declare interface Map<T> {
    [key: string]: T;
}

declare interface Param {
    [key: string]: any
}

export class TConfig<T extends IConfig> {
    protected _name: string = "";
    protected _map: Map<T>;

    public initByMap(map: Map<T>) {
        if (this._map != null) {
            // cc.error(this._name + " TConfig.initByMap repetition");
            // return;
        }

        this._map = map;
    }

    public initByArray(array: T[]) {
        if (this._map != null) {
            Log.error(this._name + " TConfig.initByArray repetition");
            return;
        }

        this._map = {};
        array.forEach(element => {
            this._map[element.id] = element;

            //cc.log(this._name + " TConfig.initByArray:", element.id, JSON.stringify(element));
        });
    }

    public tryGet(id: number | string): [boolean, T] {
        if (this._map == null) {
            Log.error(this._name + " TConfig.isExist _map null");
            return;
        }

        const element = this._map[id];
        return [element != null, element];
    }

    //根据配置表id获取行
    public get(id: number | string): T {
        if (this._map == null) {
            Log.error(this._name + " TConfig.get _map null");
            return;
        }

        const element = this._map[id];
        if (element == null) {
            Log.error(this._name + " TConfig.get fail, id:", id);
        }

        return element;
    }

    //找到第一个符合条件的行
    /// <param name="param">如{"type":2,"level":2}</param>
    public find(param: Param): T {
        if (this._map == null) {
            Log.error(this._name + " TConfig.find _map null");
            return;
        }

        //cc.log("find key:", JSON.stringify(param));
        for (const key in this._map) {
            const element = this._map[key];
            let fit = true;
            for (const k in param) {
                const v = param[k];
                const value = element[k];
                if (v !== value) {
                    fit = false;
                    break;
                }
            }
            if (fit) {
                return element;
            }
        }

        Log.error(this._name + " TConfig.find fail, key:", JSON.stringify(param));
        return null;
    }

    //通过条件筛选满足的所有行
    /// <param name="param">如{"type":2,"level":2}</param>
    public filter(param: Param): T[] {
        if (this._map == null) {
            Log.error(this._name + " TConfig.filter _map null");
            return;
        }

        //cc.log("filter key:", JSON.stringify(param));
        let results = [];
        for (const key in this._map) {
            const element = this._map[key];
            let fit = true;
            for (const k in param) {
                const v = param[k];
                const value = element[k];
                if (v !== value) {
                    fit = false;
                    break;
                }
            }
            if (fit) {
                results.push(element);
            }
        }

        if (results.length <= 0) {
            Log.error(this._name + " TConfig.filter fail, key:", JSON.stringify(param));
        }
        return results;
    }

    /// <summary>
    /// 根据给定的属性排序，1表示顺序，-1表示倒序，多个属性时按传入顺序判断，不存在是属性不判断
    /// </summary>
    /// <param name="go">如{"type":-1,"level":1}</param>
    public sort(array: T[], param: Param): void {
        array.sort((a: T, b: T): number => {
            for (const key in param) {
                const weigth = param[key];
                const aValue = a[key];
                const bValue = b[key];
                if (aValue != null && bValue != null) {
                    return weigth * (aValue - bValue);
                } else {
                    Log.warn(this._name + " TConfig.sort property null, key:", key, "id", a.id, b.id);
                }
            }
            return 0;
        });
    }

    public forEach(func: (value: T) => void, thisArg?: any): void {
        if (this._map == null) {
            Log.error(this._name + " TConfig.forEach _map null");
            return;
        }

        for (const key in this._map) {
            const element = this._map[key];
            func.call(thisArg, element);
        }
    }

    private _keyMap = null;
    /// <summary>
    /// 将两列表项进行映射，多个值会用最后的覆盖
    /// </summary>
    /// <param name="go">如{"type":-1,"level":1}</param>
    public keyMap<U>(key: string, mapKey: string, value): U {
        if (this._keyMap == null) {
            this._keyMap = {};
        }
        let keyMap = this._keyMap[key];
        if (keyMap == null) {
            keyMap = {};
            this._keyMap[key] = keyMap;
        }
        let map = keyMap[mapKey];
        if (map == null) {
            map = {};
            keyMap[mapKey] = map;

            for (const id in this._map) {
                const element = this._map[id];
                const keyValue = element[key];
                const mapValue = element[mapKey];
                if (keyValue != null && mapValue != null) {
                    map[keyValue] = mapValue;
                }
            }
        }

        return map[value] as U;
    }

    /// </summary>
    //获取整张表
    /// </summary>
    public getAll(): Map<T> {
        if (this._map == null) {
            Log.error(this._name + " TConfig.getAll _map null");
            return;
        }
        return this._map;
    }
}