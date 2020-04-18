import { Manager } from "./Manager";


declare interface AtlasMap {
    [key: string]: cc.SpriteAtlas;
}

export class SpriteAtlasManager {
    public constructor() {

    }

    private _spriteatlas: AtlasMap = {};
    public getCityIcon(id: string | number): Promise<cc.SpriteFrame> {
        let this1 = this;
        return new Promise((resolve, reject) => {
            let spriteAtlas = this1._spriteatlas["cityIcon"];
            if (spriteAtlas == null) {
                Manager.loader.loadAssetAsync("cityIcon", "icon/cityIcon", cc.SpriteAtlas, (name: string, resource: cc.SpriteAtlas, asset: string) => {
                    this1._spriteatlas["cityIcon"] = resource;
                    resolve(resource.getSpriteFrame("cs_" + id));
                }, this1);
            } else {
                resolve(spriteAtlas.getSpriteFrame("cs_" + id));
            }
        });
    }
    public getCountryIcon(id: string | number): Promise<cc.SpriteFrame> {
        let this1 = this;
        return new Promise((resolve, reject) => {
            let spriteAtlas = this1._spriteatlas["countryIcon"];
            if (spriteAtlas == null) {
                Manager.loader.loadAssetAsync("countryIcon", "icon/countryIcon", cc.SpriteAtlas, (name: string, resource: cc.SpriteAtlas, asset: string) => {
                    this1._spriteatlas["countryIcon"] = resource;
                    resolve(resource.getSpriteFrame("gj_" + id));
                }, this1);
            } else {
                resolve(spriteAtlas.getSpriteFrame("gj_" + id));
            }
        });
    }
    public getDrawIcon(res: string): Promise<cc.SpriteFrame> {
        let this1 = this;
        return new Promise((resolve, reject) => {
            let spriteAtlas = this1._spriteatlas["drawIcon"];
            if (spriteAtlas == null) {
                Manager.loader.loadAssetAsync("drawIcon", "icon/drawIcon", cc.SpriteAtlas, (name: string, resource: cc.SpriteAtlas, asset: string) => {
                    this1._spriteatlas["drawIcon"] = resource;
                    resolve(resource.getSpriteFrame(res));
                }, this1);
            } else {
                resolve(spriteAtlas.getSpriteFrame(res));
            }
        });
    }

    public getMenu(spName: string): Promise<cc.SpriteFrame> {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this._getSpriteFrame("taskview", "ui/activity/taskview", spName).then(resolve).catch(reject);
        });
    }
    public getTaskView(spName: string): Promise<cc.SpriteFrame> {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this._getSpriteFrame("taskview", "ui/activity/taskview", spName).then(resolve).catch(reject);
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
