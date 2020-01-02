import { Log } from "../framework/Log";

export class GameUtil {
    public static setListener(node: cc.Node, callback: () => void, target: any) {
        if (callback == null || !cc.isValid(node)) {
            Log.error("setListener fail callback is null or node is not valid");
            return;
        }
        node.on("click", callback, target);
    }
}