import ResKeeper from "./ResKeeper";
import { ResUtil } from "./ResUtil";
import { Log } from "../Log";

/**
 * 资源加载类
 * 1. 加载完成后自动记录引用关系，根据DependKeys记录反向依赖
 * 2. 支持资源使用，如某打开的UI使用了A资源，其他地方释放资源B，资源B引用了资源A，如果没有其他引用资源A的资源，会触发资源A的释放，
 * 3. 能够安全释放依赖资源（一个资源同时被多个资源引用，只有当其他资源都释放时，该资源才会被释放）
 */

// 资源加载的处理回调
export type ProcessCallback = (completedCount: number, totalCount: number, item: any) => void;
// 资源加载的完成回调
export type CompletedCallback = (error: Error, resource: any) => void;
export type CompletedArrayCallback = (error: Error, resource: any[], urls?: string[]) => void;

// 引用和使用的结构体
export interface CacheInfo {
    refs: Set<string>,
    uses: Set<string>,
    useId?: number,
}

// LoadRes方法的参数结构
export class LoadResArgs {
    url?: string;
    urls?: string[];
    type?: typeof cc.Asset;
    onCompleted?: (CompletedCallback | CompletedArrayCallback);
    onProgess?: ProcessCallback;
    bundle?: cc.AssetManager.Bundle;
    use?: string;
}

// ReleaseRes方法的参数结构
export interface ReleaseResArgs {
    url?: string,
    urls?: string[],
    type?: typeof cc.Asset,
    use?: string,
}

// 兼容性处理
let isChildClassOf = cc.js["isChildClassOf"]
if (!isChildClassOf) {
    isChildClassOf = cc["isChildClassOf"];
}

export default class AssetLoader {
    public constructor() {
        // 1. 构造当前场景依赖
    }

    /**
     * loadRes方法的参数预处理
     */
    public static makeLoadResArgs(): LoadResArgs {
        if (arguments.length < 1) {
            Log.error(`_makeLoadResArgs error ${arguments}`);
            return null;
        }

        if (arguments.length == 1 && (arguments[0] instanceof LoadResArgs)) {
            return arguments[0];
        }

        let ret: LoadResArgs = {};

        if (typeof arguments[0] == "string") {
            ret.url = arguments[0];
        } else if (arguments[0] instanceof Array) {
            ret.urls = arguments[0];
        } else {
            Log.error(`_makeLoadResArgs error ${arguments}`);
            return null;
        }

        for (let i = 1; i < arguments.length; ++i) {
            if (i == 1 && isChildClassOf(arguments[i], cc.Asset)) {
                // 判断是不是第一个参数type
                ret.type = arguments[i];
            } else if (i == arguments.length - 1 && arguments[i] instanceof cc.AssetManager.Bundle) {
                // 判断是不是最后一个参数bundle
                ret.bundle = arguments[i];
            } else if (typeof arguments[i] == "function") {
                // 其他情况为函数
                if (arguments.length > i + 1 && typeof arguments[i + 1] == "function") {
                    ret.onProgess = arguments[i];
                } else {
                    ret.onCompleted = arguments[i];
                }
            }
        }
        if (!ret.bundle) {
            ret.bundle = cc.resources;
        }
        return ret;
    }

    /**
     * 完成一个Item的加载
     * @param url 
     * @param assetType 
     * @param use 
     */
    private _finishItem(url: string, assetType: typeof cc.Asset, use?: string, stack?: string) {

    }

    /**
     * 开始加载资源
     * @param url           资源url
     * @param type          资源类型，默认为null
     * @param onProgess     加载进度回调
     * @param onCompleted   加载完成回调
     * @param use           资源使用key，根据makeUseKey方法生成
     */
    public loadRes(resArgs: LoadResArgs)
    public loadRes(url: string, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        let stack: string;
        let finishCallback = (error: Error, resource: any) => {
            if (!error) {
                this._finishItem(resArgs.url, resArgs.type, resArgs.use, stack);
            }
            if (resArgs.onCompleted) {
                resArgs.onCompleted(error, resource);
            }
        };

        // 预判是否资源已加载
        let res = resArgs.bundle.get(resArgs.url, resArgs.type);
        if (res) {
            finishCallback(null, res);
        } else {
            resArgs.bundle.load(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
        }
    }

    /**
     * 开始加载资源
     * @param url           资源url
     * @param type          资源类型，默认为null
     * @param onProgess     加载进度回调
     * @param onCompleted   加载完成回调
     * @param use           资源使用key，根据makeUseKey方法生成
     */
    public preloadRes(resArgs: LoadResArgs)
    public preloadRes(url: string, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        let stack: string;
        let finishCallback = (error: Error, resource: any) => {
            if (!error) {
                this._finishItem(resArgs.url, resArgs.type, resArgs.use, stack);
            }
            if (resArgs.onCompleted) {
                resArgs.onCompleted(error, resource);
            }
        };

        // 预判是否资源已加载
        let res = resArgs.bundle.get(resArgs.url, resArgs.type);
        if (res) {
            finishCallback(null, res);
        } else {
            resArgs.bundle.preload(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
        }
    }

    public loadArray(urls: string[], bundle?: cc.AssetManager.Bundle);
    public loadArray(urls: string[], onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadArray(urls: string[], onProgess: ProcessCallback, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadArray(urls: string[], type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public loadArray(urls: string[], type: typeof cc.Asset, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadArray(urls: string[], type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadArray() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        let stack: string;
        let finishCallback = (error: Error, resource: any[], urls?: string[]) => {
            if (!error) {
                for (let i = 0; i < resArgs.urls.length; ++i) {
                    this._finishItem(resArgs.urls[i], resArgs.type, resArgs.use, stack);
                }
            }
            if (resArgs.onCompleted) {
                resArgs.onCompleted(error, resource);
            }
        }
        resArgs.bundle.load(resArgs.urls, resArgs.type, resArgs.onProgess, finishCallback);
    }

    public loadResDir(url: string, bundle?: cc.AssetManager.Bundle);
    public loadResDir(url: string, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadResDir(url: string, onProgess: ProcessCallback, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadResDir(url: string, type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public loadResDir(url: string, type: typeof cc.Asset, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadResDir(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedArrayCallback, bundle?: cc.AssetManager.Bundle);
    public loadResDir() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        let stack: string;
        let finishCallback = (error: Error, resource: any[]) => {
            let infos = resArgs.bundle.getDirWithPath(resArgs.url, resArgs.type);
            if (!error && infos) {
                infos.map((info) => {
                    this._finishItem(info.path, resArgs.type, resArgs.use, stack);
                })
            }
            if (resArgs.onCompleted) {
                resArgs.onCompleted(error, resource);
            }
        }
        resArgs.bundle.loadDir(resArgs.url, resArgs.type, resArgs.onProgess, finishCallback);
    }

    /**
     * 直接通过asset释放资源（如cc.Prefab、cc.SpriteFrame）
     * @param asset 要释放的asset
     */
    public releaseAsset(asset: cc.Asset) {
        if (asset) {
            cc.assetManager.releaseAsset(asset);
        }
    }
    private _resKeeper:ResKeeper = null;
    public getResKeeper(){
        if(!this._resKeeper) this._resKeeper = new ResKeeper();
        return this._resKeeper;
    }
}

export const assetLoader = new AssetLoader();

