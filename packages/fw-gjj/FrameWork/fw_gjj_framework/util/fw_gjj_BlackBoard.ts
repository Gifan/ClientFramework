import Dictionary from "./fw_gjj_Dictionary";

type BBEvent<T> = (nv?: T, ov?: T) => void;
type BBListener<T> = { cb: BBEvent<T>; caller?: object; }
type BBItem<T> = { value: T; listeners: Array<BBListener<T>>; }

export default class BlackBoard<T> {
    constructor(isLog) {
        this._isLog = isLog;
        this._dict = new Dictionary<BBItem<T>>();
    }
    private _isLog: boolean;
    private _dict: Dictionary<BBItem<T>>;

    /** [获取属性] 获取黑板上的属性值
     * @param name 属性的名称
     */
    get(name: string) {
        let item = this._dict.get(name);
        if (!item) return;
        return item.value;
    }
    /** [更新属性] 更新黑板上的属性, 会将该属性更变前后的值通知到相应关注者
     * @param name 属性的名称
     * @param value 属性的值
     */
    set(name: string, value: T) {
        let item = this._dict.get(name);
        if (!item) {
            item = { value: value, listeners: [] };
            this._dict.set(name, item);
            this._isLog && cc.log("[bb][set] >> [\"" + name + "\"][0] ", value);
            return;
        }
        let lsners = item.listeners;
        let l = lsners.length;
        if (!l) {
            this._isLog && cc.log("[bb][set] >> [\"" + name + "\"][0] ", item.value, " >> ", value);
            item.value = value;
            return;
        }

        let oldValue = item.value;
        item.value = value;

        this._isLog && cc.log("[bb][set] >> [\"" + name + "\"][" + l + "] ", oldValue, " >> ", value);

        let i = 0;
        while (i < lsners.length) {
            let lsner = lsners[i];
            try { lsner.cb.call(lsner.caller, value, oldValue); }
            catch (e) { console.log("black board error at name \"" + name + "\" with caller : ", lsner && lsner.caller, e); }
            l === lsners.length ? i++ : l = lsners.length;
        }
        //for (let i = 0; i < item.listeners.length; i++) {
        //    let lsner = item.listeners[i];
        //    try { lsner.cb.call(lsner.caller, value, oldValue); }
        //    catch (e) { console.log("black board error at name \"" + name + "\" with caller : ", lsner && lsner.caller, e); }
        //}
    }
    /** [删除属性] 删除黑板上的属性
     * @param name 属性的名称
     */
    delete(name: string) {
        let item = this._dict.get(name);
        if (!item) {
            this._isLog && cc.log("[bb][del][!nnm] !x [\"" + name + "\"][0]");
            return;
        }
        this._dict.delete(name);
        this._isLog && cc.log("[bb][del][!nnm] !x [\"" + name + "\"][" + item.listeners.length + "]");
    }
    /** [监听属性] 统一处理关注及取消的 API
     * @param isOn 关注/取消
     * @param name 属性的名称
     * @param cb 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
     * @param caller (可选参数) 回调的调用者(取消时不使用)
     */
    listen(isOn: boolean, name: string, cb: BBEvent<T>, caller?: object) {
        isOn ?
            this.add(name, cb, caller)
            :
            this.remove(name, cb);
    }
    /** [关注属性] 关注黑板上的属性, 当属性发生更变时会发出回调通知
     * @param name 属性的名称
     * @param cb 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
     * @param caller (可选参数) 回调的调用者
     */
    on(name: string, cb: BBEvent<T>, caller?: object) { this.add(name, cb, caller); }
    /** [关注属性] 关注黑板上的属性, 当属性发生更变时会发出回调通知
     * @param name 属性的名称
     * @param cb 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
     * @param caller (可选参数) 回调的调用者
     */
    add(name: string, cb: BBEvent<T>, caller?: object) {
        let item = this._dict.get(name);
        if (!item) {
            item = { value: null, listeners: [] };
            this._dict.set(name, item);
        }
        else if (this._indexOfFn(item.listeners, cb) != -1) {
            this._isLog && cc.log("[bb][add][!re] !+ [\"" + name + "\"][" + item.listeners.length + "] " + cb["name"]);
            return;
        }

        item.listeners.push({ cb, caller });
        this._isLog && cc.log("[bb][add] ++ [\"" + name + "\"][" + item.listeners.length + "] " + cb["name"]);
    }
    /** [取消关注属性] 取消关注黑板上的属性, 需要提供关注时提供的回调方法
     * @param name 属性的名称
     * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
     */
    off(name: string, fn: BBEvent<T>) { this.remove(name, fn); }
    /** [取消关注属性] 取消关注黑板上的属性, 需要提供关注时提供的回调方法
     * @param name 属性的名称
     * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
     */
    remove(name: string, fn: BBEvent<T>) {
        let item = this._dict.get(name);
        if (!item) {
            this._isLog && cc.log("[bb][rmv][!nnm] !- [\"" + name + "\"]");
            return;
        }

        let i = this._indexOfFn(item.listeners, fn);
        if (i == -1) {
            this._isLog && cc.log("[bb][rmv][!nfn] !- [\"" + name + "\"][" + item.listeners.length + "] " + fn["name"]);
            return;
        }

        item.listeners.splice(i, 1);

        if (item.listeners.length == 0 && item.value == null)
            this._dict.delete(name);

        this._isLog && cc.log("[bb][rmv] -- [\"" + name + "\"][" + item.listeners.length + "] " + fn["name"]);
    }
    /** [清空黑板] 清除黑板上所有属性和关注数据 */
    clear() {
        this._dict.clear();
        this._isLog && cc.log("[bb][clr]");
    }
    /** [清空黑板] 清除黑板上指定名称的属性和关注数据 */
    clearByName(name: string) {
        let item = this._dict.get(name);
        if (!item) return;
        let fns = item.listeners;
        if (!fns) return;
        let length = fns.length;
        fns.length = 0;
        this._isLog && cc.log("[bb][clr][\"" + name + "\"][" + length + "]");
    }

    /** [查找方法索引] 查找方法索引 */
    private _indexOfFn(fns: Array<BBListener<T>>, fn: BBEvent<T>) {
        for (let i = 0; i < fns.length; i++)
            if (fns[i].cb == fn) return i;
        return -1;
    }
}