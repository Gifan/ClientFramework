// 顺序池;
export class PoolArray {
    public max_count: number = 0;
    public template: cc.Prefab = null;

    public parent: cc.Node = null;
    public firstLoad: Function[] = [];

    private m_item_list: { [key: number]: cc.Node } = {};

    public hasLoadObj(i: number): cc.Node {
        let index = i % this.max_count;
        return this.m_item_list[index];
    }

    public getObj(i: number, activeAuto: boolean = true): cc.Node {
        if (this.max_count === 0) {
            cc.log("最大容量必须大于0");
            return null;
        }

        let index = i % this.max_count;

        let obj: cc.Node = null;

        if (this.m_item_list[index]) {
            obj = this.m_item_list[index];
        }
        else {
            obj = cc.instantiate(this.template);
            this.m_item_list[index] = obj;
            obj.parent = this.parent;
            for (let v of this.firstLoad) {
                v(obj, i, index);
            }
        }

        if (activeAuto) {
            obj.active = true;
        }

        return obj;
    }

    // 隐藏剩余的;
    public hideOther(data_source_count) {
        let count = data_source_count;
        if (count < 0) {
            count = 0;
        }

        const length = Object.keys(this.m_item_list).length;

        for (let i = count; i < length; i++) {
            if (this.m_item_list[i] === null) {
                continue;
            }
            this.m_item_list[i].active = false;
        }
    }

    //
    public clear() {
        for (let key in this.m_item_list) {
            if (Object.prototype.hasOwnProperty.call(this.m_item_list, key)) {
                delete this.m_item_list[key];
            }
        }
    }
}