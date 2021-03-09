
import AssetLoader, { assetLoader, CompletedCallback, ProcessCallback, LoadResArgs, ReleaseResArgs } from "./AssetLoader";
import { ResUtil } from "./ResUtil";

declare interface RefMap {
    url: string,
    useKey: string
}



class _LoaderAdapter {
    private globalUseId: number = 0;
    /**
     * 开始加载资源
     * @param url           资源url
     * @param type          资源类型，默认为null
     * @param onProgess     加载进度回调
     * @param onCompleted   加载完成回调
     * @param bundle        资源使用的bundle，默认为cc.resource
     */
    public loadRes(url: string, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public loadRes() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        assetLoader.loadRes(resArgs.url, resArgs.type, resArgs.onProgess, resArgs.onCompleted, resArgs.bundle);
    }

    /**
     * 开始加载资源
     * @param url           资源url
     * @param type          资源类型，默认为null
     * @param onProgess     加载进度回调
     * @param onCompleted   加载完成回调
     * @param bundle        资源使用的bundle，默认为cc.resource
     */
    public preloadRes(url: string, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, bundle?: cc.AssetManager.Bundle);
    public preloadRes() {
        let resArgs: LoadResArgs = AssetLoader.makeLoadResArgs.apply(this, arguments);
        assetLoader.preloadRes(resArgs.url, resArgs.type, resArgs.onProgess, resArgs.onCompleted, resArgs.bundle);
    }



    /**
     * 释放特定资源如(cc.Prefab, cc.SpriteFrame)
     * @param assets 要释放的资源
     * @param use 要解除的资源使用key，根据makeUseKey方法生成
     */
    public releaseAsset(assets: any) {
        assetLoader.releaseAsset(assets);
    }

    /**
     * 动态加载spriteFrame
     * 赋值srcAsset，并使其跟随targetNode自动释放
     * @param path 路径
     * @param targetNode 附属节点（用于资源管理）
     */
    public loadSpriteAsync(path: string, targetNode?: cc.Node): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            this.loadRes(path, cc.SpriteFrame, (error: Error, resource: any) => {
                if (!error) {
                    if (targetNode && cc.isValid(targetNode)) {
                        this.setAutoRelease(resource, targetNode, true);
                    }
                    resolve(resource);
                } else {
                    reject(error);
                }
            })
        });
    }

    /**
     * @description 加载图集 带有自动释放功能
     * @author 吴建奋
     * @date 2020-01-01
     * @param {string} path
     * @returns {Promise<cc.SpriteAtlas>}
     * @memberof LoaderAdapter
     */
    public loadSpriteAltasAsync(path: string, targetNode?: cc.Node): Promise<cc.SpriteAtlas> {
        return new Promise((resolve, reject) => {
            this.loadRes(path, (error: Error, resource: any) => {
                if (!error) {
                    if (targetNode && cc.isValid(targetNode)) {
                        this.setAutoRelease(resource, targetNode);
                    }
                    resolve(resource);
                } else {
                    reject(error);
                }
            })
        });
    }

    /**动态加载Prefab资源
     * 自动释放
     */
    public loadPrefab(path: string): Promise<cc.Node> {
        return new Promise((resolve, reject) => {
            this.loadRes(path, cc.Prefab, (error, assets) => {
                if (error) {
                    reject(error)
                } else {
                    let node = this.instantiate(assets);
                    resolve(node);
                }
            });
        });
    }

    public instantiate(prefab: cc.Prefab): cc.Node {
        let node = cc.instantiate(prefab);
        this.setAutoRelease(prefab, node, true);
        return node;
    }

    /**
     * 加载龙骨资源 附带自动释放
     * @param bonesAssetPath 龙骨骨骼资源ske路径
     * @param bonesAltasAssetPath 龙骨贴图资源tex路径
     * @param attachNode 附属节点
     */
    public loadDragonBones(bonesAssetPath: string, bonesAltasAssetPath: string, attachNode?: cc.Node): Promise<{ asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset }> {
        return new Promise((resolve, reject) => {
            this.loadRes(bonesAssetPath, dragonBones.DragonBonesAsset, (err, res) => {
                if (err) {
                    reject();
                    return
                } else {
                    let assetRes = res;
                    if (attachNode && cc.isValid(attachNode)) {
                        this.setAutoRelease(res, attachNode, true);
                        this.loadRes(bonesAltasAssetPath, dragonBones.DragonBonesAtlasAsset, (err2, res2) => {
                            if (err2) {
                                reject();
                            } else {
                                this.setAutoRelease(res2, attachNode, true);
                                resolve({ asset: assetRes, atlasAsset: res2 });
                            }
                        });
                    }
                }
            });
        })
    }

    /**
    * 根据路径加载骨骼
    * @param path   路径
    * @param mNode  骨骼载体Node
    * @param playAnimationFlag 是否播放
    */
    public loadDragonBonesByPath(path: string, mNode: cc.Node, playAnimationFlag: boolean, callFunc) {
        var dragonDisplay = mNode.getComponent(dragonBones.ArmatureDisplay);
        if (!dragonDisplay) return;

        let that = this;
        assetLoader.loadResDir(path, function (err, asset) {
            if (err || asset.length <= 0) {
                return;
            }
            dragonDisplay.dragonAsset = null;
            dragonDisplay.dragonAtlasAsset = null;
            for (var i in asset) {
                if (asset[i] instanceof dragonBones.DragonBonesAsset) {
                    dragonDisplay.dragonAsset = asset[i];
                    that.setAutoRelease(asset[i], mNode, true);
                }
                if (asset[i] instanceof dragonBones.DragonBonesAtlasAsset) {
                    dragonDisplay.dragonAtlasAsset = asset[i];
                    that.setAutoRelease(asset[i], mNode, true);
                }
            }

            dragonDisplay.armatureName = "Armature";
            if (playAnimationFlag) {
                dragonDisplay.playAnimation(dragonDisplay.getAnimationNames(dragonDisplay.getArmatureNames()[0])[0], -1); //播放第一个动画名称
                dragonDisplay.timeScale = 1;
            }

            if (callFunc) {
                callFunc();
            }
        });
    }

    /**
     * 设置资源跟随节点onDestroy释放未被其它引用的资源
     * @param srcAsset 资源
     * @param targetNode 依赖的目标node
     * @param autoCreate 是否自动创建资源依赖
     */
    public setAutoRelease(srcAsset: cc.Asset, targetNode: cc.Node, autoCreate?: boolean): any {
        let keeper = ResUtil.getResKeeper(targetNode, autoCreate);
        if (srcAsset && keeper) {
            keeper.autoReleaseRes({ asset: srcAsset });
            return srcAsset;
        }
        return null;
    }

    public makeUseKey(): string {
        return `@useKey_${this.globalUseId++}`;
    }
}

export const LoaderAdapter = new _LoaderAdapter();