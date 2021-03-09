import { Log } from "../Log";

type CompareDelegate = (left, right) => number;


/// <summary>
/// 最小值容器，直接插入排序稳定
/// 可以用数组自己实现一版优化删除首元素的版本，用游标Cursor记录首元素位置，实现删除操作O(1)时间消耗
/// </summary>
/// <typeparam name="T"></typeparam>
export class MinSortList<T> {

    private _element: T[];
    private _compareEv: CompareDelegate;
    public constructor(compareEv: CompareDelegate) {
        this._compareEv = compareEv;
        this._element = new Array<T>();
    }

    private _count = 0;
    public get count() {
        return this._count;
    }

    public clear(action: (t: T) => void = null, target = null) {
        this._count = 0;
        if (action != null) {
            this._element.forEach(element => {
                action.call(target, element);
            });
        }
        this._element.splice(0, this._element.length);
    }

    public frist(predicate: (t: T) => boolean, target = null): T {
        if (predicate == null) {
            Log.error("MinSortList Frist predicate null");
            return null;
        }
        if (this._element == null) {
            return null;
        }

        for (let index = 0; index < this._element.length; index++) {
            const element = this._element[index];
            if (predicate.call(target, element)) {
                return element;
            }
        }
        return null;
    }

    public forEach(action: (t: T) => void, target: any) {
        if (this._element == null) {
            return;
        }
        this._element.forEach(element => {
            action.call(target, element);
        });
    }

    public add(t: T) {
        this._element.push(t);
        this.sortDown(this._count, t);
        ++this._count;
    }

    public del(t: T): T {
        let index = this._element.indexOf(t);
        if (index < 0) {
            return null;
        }

        --this._count;
        let element = this._element.splice(index, 1);
        return element[0];
    }

    public peek(): T {
        if (this._count <= 0) {
            return null;
        }
        return this._element[0];
    }

    public pop(): T {
        if (this._count <= 0) {
            return null;
        }
        --this._count;
        let t: T = this._element.shift();
        return t;
    }

    /// <summary>
    /// 重新排序
    /// </summary>
    /// <param name="t">更改目标</param>
    public sort(t: T) {
        let index: number = this._element.indexOf(t);
        if (index < 0) {
            return;
        }
        if (index == 0) {
            this.sortUp(index, t);
        }
        else if (index == this.count - 1) {
            this.sortDown(index, t);
        }
        else {
            let prev = this._element[index - 1];
            if (this._compareEv(prev, t) > 0) {
                this.sortDown(index, t);
            }
            else {
                this.sortUp(index, t);
            }
        }
    }

    /// <summary>
    /// 底部最优先
    /// </summary>
    /// <param name="index"></param>
    /// <param name="t"></param>
    private sortDown(index: number, t: T) {
        let element;
        for (let i = index - 1; i >= 0; i--) {
            element = this._element[i];
            if (this._compareEv(element, t) <= 0) {
                break;
            }
            this._element[i] = t;
            this._element[i + 1] = element;
        }
    }

    private sortUp(index: number, t: T) {
        let element;
        for (let i = index + 1; i < this._count; i++) {
            element = this._element[i];
            if (this._compareEv(element, t) >= 0) {
                break;
            }
            this._element[i - 1] = element;
            this._element[i] = t;
        }
    }

    private m_emptyNum = 0;
    private m_log = "";
    private toStringT(t: T) {
        if (t == null) {
            ++this.m_emptyNum;
            return;
        }
        this.m_log += t.toString() + "\n";
    }

    public toString() {
        this.m_emptyNum = 0;
        this.m_log = "";
        this.forEach(this.toStringT, this);
        if (this.m_emptyNum > 0) {
            this.m_log += "empty:" + this.m_emptyNum;
        }
        return this.m_log;
    }
}