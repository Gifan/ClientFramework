export default class Util {
    static nameCutter(name: string, limit: number): string {
        if (!name) return;
        if (limit < 1) limit = 1;
        limit *= 2;
        let length = 0;
        for (let i = 0; i < name.length; i++) {
            length += name.charCodeAt(i) < 128 ? 1 : 2;
            if (length >= limit) return name.slice(0, i + 1) + "...";
        }
        return name;
    }

    static padLeft(value: string | number, digits: number, char: string | number): string {
        value = value + "";
        char = char + "";
        let need = digits - value.length;
        if (need <= 0) return value;
        let ss = "";
        for (let i = 0; i < need; i++) ss += char;
        return ss + value;
    }

    static addThousandSeparatorI(num: number | string) {
        num = num + "";
        let offset = num.length % 3, isNegative = num[0] === "-", ss = [isNegative ? "-" + num[1] : num[0]];
        for (let i = isNegative ? 2 : 1; i < num.length; i++)
            (i - offset) % 3 === 0 && ss.push(","), ss.push(num[i]);
        return ss.join("");
    }

    static getHumanDateS(date?: Date): string {
        date = date || new Date();
        return date.getFullYear()
            + "-" + Util.padLeft(date.getMonth() + 1, 2, 0)
            + "-" + Util.padLeft(date.getDate(), 2, 0);
    }

    static getHumanDate(date?: Date): number {
        date = date || new Date();
        return (date.getFullYear() % 100) * 10000
            + (date.getMonth() + 1 * 100)
            + date.getDate();
    }

    static objToPath(obj: PathObj): string {
        if (!obj) return;
        let ss = [];
        for (const key in obj) {
            const value = obj[key];
            ss.push(encodeURIComponent(key) + "=" + encodeURIComponent(value + ""));
        }
        return ss.join("&");
    }

    static pathToObj(path: string): { [key: string]: string } {
        if (!path) return;
        let o: { [key: string]: string } = {};
        let kvs = path.split(/&/g);
        for (let i = 0; i < kvs.length; i++) {
            let kv = kvs[i].split(/=/g);
            o[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
        return o;
    }

    static compareVersion(s1: string, s2: string): -1 | 0 | 1 {
        let ss1 = s1.split('.');
        let ss2 = s2.split('.');
        let len = Math.max(ss1.length, ss2.length);
        for (var i = 0; i < len; i++) {
            if (ss1[i] === ss2[i]) continue;
            if ((parseInt(ss1[i]) || 0) > (parseInt(ss2[i]) || 0))
                return 1;
            return -1;
        }
        return 0;
    }

    static stringSample(fs: string, tl: number = 4): string {
        let fl = fs && fs.length;
        if (!fl || fl <= tl) return fs;
        let ts = "";
        for (let ti = 0; ti < tl; ti++)
            ts += fs[Math.floor(fl / tl * ti)];
        return ts;
    }

    static numbersSample(fa: Array<number>, tl: number): Array<number> {
        // f:from, t:to, a:array, l:length, i:index, p:proportion, n:number,
        if (!tl || tl <= 0) tl = 1;
        let ta: Array<number> = [], fl = fa && fa.length;
        if (!fl) { for (let i = 0; i < tl; i++) ta.push(1); return ta; }
        let p = fl / tl, n: number, fi: number, va: number;
        for (let ti = 0; ti < tl; ti++) {
            n = ti * p; fi = Math.floor(n); va = fa[fi];
            ta.push(va + (fa[fi == fl - 1 ? 0 : fi + 1] - va) * (n - fi));
        }
        return ta;
    }

    static lerp(na: number, nb: number, p: number): number {
        return na + (nb - na) * p;
    }

    static getTimer(countDownSecond: number, onUpdate?: (pcs: number) => void, onEnd?: () => void, fps?: number): Timer {
        return new Timer(countDownSecond, onUpdate, onEnd, fps);
    }

    static getRester(restSecond: number, fn?: Function, caller?: any, onRest?: fw.cb) {
        return new Rester(restSecond, fn, caller, onRest);
    }

    static layout(p: number, cs: number[], x?: number): number[] {
        // p:parent, c:child, l:length, s:space
        let csL = 0; for (let i = 0; i < cs.length; i++) csL += cs[i];
        let allS = p - csL;
        let csS = allS * (x || 0.8);
        let pS = allS - csS;
        let scale = (csS + csL) / csL;
        let offset = (p - pS) * 0.5;
        let add = 0;
        let rsl = new Array(cs.length);
        for (let i = 0; i < cs.length; i++) {
            let l = scale * cs[i];
            rsl[i] = offset - (add + l * 0.5);
            add += l;
        }
        return rsl;
    }

    static loginTime(days?: number): boolean {
        if (!days) days = 1;
        let lastLoginTime = cc.sys.localStorage.getItem("lastLoginTime");
        let nowTime = new Date().toLocaleDateString();
        cc.sys.localStorage.setItem("lastLoginTime", nowTime);
        console.log("上次登录时间",lastLoginTime)
        console.log("本次登录时间",nowTime);
        if (!lastLoginTime) {
            console.log("没登录过")
            return true;
        } else {           
            let start = new Date(lastLoginTime).getTime() / 86400000;
            let end = new Date(nowTime).getTime() / 86400000;
            let time = 0;
            if (start > end) {
                time = start - end;
            } else {
                time = end - start;
            }
            console.log("两次登录时间",start,end)
            console.log("距离上次登录",Math.floor(time))
            return Math.floor(time) >= days;
        }
    }
}

/** 可快速配置的时间线, 详细说明见例子 */
export class FakeTimeLine {
    /**
     * 构建时间线
     * @param sampless 配置表合集, 顺序:[月,周,日,时,分,秒], 单位:[[1-12月],[周日-周六],[1-31日],[0-23时],[0-60分],[0-60秒]]
     * @param max 基于小时配置的上限值
     * @param min 基于小时配置的下限值
     * @example
     * let monthSamples = null; // 月配置表, 不想配置的表, 可以留空.
     * let weekSamples = [1.3, 1.1, 1, 0.9, 0.8, 1.2, 1.5]; // 周配置表, 以周日为起点, 月/周/日均为倍率表, 以1为基准浮动, 下限不能超过0, 上限理论上无限制, 通常建议2以内.
     * let daySamples = [1, 1.1, 1.3, 1, 0.9, 1, 1.6, 1.1]; // 日配置表, 一共31天, 当配置数据不需要太多细节, 可以模糊的配上适量波动, 会进行采样.
     * let hourSamples = [0.5, 0.3, 0, 0.2, 0.6, 0.8, 0.9, 1, 0.8, 0.6]; // 小时配置表, 数值区间约束在[0,1]以内, 作为时间线表现力的主要担当, 其他数据都在此数据上做增减量, 建议丰富细节(填写12个以上的数值).
     * let secondSamples = [90, 0, -60, 30, 240]; // 秒配置表, 分/秒均为增量表, 以0为基准浮动, 没有上下限, 将会加到最终数值上, 通常用作随机数的意义.
     * 
     * let sampless = [monthSamples, weekSamples, daySamples, hourSamples, [], secondSamples]; // 6个配置表的合集, 需要按顺序放置, 不声明的部分也需要留取空白.
     * 
     * let ftl1 = new FakeTimeLine(sampless, 5800, 1200); // max/min值用于直接约束小时配置, 此处相当于小时配置区间为[1200,5800].
     * let data = ftl1.getCurrent(); // 截取当前时间, 根据配置计算出数值, 算法 : { 小时 * [max~min] * [月*周*日] + [分+秒] }
     * console.log("生成的数据", data);
     * @example
     * // 快速定义
     * let ftl2 = new FakeTimeLine([[], [0.9, 1.1], [1.1, 0.9], [0.5, 1, 0.5, 0]], 5800, 1200);
     * console.log("当前时间的数据", ftl2.getCurrent());
     */
    constructor(sampless: Array<Array<number>>, public max: number, public min: number) {
        let sss: Array<Array<number>> = [];
        let ss: Array<number> = [12, 7, 31, 24, 60, 60];
        for (let i = 0; i < ss.length; i++)
            sss.push(Util.numbersSample(sampless[i], ss[i]));
        this.sampless = sss;
    }
    units: Array<number> = [];
    sampless: Array<Array<number>>

    getCurrent() {
        let d = new Date();
        let a: Array<number> = [];
        //a.push(d.getFullYear());
        a.push(d.getMonth());
        a.push(d.getDay());
        a.push(d.getDate());
        a.push(d.getHours());
        a.push(d.getMinutes());
        a.push(d.getSeconds());
        //a.push(d.getMilliseconds());
        return this.getValue(a);
    }

    getValue([m, w, d, h, mn, s]: Array<number>) { // m=[0-11],w=[1234560],d=[1-31],h=[0-23],mn=s=[0-59],ms=[0-999]
        let [m12S, w7S, d30S, h24S, mn60S, s60S] = this.sampless;
        let df = h24S[h], dt = h24S[h == 23 ? 0 : h + 1];
        let v = df + (dt - df) * (mn / 60);
        v = Util.lerp(this.min, this.max, v);
        v *= m12S[m];
        v *= w7S[w];
        v *= d30S[d];
        v += mn60S[mn];
        v += s60S[s];
        return Math.floor(v);
    }

    //#region js
    /*
    let Util = {
        lerp(na, nb, p) {
            return na + (nb - na) * p;
        },
        numbersSample(fa, tl) {
            if (!tl || tl <= 0) tl = 1;
            let ta = [], fl = fa && fa.length;
            if (!fl) { for (let i = 0; i < tl; i++) ta.push(1); return ta; }
            let p = fl / tl, n, fi, va;
            for (let ti = 0; ti < tl; ti++) {
                n = ti * p; fi = Math.floor(n); va = fa[fi];
                ta.push(va + (fa[fi == fl - 1 ? 0 : fi + 1] - va) * (n - fi));
            }
            return ta;
        }
    }
    class FakeTimeLine {
        constructor(sampless, max, min) {
            let sss = [];
            let ss = [12, 7, 30, 24, 60, 60];
            for (let i = 0; i < ss.length; i++)
                sss.push(Util.numbersSample(sampless[i], ss[i]));
            this.sampless = sss;
            this.max = max;
            this.min = min;
            console.log("sss", sss);
        }
        getCurrent() {
            let d = new Date();
            let a = [];
            a.push(d.getMonth());
            a.push(d.getDay());
            a.push(d.getDate());
            a.push(d.getHours());
            a.push(d.getMinutes());
            a.push(d.getSeconds());
            console.log("a", a);
            return this.getValue(a);
        }
    
        getValue([m, w, d, h, mn, s]) {
            let [m12S, w7S, d30S, h24S, mn60S, s60S] = this.sampless;
            let df = h24S[h], dt = h24S[h == 23 ? 0 : h + 1];
            let v = df + (dt - df) * (mn / 60);
            console.log("ds", m12S[m], w7S[w], d30S[d], mn60S[mn], s60S[s]);
            console.log("vh", v);
            v *= m12S[m];
            v *= w7S[w];
            v *= d30S[d];
            console.log("vbl", v);
            v = Util.lerp(this.max, this.min, v);
            console.log("val", v);
            v += mn60S[mn];
            v += s60S[s];
            console.log("vlast", v);
            return Math.floor(v);
        }
    }
    let sss = [[], [1.42, 1.21, 1.14, 0.93, 0.88, 1.24, 1.68], [0.9, 1.05, 1.2, 0.95]
    , [0.258, 0.131, 0.059, 0.008, 0.000, 0.013, 0.059, 0.161, 0.263, 0.403, 0.555, 0.657, 0.733, 0.729, 0.669, 0.674, 0.682, 0.712, 0.729, 0.831, 0.970, 1.000, 0.852, 0.492]
    , [2313, 1541, 1231, -234, 4032, 324, 1045], [312, 412, -23, 123, -105, 32, 257, 90]
    ];
    
    let ftl = new FakeTimeLine(sss, 51094, 305981);
     */
    //#endregion

}

/** 简单独立的计时器 */
export class Timer {
    constructor(
        countDownSecond: number,
        private onUpdate?: (pcs: number) => void,
        private onEnd?: () => void,
        fps?: number
    ) {
        if (!countDownSecond || countDownSecond < 0) return;
        let stepms = fps ? 1000 / fps : 16;
        this._cdms = countDownSecond * 1000;
        this._startms = Date.now();
        this._timer = setInterval(() => this._countDown(), stepms);
    }

    stop() { this._isEnd || clearInterval(this._timer); this._isStop = true; }

    dispose() {
        console.log("清空计时器")
        clearInterval(this._timer);
        this.onUpdate = this.onEnd = null;
    }

    public get isEnd() { return this._isEnd; }
    public get isStop() { return this._isStop; }
    public get usems() { return this._usems; }

    private _isEnd: boolean;
    private _isStop: boolean;
    private _usems: number;
    private _cdms: number;
    private _startms: number;
    private _timer: number;

    private _countDown() {
        this._usems = Date.now() - this._startms;
        if (this._usems > this._cdms) {
            this._isEnd = true;
            this._isStop = true;
            clearInterval(this._timer);
            this.onEnd && this.onEnd();
            return;
        }
        this.onUpdate && this.onUpdate(this._usems / this._cdms);
    }
}

/** 简单独立的延时器 */
export class Rester {
    protected lastTime: number;
    restTime: number;
    protected next: number;
    constructor(restSecond: number, protected fn?: Function, protected caller?: any, protected onRest?: fw.cb) { this.restTime = restSecond * 1000; }
    doWith(fn: Function, caller?: any, args?: any | any[]) {
        if (Date.now() < this.next) return this.onRest && this.onRest();
        this.next = Date.now() + this.restTime;
        //if (Date.now() - this.lastTime < this.restTime) return this.onRest && this.onRest();
        //this.lastTime = Date.now();
        return fn.apply(caller, args);
    }
    do(args?: any | any[]) {
        if (Date.now() < this.next) return this.onRest && this.onRest();
        this.next = Date.now() + this.restTime;
        //if (Date.now() - this.lastTime < this.restTime) return this.onRest && this.onRest();
        //this.lastTime = Date.now();
        return this.fn.apply(this.caller, args);
    }
}