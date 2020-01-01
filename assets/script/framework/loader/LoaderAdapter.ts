import { LoaderManager, LoaderCall } from "./LoaderManager";
import { Log } from "../Log";

declare interface RefMap {
    [key: string]: number;
}

export class LoaderAdapter {
    private _loader: LoaderManager = new LoaderManager();

    public loadAssetAsync(name: string, path: string, type: typeof cc.Asset, callback: LoaderCall, target: any): void {
        this._loader.loadAssetAsync(name, path, type, path, callback, target);
    }

    public unLoadAsset(key: string): void {
        this._loader.unLoadAsset(key);
    }

    public update(dt: number): void {
        this._loader.update(dt);
    }

    private _spriteRefs: RefMap = {};
    public loadSpriteAsync(path: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            this.loadAssetAsync(path, path, cc.SpriteFrame, (name: string, asset: cc.SpriteFrame, assetPath: string) => {
                if (asset != null) {
                    let times = this._spriteRefs[assetPath];
                    if (!times) {
                        times = 0;
                    }
                    ++times;
                    this._spriteRefs[assetPath] = times;
                    resolve(asset);
                } else {
                    reject(null);
                }
            }, null);
        });
    }
    public unLoadSprite(path: string) {
        let times = this._spriteRefs[path];
        if (times == null) {
            Log.error("unLoadSprite Can't find in Refs:" + path);
            return;
        }
        --times;
        if (times > 0) {
            this._spriteRefs[path] = times;
        } else {
            delete this._spriteRefs[path];
            this.unLoadAsset(path);
        }
    }
    
    private _spriteAltasRefs: RefMap = {};
    /**
     * @description
     * @author 吴建奋
     * @date 2020-01-01
     * @param {string} path
     * @returns {Promise<cc.SpriteAtlas>}
     * @memberof LoaderAdapter
     */
    public loadSpriteAltasAsync(path: string): Promise<cc.SpriteAtlas> {
        return new Promise((resolve, reject) => {
            this.loadAssetAsync(path, path, cc.SpriteAtlas, (name: string, asset: cc.SpriteAtlas, assetPath: string) => {
                if (asset != null) {
                    let times = this._spriteAltasRefs[assetPath];
                    if (!times) {
                        times = 0;
                    }
                    ++times;
                    this._spriteAltasRefs[assetPath] = times;
                    resolve(asset);
                } else {
                    reject(null);
                }
            }, null);
        });
    }

    public unLoadSpriteAltas(path: string) {
        let times = this._spriteAltasRefs[path];
        if (times == null) {
            Log.error("unLoadSpriteAltas Can't find in Refs:" + path);
            return;
        }
        --times;
        if (times > 0) {
            this._spriteAltasRefs[path] = times;
        } else {
            delete this._spriteAltasRefs[path];
            this.unLoadAsset(path);
        }
    }

    public setProgressCallback(path: string, callback: (path: string, progress: number) => void, target: any) {
        this._loader.setProgressCallback(path, callback, target);
    }
}