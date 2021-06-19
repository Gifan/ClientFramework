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
    public static setListener(node: cc.Node, callback: (target: any) => void, target: any) {
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
            return gold + "";//GameUtil.splitThousands(gold);
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
    // public static fixBg(node: cc.Node) {
    //     // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
    //     let scaleForShowAll = Math.min(
    //         cc.view.getCanvasSize().width / node.width,
    //         cc.view.getCanvasSize().height / node.height
    //     );
    //     let realWidth = node.width * scaleForShowAll;
    //     let realHeight = node.height * scaleForShowAll;

    //     // 2. 基于第一步的数据，再做缩放适配
    //     node.scale = Math.max(
    //         cc.view.getCanvasSize().width / realWidth,
    //         cc.view.getCanvasSize().height / realHeight
    //     );
    // }

    // public static splitRewardInArray(reward: number, arraylen: number): number[] {
    //     let rewardlist;
    //     let left: number = 0;
    //     if (reward < arraylen) {
    //         rewardlist = new Array(arraylen).fill(0);
    //         left = reward;
    //         for (let i = 0; i < reward; i++) {
    //             rewardlist[i] += 1;
    //         }
    //     } else {
    //         let num = Math.floor(reward / arraylen);
    //         rewardlist = new Array(arraylen).fill(num);
    //         left = reward - arraylen * num;
    //         for (let i = 0; i < arraylen; i++) {
    //             if (left <= 0) break;
    //             let random = GameUtil.random(1, left + 1);
    //             rewardlist[i] += random;
    //             left -= random;
    //         }
    //     }

    //     return rewardlist;
    // }

    /**
     * 洗牌
     * @param start 
     * @param end 
     */
    public static getRandomListDiffArray(start: number, end: number) {
        let list = [];
        for (let i = 0, len = end - start + 1; i < len; i++) {
            list.push(i + start);
        }
        let randomindex = 0;
        for (let i = end - start; i > 0; i--) {
            randomindex = GameUtil.random(0, i);
            [list[randomindex], list[i]] = [list[i], list[randomindex]];
        }
        return list;
    }

    public static getComponent<T extends cc.Component>(node: cc.Node, comp: { new(): T }): T {
        let com = node.getComponent(comp);
        if (!com) {
            com = node.addComponent(comp);
        }
        return com;
    }

    public static prefixZero(num, n) {
        return (Array(n).join("0") + num).slice(-n);
    }

    public static createHandler(node: cc.Node, funName: string, funTargetName: string) {
        let handler = new cc.Component.EventHandler();
        handler.handler = funName;
        handler.target = node;
        handler.component = funTargetName;
        return handler;
    }
    /**
     * @desc 从给定整数范围内生成n个不重复的随机数 n不能超过给定范围
     * @param {Number} min 
     * @param {Number} max 
     */
    public static getRandomSDiff(min, max, n) {
        if (max - min + 1 <= n) {
            let list = [];
            for (let i = min; i <= max; i++) {
                list.push(i)
            }
            return list;
        }
        let originalArray = new Array();
        let len = max - min + 1;
        for (let i = 0; i < len; i++) {
            originalArray[i] = min + i;
        }
        let randomArray = new Array();
        for (let i = 0; i < n; i++) {
            let t = this.random(0, len - 1 - i)
            randomArray[i] = originalArray[t];
            var temp = originalArray[len - 1 - i];
            originalArray[len - 1 - i] = originalArray[t];
            originalArray[t] = temp;
        }
        return randomArray;
    }

    /**
     * 等比例限制在对应区域内
     * @param width 原宽度
     * @param height 原高度
     * @param boundWidth 绑定宽度
     * @param boundHeight 绑定高度
     */
    public static fixToBoundSize(width, height, boundWidth, boundHeight): cc.Size {
        let size: cc.Size = new cc.Size(width, height);
        let minwidth = Math.min(width, boundWidth);
        let minheight = Math.min(height, boundHeight);
        let width1 = minwidth;
        let height1 = minwidth / width * height;
        let width2 = minheight / height * width;
        let height2 = minheight;
        let a = width1 / height1 > width2 / height2;
        if (height1 > minheight) {
            size.width = width2;
            size.height = height2;
        } else {
            size.width = width1;
            size.height = height1;
        }
        return size;
    }

    /**
     * 版本号比较
     */
    public static compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }

    public static cocosToWx(node: cc.Node | cc.Vec2) {
        let worldPos: cc.Vec2 = cc.Vec2.ZERO;
        if (node instanceof cc.Node) {
            let pos = node.parent.convertToWorldSpaceAR(node.position);
            worldPos.x = pos.x; worldPos.y = pos.y;
        } else {
            worldPos.x = node.x; worldPos.y = node.y;
        }
        let designsize = GameUtil.getRealDesignSize();
        worldPos.y = designsize.height - worldPos.y;//翻转
        console.log("designSize = ", worldPos.x, worldPos.y);
        //@ts-ignore
        let info = wx.getSystemInfoSync();
        let canvaswidth = info.screenWidth;
        let canvasheight = info.screenHeight;
        let newpos = cc.v2(canvaswidth / designsize.width * worldPos.x, canvasheight / designsize.height * worldPos.y);
        console.log("new pos = ", newpos.x, newpos.y);
        return newpos;
    }

    public static getRealDesignSize() {
        let srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / Const.designWidth,
            cc.view.getCanvasSize().height / Const.designHeight
        );
        let realWidth1 = Const.designWidth * srcScaleForShowAll;
        let realHeight1 = Const.designHeight * srcScaleForShowAll;
        let widthratio = cc.view.getCanvasSize().width / realWidth1;
        let heightratio = cc.view.getCanvasSize().height / realHeight1;
        let width = Const.designWidth * widthratio;
        let height = Const.designHeight * heightratio;
        return { height: height, width: width, radioHeight: heightratio, radioWidth: widthratio };
    }
}