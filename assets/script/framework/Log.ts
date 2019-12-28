class _GameLog {
    private _log: any;
    private _enableLog: boolean;
    public constructor() {
        this._log = console;
        this._enableLog = true;
    }

    public setLogEnable(boo: boolean) {
        this._enableLog = boo;
    }

    public log(msg: string | any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.log("[Log]:" + msg, ...subst);
    }

    public debug(msg: string | any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.debug("[Debug]:" + msg, ...subst);
    }

    public warn(msg: string | any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.warn("[Warn]:" + msg, ...subst);
    }

    public error(msg: string | any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.error("[Error]:" + msg, ...subst);
    }
}

export const GameLog = new _GameLog();