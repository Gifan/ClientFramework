import { ILoader } from "./ILoader";
import { GameLog } from "../Log";

declare interface RefMap {
    [key: string]: number;
}
interface CacheInfo {
    refs: Set<string>,
}

export class AssetLoader implements ILoader {

    private static _resMap: Map<string, CacheInfo> = new Map<string, CacheInfo>();
    /**
         * 从cc.loader中获取一个资源的item
         * @param url 查询的url
         * @param type 查询的资源类型
         */
    private static _getResItem(url: string, type: typeof cc.Asset): any {
        let ccloader: any = cc.loader;
        let item = ccloader._cache[url];
        if (!item) {
            let uuid = ccloader._getResUuid(url, type, false);
            if (uuid) {
                let ref = ccloader._getReferenceKey(uuid);
                item = ccloader._cache[ref];
            }
        }
        return item;
    }

    private static _buildDepend(item: any, refKey: string) {
        // 反向关联引用（为所有引用到的资源打上本资源引用到的标记）
        if (item && item.dependKeys && Array.isArray(item.dependKeys)) {
            for (let depKey of item.dependKeys) {
                // 记录该资源被我引用
                this.getCacheInfo(depKey).refs.add(refKey);
                let ccloader: any = cc.loader;
                let depItem = ccloader._cache[depKey]
                this._buildDepend(depItem, refKey);
            }
        }
    }

    /**
     * 获取资源缓存信息
     * @param key 要获取的资源url
     */
    public static getCacheInfo(key: string): CacheInfo {
        if (!this._resMap.has(key)) {
            this._resMap.set(key, {
                refs: new Set<string>(),
            });
        }
        return this._resMap.get(key);
    }

    private static _finishItem(url: string, assetType: typeof cc.Asset) {
        let item = this._getResItem(url, assetType);
        if (item && item.id) {
            this._buildDepend(item, item.id);
        } else {
            GameLog.warn(`addDependKey item error! for ${url}`);
        }

        // 添加自身引用
        if (item) {
            let info = this.getCacheInfo(item.id);
            info.refs.add(item.id);
        }
    }

    protected _assetPath: string;
    protected _assetName: string;
    protected _assetType: typeof cc.Asset;
    public init(assetName: string, assetPath: string, assetType: typeof cc.Asset): void {
        if (this._assetPath != null) {
            GameLog.error("AssetLoader.Init mult times! path old:" + this._assetPath + "\nnew:" + assetPath);
            return;
        }
        this._assetPath = assetPath;
        this._assetName = assetName;
        this._assetType = assetType;
    }

    public loadAsync(): void {
        if (this._isLoaded) return;
        if (this._progress > 0) return;
        this._progress = 0.01;

        cc.loader.loadRes(this._assetPath, this._assetType,
            (completedCount: number, totalCount: number, item: any): void => {
                if (this._progress < 0) return;
                this._progress = completedCount / totalCount;
                if (this._progressCallback) {
                    this._progressCallback.call(this._progressTarget, this._assetPath, this._progress);
                    if (completedCount >= totalCount) {
                        this._progressCallback = null;
                        this._progressTarget = null;
                    }
                }
            }, (error: Error, resource: any): void => {
                this._error = error;
                this._isLoaded = true;
                this._asset = resource;
                if (error) {
                    GameLog.error(`AssetLoader.LoadAsync error:${this._assetPath} ${error}`);
                } else {
                    AssetLoader._finishItem(this._assetPath, this._assetType);
                    if (this._progressCallback != null) {
                        this._progressCallback.call(this._progressTarget, this._assetPath, 1);
                        this._progressCallback = null;
                        this._progressTarget = null;
                    }
                }

            })
    }

    protected _isLoaded: boolean = false;
    public isDone(): boolean {
        return this._isLoaded;
    }

    public unLoad(): void {
        let item = AssetLoader._getResItem(this._assetPath, this._assetType);
        if (!item) {
            GameLog.warn(`releaseRes item is null ${this._assetPath} ${this._assetType}`);
            return;
        }
        AssetLoader._release(item, item.id);
    }

    private static _release(item, itemUrl) {
        if (!item) {
            return;
        }
        let cacheInfo = this.getCacheInfo(item.id);
        // 解除自身对自己的引用
        cacheInfo.refs.delete(itemUrl);
        // 解除引用
        let delDependKey = (item, refKey) => {
            if (item && item.dependKeys && Array.isArray(item.dependKeys)) {
                for (let depKey of item.dependKeys) {
                    let ccloader: any = cc.loader;
                    let depItem = ccloader._cache[depKey]
                    this._release(depItem, refKey);
                }
            }
        }
        delDependKey(item, itemUrl);

        if (cacheInfo.refs.size == 0) {
            if (item.uuid) {
                cc.loader.release(item.uuid);
                GameLog.log("resloader release item by uuid :" + item.id);
            } else {
                cc.loader.release(item.id);
                GameLog.log("resloader release item by url:" + item.id);
            }
            this._resMap.delete(item.id);
        }
    }

    protected _error: Error = null;
    public get error() {
        return this._error;
    }

    private _progressCallback: (name: string, progress: number) => void;
    private _progressTarget: any;
    setProgressCallback(callback: (name: string, progress: number) => void, target: any) {
        if (this._isLoaded) {
            callback.call(target, this._assetPath, 1);
            return;
        }
        this._progressCallback = callback;
        this._progressTarget = target;
    }

    protected _asset: object;
    public get asset(): object {
        return this._asset;
    }

    public get isAlive(): boolean {
        return true;
    }

    protected _progress: number = 0;
    public get progress(): number {
        if (this._isLoaded) {
            return 1;
        }
        return this._progress;
    }


}