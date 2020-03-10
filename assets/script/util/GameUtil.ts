import { Log } from "../framework/Log";
import { MVC } from "../framework/MVC";

export class GameUtil {

    /**
     * @description 设置按钮监听事件
     * @author 吴建奋
     * @date 2020-01-02
     * @static
     * @param {cc.Node} node
     * @param {() => void} callback
     * @param {*} target
     * @returns
     * @memberof GameUtil
     */
    public static setListener(node: cc.Node, callback: () => void, target: any) {
        if (callback == null || !cc.isValid(node)) {
            Log.error("setListener fail callback is null or node is not valid");
            return;
        }
        node.on("click", callback, target);
    }

    /**加载资源 */
    public static loadPrefab(path: string): Promise<cc.Node> {
        return new Promise((resolve, reject) => {
            let names = path.split(`/`);
            MVC.ComponentHandler.loadAssetHandler(names[names.length - 1], path, cc.Prefab, (name: string, assets: object, assetspath: string, args: any) => {
                let prefab: cc.Node = assets as cc.Node;
                if (prefab == null) {
                    cc.error(".loadCallback GameObject null:" + name);
                    reject(null);
                }
                else {
                    let node: cc.Node = cc.instantiate<cc.Node>(prefab);
                    resolve(node)
                }
            }, null, null);
        });
    }
}