export class LocalStorageObject<T> {
    constructor(public name: string, private _getDefaultValue: () => T) {
        this._stringValue = cc.sys.localStorage.getItem(name);
        //cc.log("[LocalStorageObject][constructor]", name, this._stringValue, typeof this._stringValue);
        if (this._stringValue) {
            try {
                this._value = JSON.parse(this._stringValue);
                return;
            } catch (e) { cc.error("JSON.parse error at ctor LocalStorageObject named " + name + " , valued " + this._stringValue, e); }
        }
        this._stringValue = JSON.stringify(_getDefaultValue());
        cc.sys.localStorage.setItem(this.name, this._stringValue);
        this._value = _getDefaultValue();
    }
    private _value: T;
    private _stringValue: string;
    get value(): T { return this.get(); }
    set value(value: T) { this.set(value); }
    get() { return this._value; }
    set(value: T) {
        let stringValue = JSON.stringify(value);
        if (stringValue === this._stringValue) return;
        this._value = value;
        this._stringValue = stringValue;
        cc.sys.localStorage.setItem(this.name, stringValue);
    }
    update() { this.set(this.get()); }
    reset() { this.set(this._getDefaultValue()); }
    clear() { cc.sys.localStorage.clear(this.name); }
}