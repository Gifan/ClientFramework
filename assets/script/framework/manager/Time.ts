import { Notifier } from "../notify/Notifier";
import { NotifyID } from "../notify/NotifyID";

class _Time {
    private _time: number = 0;

    public get time(): number {
        return this._time;
    }

    private _deltaTime: number = 0;
    //上一帧的时间
    public get deltaTime(): number {
        return this._deltaTime;
    }

    private _frameCount: number = 0;
    //游戏经过的帧数
    public get frameCount(): number {
        return this._frameCount;
    }

    private _clientTimeMs: number = 0;
    //客户端时间，毫秒
    public get clientTimeMs(): number {
        return Date.now();
    }

    private _serverTimeMs: number = 0;
    private _serverInitMs: number = 0;
    private _serverUpdateMs: number = 0;
    //服务器时间，毫秒
    public get serverTimeMs(): number {
        this._serverTimeMs = this._serverInitMs + Date.now() - this._serverUpdateMs;
        return this._serverTimeMs;
    }

    public setServerTime(timeMs: number) {
        this._serverTimeMs = timeMs;
        this._serverInitMs = timeMs;
        this._serverUpdateMs = Date.now();
    }

    private _clientDate: Date = new Date();
    //客户端日期
    public get clientDate(): Date {
        return this._clientDate;
    }

    public update(dt: number) {
        this._frameCount += 1;
        this._deltaTime = dt;
        if (this._scaling) {
            dt *= this.scale;
        }
        this._time += dt;
        this.updateScale(dt);
        if (Notifier.isExist(NotifyID.Game_Update)) {
            Notifier.send(NotifyID.Game_Update, dt);
        }
    }

    private _scaling = false;
    private _scale = 1;
    private _scaleDura = 0;
    private _scaleTimeout = 0;
    private _scaleSmooth = true;
    public setScale(scale: number, dura: number, smooth = true) {
        this._scaling = true;
        this._scale = scale;
        this._scaleDura = dura;
        this._scaleTimeout = this._time + dura;
        this._scaleSmooth = smooth;

        cc.director.getScheduler().setTimeScale(scale);
        Notifier.send(NotifyID.Time_Scale, scale);
    }

    public get scale() {
        return cc.director.getScheduler().getTimeScale();
    }

    public get isScaling(): boolean {
        return this._scaling;
    }

    private updateScale(dt: number) {
        if (!this._scaling) {
            return;
        }
        if (this._time > this._scaleTimeout) {
            this._scaling = false;
            cc.director.getScheduler().setTimeScale(1);
            Notifier.send(NotifyID.Time_Scale, 1);
            return;
        }

        if (this._scaleSmooth) {
            let scale = cc.misc.lerp(this._scale, 1, 1 - (this._scaleTimeout - this._time) / this._scaleDura);
            cc.director.getScheduler().setTimeScale(scale);
            Notifier.send(NotifyID.Time_Scale, scale);
        }
    }
}

export const Time = new _Time();