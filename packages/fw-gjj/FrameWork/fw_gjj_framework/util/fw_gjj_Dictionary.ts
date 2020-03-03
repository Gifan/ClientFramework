export default class Dictionary<T> {
    constructor() {
        this._items = new Array<T>();
    }
    _items: Array<T>;
    set(key: string, value: T): void {//向字典中添加新的元素
        this._items[key] = value;
    }
    delete(key: string): boolean {//删除字典中某个指定元素
        if (this.has(key)) {
            delete this._items[key];
            return true;
        }
        return false;
    }
    has(key: string): boolean {//如果某个键值存在于这个字典中，则返回true，否则返回false
        return this._items.hasOwnProperty(key);
    }
    get(key: string): T {//通过键值查找特定的数值并返回。
        return this.has(key) ? this._items[key] : undefined;
    };
    clear(): void {//将这个字典中的所有元素全部删除。
        this._items = new Array<T>();
    }
    size(): number {//返回字典所包含元素的数量。
        return Object.keys(this._items).length;
    }
    keys(): Array<string> {//将字典所包含的所有键名以数组形式返回。
        return Object.keys(this._items);
    }
    values(): Array<T> {//将字典所包含的所有数值以数组形式返回。
        var values = [];
        for (var k in this._items) {
            if (this.has(k)) {
                values.push(this._items[k]);
            }
        }
        return values;
    }
    each(fn: (string, T) => void): void {//遍历每个元素并且执行方法
        for (var k in this._items) {
            if (this.has(k)) {
                fn(k, this._items[k]);
            }
        }
    }
    getthisItems(): Array<T> {//返回字典
        return this._items;
    }
}