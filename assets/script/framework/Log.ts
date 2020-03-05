class _Log {
    private _log: any;
    private _enableLog: boolean;
    public constructor() {
        this._log = console;
        this._enableLog = true;
    }

    public setLogEnable(boo: boolean) {
        this._enableLog = boo;
    }
    public log(msg: any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.log("[Log]:" + JSON.stringify(msg), ...subst);
    }

    public debug(msg: any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.debug("[Debug]:" + JSON.stringify(msg), ...subst);
    }

    public warn(msg: any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.warn("[Warn]:" + JSON.stringify(msg), ...subst);
    }

    public error(msg: any, ...subst: any[]): void {
        if (!this._enableLog) return;
        this._log.error("[Error]:" + JSON.stringify(msg), ...subst);
    }
}

export const Log = new _Log();