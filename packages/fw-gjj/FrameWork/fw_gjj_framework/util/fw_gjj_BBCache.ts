export class BBCacheBase { }
export default class BBCache<T> extends BBCacheBase {
    constructor(name: string, defaultValue?: T) {
        super();
        this.name = name;
        this._cache = defaultValue;
    }
    name: string;
    private _cache: T;
    get value(): T { return this.get(); }
    set value(value: T) { this.set(value); }
    get() {
        if (!this._cache)
            this._cache = fw.bb.get(this.name);
        return this._cache;
    }
    set(value: T) {
        if (value == this._cache) return;
        this._cache = value;
        fw.bb.set(this.name, value);
    }
    on(fn: (newValue: T, oldValue?: T) => void, caller?: object) {
        fw.bb.on(this.name, fn, caller);
    }
    off(fn: (newValue: T, oldValue?: T) => void) {
        fw.bb.off(this.name, fn);
    }
    listen(isOn: boolean, fn: (newValue: T, oldValue?: T) => void, caller?: object) {
        fw.bb.listen(isOn, this.name, fn, caller);
    }
}
/*
class TsTest {
    test() {
        let a: any = null;
        let o: object = null;
        let b: boolean = null;
        let n: number = null;
        let s: string = null;
        let f: Function = null;
        let u: undefined = null;
        let l: null = null;

        a = a;
        o = a;
        b = a;
        n = a;
        s = a;
        f = a;
        u = a;
        l = a;

        a = u;
        o = u;
        b = u;
        n = u;
        s = u;
        f = u;
        u = u;
        l = u;

        a = l;
        o = l;
        b = l;
        n = l;
        s = l;
        f = l;
        u = l;
        l = l;

        a = o;
        o = o;
        b = o as boolean;
        n = o as number;
        s = o as string;
        f = o as Function;
        u = o as undefined;
        l = o as null;

        a = b;
        o = b as object;
        b = b;
        n = b as number;
        s = b as string;
        f = b as Function;
        u = b as undefined;
        l = b as null;

        a = f;
        o = f;
        b = f as boolean;
        n = f as number;
        s = f as string;
        f = f as Function;
        u = f as undefined;
        l = f as null;
    }
}
*/