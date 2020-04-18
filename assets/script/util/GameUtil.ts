import { Log } from "../framework/Log";
import { Manager } from "./Manager";
import { Const } from "../config/Const";
import { AlertManager } from "../module/alert/AlertManager";
import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
import { CallID } from "../CallID";
import { EventDefine } from "../config/EventCfg";

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
     * 1: {content: [{word: "高高兴兴", first_letter: "G", pinyin: "gāogāoxìngxìng",…},…], style: [5, 7],…}
        content: [{word: "高高兴兴", first_letter: "G", pinyin: "gāogāoxìngxìng",…},…]
        0: {word: "高高兴兴", first_letter: "G", pinyin: "gāogāoxìngxìng",…}
        1: {word: "漂漂亮亮", first_letter: "P", pinyin: "piàopiàoliangliang", explain: "指外形美观，鲜明。"}
        2: {word: "兴致勃勃", first_letter: "X", pinyin: "xìngzhìbóbó", explain: "兴致：兴趣；勃勃：旺盛的样子。形容兴头很足。"}
        hor_rate: 1
        size: [89, 93]
        style: [5, 7]

        一定有一个竖，横，后面的随机 竖横，方向
        mapArray[][]
        随机 上，下方向进入
        如果 是横
        寻找可以放置的x点list=[x1,x2,...xn]满足 (maxArray[x], maxArray[x+3])+1<=right, 从list随机出x，根据正方向，上下方向push进去
        如果 是竖
        同理 寻找点x list=[x1,x2,xn] 满足 maxArray[x]+4 <= right 从list随机出x，再随机y   插入成语

        特殊情况从底部插入竖列，分隔，由于分隔列上不能存在其他成语字，所以简单点从底部插入分割不会有问题
        不在第一层插入，需要考虑插入层下一层是否有底
     */
    public static getStageMapByCfg(stagecfg: any): Array<Array<string>> {
        let style = stagecfg.style;
        let answerNum = stagecfg.content.length;
        let answerData = stagecfg.content;
        let answerInfo = [];
        let groupMap: Array<Array<string>> = new Array<Array<string>>();
        for (let i = 0, maxx = style[0]; i < maxx; i++) {
            groupMap[i] = new Array<string>();
        }
        for (let i = 0; i < answerNum; i++) {//计算出
            let temprandom = GameUtil.random(0, 100);
            let horRoVec = temprandom % 10 >= 5 ? 0 : 1;//水平或者垂直
            let direct = temprandom / 10 >= 5 ? 0 : 1;//正或者逆向
            let mode = temprandom >= 50 ? 0 : 1;//上插入，下插入
            if (i <= 1) { horRoVec = i }//固定前2个是一个水平一个垂直
            answerInfo.push({ direct, mode, horRoVec, word: answerData[i].word });
        }
        for (let i = 0; i < answerNum; i++) {
            let data = answerInfo[i];
            if (data.horRoVec == 0) {//横向
                let rightPoint = [];//适合的x点
                let end = groupMap.length - 3;
                for (let j = 0; j < end; j++) {
                    if (groupMap[j].length + 1 <= style[1] &&
                        groupMap[j + 1].length + 1 <= style[1] &&
                        groupMap[j + 2].length + 1 <= style[1] &&
                        groupMap[j + 3].length + 1 <= style[1]) {
                        rightPoint.push(j);
                    }
                }

                if (rightPoint.length > 0) {//存在的情况
                    let index = GameUtil.random(0, rightPoint.length);
                    let pointx = rightPoint[index];
                    let wordlist: Array<string> = Array.prototype.slice.call(data.word);
                    if (data.direct == 1) wordlist = wordlist.reverse();
                    if (data.mode == 0) {//直接上插入(push)
                        for (let k = 0; k < 4; k++) {
                            groupMap[pointx + k].push(wordlist[k])
                        }
                    } else {
                        for (let k = 0; k < 4; k++) {
                            groupMap[pointx + k].unshift(wordlist[k]);
                        }
                    }
                } else {//不存在的情况()
                    Log.error("getStageMapByCfg error->>no point in hor");
                }
            } else {//竖向
                let rightPoint = [];//适合的x点
                let end = groupMap.length;
                for (let j = 0; j < end; j++) {
                    if (groupMap[j].length + 4 <= style[1]) {
                        rightPoint.push(j);
                    }
                }
                if (rightPoint.length > 0) {//存在的情况
                    let index = GameUtil.random(0, rightPoint.length);
                    let pointx = rightPoint[index];
                    let pointy = GameUtil.random(0, style[1]);
                    let wordlist: Array<string> = Array.prototype.slice.call(data.word);
                    if (data.direct == 1) wordlist = wordlist.reverse();
                    if (pointy > groupMap[pointx].length - 1) {//直接push
                        groupMap[pointx].push(...wordlist);//不能直接用contact,[].contact无效
                    } else {
                        groupMap[pointx].splice(pointy, 0, ...wordlist);
                    }
                } else {
                    Log.error("getStageMapByCfg error->>no point in vec");
                }
            }
        }
        return groupMap;
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