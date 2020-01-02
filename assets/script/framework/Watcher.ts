import { Log } from "./Log";

/**
 * 定时器
 */
export class Watcher {
    private _index: number;
    public get index() { return this._index; }

    private _nextTime: number;
    public get nextTime() { return this._nextTime; }

    private _delay: number;
    public get delay() { return this._delay; }
    public set delay(delay: number) { this._delay = delay }

    private _times: number;
    public get times() { return this._times; }
    private _func: (args: any) => void;
    private _args: any;
    private _target: any;

    public get enable() {
        return this._times > 0 || this.times == -1;
    }

    public constructor() {

    }

    _setIndex(index) {
        this._index = index;
    }

    initWithCallback(nextTime: number, delay: number, func: (args: any) => void, args = null, target = null, times: number = 1) {
        if (times < 0) {
            times = -1;
        }
        Log.log(nextTime, delay);
        this._nextTime = nextTime;
        this._delay = delay;
        this._times = times;
        this._func = func;
        this._args = args;
        this._target = target;
    }

    public cancal(complete = false) {
        if (complete) {
            this._callBack();
        }
        this._times = 0;
        this._args = null;
        this._func = null;
        this._args = null;
        this._target = null;
    }

    public _callBack() {
        if (!this.enable) {
            return;
        }
        if (this.times > 0) {
            --this._times;
            this._nextTime = this.nextTime + this.delay;
        } else if (this.times == -1) {
            this._nextTime = this.nextTime + this.delay;
        } else {
            Log.error("Watcher._CallBack times error:", this.times);
        }
        if (this._func != null) {
            this._func.call(this._target, this._args);
        }
    }

    public toString() {
        let str = `[Watcher] index:${this.index} time: ${this.nextTime} times: ${this.times}`;
        if (this._args == null) {
            str += ` func: ${this._func}`;
        } else {
            str += ` argfunc: ${this._func} ${this._args}`;
        }
        return str;
    }
}