import { Manager } from "./Manager";


declare interface AtlasMap {
    [key: string]: cc.SpriteAtlas;
}

export class SpriteAtlasManager {
    public constructor() {

    }

    private _spriteatlas: AtlasMap = {};


    public getMenu(spName: string): Promise<cc.SpriteFrame> {
        let _this = this;
        return new Promise((resolve, reject) => {
            reject();
            // _this._getSpriteFrame("taskview", "ui/activity/taskview", spName).then(resolve).catch(reject);
        });
    }


    /** 
     * @author wjf
     * @description 图集中获取精灵帧,如果图集没被加载，则加载图集再获取
     */
    private async _getSpriteFrame(atlasName: string, atlasPath: string, spFrameName: string): Promise<cc.SpriteFrame> {
        let _this = this;
        return new Promise((resolve, reject) => {
            let atlas = _this._spriteatlas[atlasName];
            if (atlas) {
                resolve(atlas.getSpriteFrame(spFrameName));
            } else {
                Manager.loader.loadAssetAsync(atlasName, atlasPath, cc.SpriteAtlas, (name: string, resource: cc.SpriteAtlas, asset: string) => {
                    _this._spriteatlas[atlasName] = resource;
                    resolve(resource.getSpriteFrame(spFrameName))
                }, _this);
            }
        })
    }
}
