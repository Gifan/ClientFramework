import { Log } from "../framework/Log";
import { Manager } from "./Manager";

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
    public static setListener(node: cc.Node, callback: (target:any) => void, target: any) {
        if (callback == null || !cc.isValid(node)) {
            Log.error("setListener fail callback is null or node is not valid");
            return;
        }
        node.on("click", callback, target);
    }

    /**
     * 角度转弧度
     * @param angle 角度
     */
    public static AngleToRadinas(angle): number {
        return angle * (Math.PI / 180);
    }

    /**
     * 弧度转角度
     * @param radius 弧度
     */
    public static RadinasToAngle(radius): number {
        return radius * 180 / (Math.PI);
    }

    /**加载资源 */
    public static loadPrefab(path: string): Promise<cc.Node> {
        return new Promise((resolve, reject) => {
            let names = path.split(`/`);
            Manager.loader.loadAssetAsync(names[names.length - 1], path, cc.Prefab, (name: string, asset: object, assetPath: string) => {
                let prefab: cc.Node = asset as cc.Node;
                if (prefab == null) {
                    cc.error(".loadCallback GameObject null:" + name);
                    reject(null);
                }
                else {
                    let node: cc.Node = cc.instantiate<cc.Node>(prefab);
                    resolve(node)
                }
            }, null);
        });
    }
    /**
     * 随机返回[min,max)范围的整数值
     * @param min 最小值
     * @param max 最大值
     */
    public static random(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    }

    /**
     * 金币转成指定格式
     * @param gold 金币数  类型：string 
     * @param pointLength 小数位数，默认是0
     */
    public static changeGoldStr(gold: number, pointLength = 2): string {
        if (gold < 100000) {
            return GameUtil.splitThousands(gold);
        }
        let unit;
        let units = [' ', 'K', 'M', 'B', 'T', 'q', 'Q', 's', 'S', 'O']; //注意第一个字符要填空格，不然while中会判断为false
        while ((unit = units.shift()) && gold >= 1000) { //units.shift()是删除第一个元素并返回
            gold = gold / 1000;
        }

        let newGold: string = "";
        if (unit === ' ') {
            newGold = gold + unit;
        }
        else {
            newGold = gold.toFixed(pointLength === undefined ? 2 : pointLength) + unit; //小数点个数，toFixed 把 Number 四舍五入为指定小数位数的数字
        }
        return newGold;
    }

    /**
      * 数字转转成千元符格式
      * @param num 
      * @param pointLength 小数位数，默认是0
      */
    private static splitThousands(num, pointLength = 0): string {
        if (typeof num !== "number") {
            num = parseFloat(num);
        }
        var reg = /\B(?=(\d{3})+$)/g;
        num = num.toString().split(".");
        pointLength = pointLength == undefined ? 2 : pointLength;

        num[0] = num[0].replace(reg, ",");
        num[1] = num[1] ? num[1].substr(0, pointLength) : "00000000000000000".substr(0, pointLength);

        return pointLength ? num.join(".") : num[0];
    }

    /**
      * 加载骨骼
      * @param path  骨骼素材路径 
      */
    public static loadDragonBones(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, function (err, asset) {
                if (err || asset.length <= 0) {
                    reject(null);
                    return;
                }
                try {
                    let assets = null;
                    let atlasAssets = null;
                    for (let i in asset) {
                        if (asset[i] instanceof dragonBones.DragonBonesAsset) {
                            assets = asset[i];
                        }
                        if (asset[i] instanceof dragonBones.DragonBonesAtlasAsset) {
                            atlasAssets = asset[i];
                        }
                    }
                    resolve({ dragonAsset: assets, dragonAtlasAsset: atlasAssets });
                } catch (error) {
                    reject(null);
                }
            });
        });

    }

    /**
     * 特殊加载人物的骨骼动画
     * @param path 路径
     */
    public static loadRoleDragonBones(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes('roleItemRes/1/1_ske', dragonBones.DragonBonesAsset, (err, res) => {
                if (err) { reject(); return }
                let paths = path.split("/");
                let id = paths[1] || "1";
                cc.loader.loadRes(`${path}/${id}_tex`, dragonBones.DragonBonesAtlasAsset, (errr, ress) => {
                    if (errr) { reject(); return };
                    resolve({ dragonAsset: res, dragonAtlasAsset: ress });
                })
            })
        })
    }

    /**
      * 秒数转成时钟格式
      * @param mSecond 秒数
      * @param showHourFlag 是否显示小时的字段，默认为false
      */
    public static changeSecondToClock(mSecond: number, showHourFlag: boolean = false) {
        let hour: number = parseInt((mSecond / 3600).toString());
        let minute: number = parseInt((mSecond % 3600 / 60).toString());
        let second: number = parseInt((mSecond % 60).toString());
        var str = "";
        if (hour == 0) {
            if (showHourFlag) str += "00";
        }
        else if (hour > 0 && hour < 10) {
            str += "0" + hour;
            str += ":";
        }
        else {
            str += hour;
            str += ":";
        }
        if (minute == 0) {
            str += "00";
        }
        else if (minute > 0 && minute < 10) {
            str += "0" + minute;
        }
        else {
            str += minute;
        }
        str += ":";
        if (second == 0) {
            str += "00";
        }
        else if (second > 0 && second < 10) {
            str += "0" + second;
        }
        else {
            str += second;
        }
        return str;
    }

    /**
     * 节点1的坐标转换为节点2下局部坐标
     * @param node1 节点1
     * @param node2 节点2
     */
    public static convertNodePostionToOther(node1: cc.Node | { parent: cc.Node, position: cc.Vec2 }, node2: cc.Node) {
        if (!node1.parent) return cc.Vec2.ZERO;
        let vec = node1.parent.convertToWorldSpaceAR(node1.position);
        let pos = node2.convertToNodeSpaceAR(vec);
        return pos;
    }

    /**
     * 适配全屏背景节点（不拉伸）
     * @param node 背景节点
     */
    public static fixBg(node: cc.Node) {
        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        let scaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / node.width,
            cc.view.getCanvasSize().height / node.height
        );
        let realWidth = node.width * scaleForShowAll;
        let realHeight = node.height * scaleForShowAll;

        // 2. 基于第一步的数据，再做缩放适配
        node.scale = Math.max(
            cc.view.getCanvasSize().width / realWidth,
            cc.view.getCanvasSize().height / realHeight
        );
    }

    public static splitRewardInArray(reward: number, arraylen: number): number[] {
        let rewardlist;
        let left: number = 0;
        if (reward < arraylen) {
            rewardlist = new Array(arraylen).fill(0);
            left = reward;
            for (let i = 0; i < reward; i++) {
                rewardlist[i] += 1;
            }
        } else {
            let num = Math.floor(reward / arraylen);
            rewardlist = new Array(arraylen).fill(num);
            left = reward - arraylen * num;
            for (let i = 0; i < arraylen; i++) {
                if (left <= 0) break;
                let random = GameUtil.random(1, left + 1);
                rewardlist[i] += random;
                left -= random;
            }
        }

        return rewardlist;
    }
}