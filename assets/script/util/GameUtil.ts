import { Log } from "../framework/Log";

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
}