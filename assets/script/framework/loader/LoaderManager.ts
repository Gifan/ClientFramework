import { Session, LoaderCallback } from "./Session";
import { Log } from "../Log";
import { AssetLoader } from "./AssetLoader";

export type LoaderCall = LoaderCallback;
declare interface SessionMap {
    [key: string]: Session;
}

export class LoaderManager {
    private _sessions: SessionMap = {};
    private _loadQueue: Session[] = [];
    public loadAssetAsync(name: string, path: string, type: typeof cc.Asset, key: string, callback: LoaderCallback, target: any): void {
        let session = this._sessions[key];
        if (session = null) {
            session = new Session();
            session.name = name;
            session.path = path;
            session.type = type;
            session.loader = new AssetLoader();
            session.loader.init(name, path, type);
            session.loader.loadAsync();
            this._loadQueue.push(session);
        }
        if (callback != null) {
            if (session.callbacks == null) {
                session.callbacks = [];
            }
            session.callbacks.push(callback);
            if (session.targets == null) {
                session.targets = [];
            }
            session.targets.push(target);
        }
        this._loadQueue.push(session);
    }

    public unLoadAsset(key: string): void {
        let session = this._sessions[key];
        if (session == null) {
            Log.warn("LoaderManager.UnLoad can't find:" + key);
            return;
        }
        if (session.callbacks != null) {
            Log.warn("LoaderManager.UnLoad callbacks != null:" + key);
        }
        session.loader.unLoad();
        delete this._sessions[key];
    }

    public update(dt: number): void {
        for (let index = this._loadQueue.length - 1; index >= 0; index--) {
            const session = this._loadQueue[index];
            if (!session.loader.isDone()) {
                continue;
            }
            let callbacks = session.callbacks;
            let targets = session.targets;
            session.callbacks = null;
            session.targets = null;
            if (callbacks != null) {
                for (let i = 0; i < callbacks.length; i++) {
                    const callback = callbacks[i];
                    const target = targets[i];
                    callback.call(target, session.name, session.loader.asset, session.path);
                }
            }
            this._loadQueue.splice(index, 1);
        }
    }

    public setProgressCallback(key: string, callback: (path: string, progress: number) => void, target: any) {
        let session = this._sessions[key];
        if (session == null) {
            Log.error("AddProgressCallback can't find:", key);
            return;
        }

        session.loader.setProgressCallback(callback, target);
    }
}