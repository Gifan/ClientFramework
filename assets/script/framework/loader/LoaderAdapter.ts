import { LoaderManager, LoaderCall } from "./LoaderManager";

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

    // private _spriteRefs: RefMap = {};

    public loadSpriteAsync(path: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            this.loadAssetAsync(path, path, cc.SpriteFrame, (name: string, asset: cc.SpriteFrame, assetPath: string) => {
                if (asset != null) {
                    resolve(asset);
                } else {
                    reject(null);
                }
            }, null);
        });
    }
    public unLoadSprite(path: string) {
        this.unLoadAsset(path);
    }

    // private _spriteAltasRefs: RefMap = {};
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
                    resolve(asset);
                } else {
                    reject(null);
                }
            }, null);
        });
    }

    public unLoadSpriteAltas(path: string) {
        this.unLoadAsset(path);
    }

    public setProgressCallback(path: string, callback: (path: string, progress: number) => void, target: any) {
        this._loader.setProgressCallback(path, callback, target);
    }

}