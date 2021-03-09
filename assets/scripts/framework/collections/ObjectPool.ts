
export class ObjectPool<T> {
    private _onPop: (t: T) => void;
    private _onPush: (t: T) => void;
    private _ctor : ()=>T;
    private _queue: T[];

    public constructor(ctor : () => T, onPop: (t: T) => void = null, onPush: (t: T) => void = null) {
        this._ctor = ctor;
        this._queue = [];
        this._onPop = onPop;
        this._onPush = onPush;
    }

    public pop(): T {
        let t: T;
        if (this._queue.length > 0) {
            t = this._queue.shift();
        }
        else {
            t = this._ctor();
        }
        if (this._onPop != null) {
            this._onPop(t);
        }
        return t;
    }

    public push(t: T) {
        if (this._onPush != null) {
            this._onPush(t);
        }
        this._queue.push(t);
    }

    public clear() {
        this._queue = [];
    }
}