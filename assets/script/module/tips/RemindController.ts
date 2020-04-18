
import { ListenID } from "../../ListenID";
import { Notifier } from "../../framework/notify/Notifier";
import { Manager } from "../../util/Manager";
import { Log } from "../../framework/Log";

//--------------------------------
let remindResName = "hongdian";
let visibleField = "active";
let flushInterval = 1200;//ms
let getSpriteFunc = Manager.spAtlas.getMenu.bind(Manager.spAtlas);
let Node = cc.Node;
let Label = cc.Label;
let NodePool = cc.NodePool;
let createRemind = (): any => { return; };
let createLblRemind = (): any => { return; };
let getLabel = () => { };
let setText = (label: any, str: string) => { };
let getOneFromPool = (type: string): any => { };
let putNodeInPool = (type: string, node: any) => { };
let findChild = (name: string, node: Node) => { };
let setParent = (parent: cc.Node, node: Node) => { };
let font;
let loadFont = (label: any) => { };

let remindPool = new NodePool();
let lblPool = new NodePool();
let poolType = {
    img: `img_remind`,
    lbl: `lbl_remind`
}
if (window["cc"]) {
    createRemind = () => {
        let node = new Node("redPoint");
        node.scale = 0.7;
        // node.width = node.width + 100;
        // node.height = node.height + 100;
        let sp = node.getComponent(cc.Sprite);
        if (!sp) {
            sp = node.addComponent(cc.Sprite);
            getSpriteFunc(remindResName).then((spFrame) => {
                sp.spriteFrame = spFrame;
            }).catch(() => {
                console.log("***** RemindController: 红点没有找到红点资源 *****", remindResName);
            });
        }
        return sp;
    }
    createLblRemind = () => {
        let node = new Node();
        let lbl = node.getComponent(cc.Label);
        if (!lbl) {
            lbl = node.addComponent(cc.Label);
        }
        return lbl
    }
    getOneFromPool = (type: string): any => {
        let widget = null;
        let pool = null;
        let createFun = null;
        switch (type) {
            case poolType.img: {
                pool = remindPool;
                createFun = createRemind;
                break;
            }
            case poolType.lbl: {
                pool = lblPool;
                createFun = createLblRemind;
                break;
            }
        }
        if (pool) {
            if (pool.size() > 0) {
                if (type == poolType.img)
                    widget = pool.get().getComponent(cc.Sprite);
                if (type == poolType.lbl)
                    widget = pool.get().getComponent(cc.Label);
            } else {
                widget = createFun();
            }
        }
        return widget;
    }
    putNodeInPool = (type: string, node: any) => {
        switch (type) {
            case poolType.img: {
                remindPool.put(node);
                break;
            }
            case poolType.lbl: {
                lblPool.put(node);
                break;
            }
        }
    }
    getLabel = () => {
        return (new Node()).addComponent(cc.Label);
    }
    setText = (label: any, str: string) => {
        label.string = str;
    }
    findChild = (name: string, node: any) => {
        return node && node.getChildByName(name);
    }
    setParent = (parent: cc.Node, node: any) => {
        node.parent = parent;
    }
    loadFont = (label: cc.Label) => {
        if (!font) {
            // cc.loader.loadRes("font/number", (err, res) => {
            //     font = res;
            //     label.font = font;

            //     // console.log("***** load font *****", err , res);
            // });
        } else {
            // label.font = font;
        }
    }
}
//---------------------------------
export interface RemindData {
    name: string,
    node: cc.Node,
    type?: number,                      //红点类型，默认为有数字，1为没数字的感叹号
    checkFunc: () => number | any,
    scale?: number,
    offsetX?: number,
    offsetY?: number,
    hideNum?: boolean
}

/**
 * 红点模块
 */
export default class RemindController {
    private static _instance: RemindController = null;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new RemindController();
        }
        return this._instance;
    }

    private static _timerFuncID: number = null;

    private _remindList: { [key: string]: any } = {};
    constructor() {
        RemindController._instance = this;

        this._initNodePool();
        this._activeUpdateTimer();
    }

    private _initNodePool() {
        for (let i = 0; i < 3; ++i) {
            putNodeInPool(`img_remind`, createRemind().node);
        }

        for (let i = 0; i < 3; ++i) {
            putNodeInPool(`lbl_remind`, createLblRemind().node);
        }
    }

    private _activeUpdateTimer() {
        Notifier.addListener(ListenID.Rigister_Remind, this._rigisterRemind, this);
        let timerID: any = RemindController._timerFuncID;
        timerID && clearInterval(timerID);
        timerID = setInterval(this._updateAllRemind.bind(this), flushInterval);
    }

    //checkFunc的返回值大于0则显示红点
    private _rigisterRemind(data: RemindData) {
        let name = data.name;
        let node = data.node;
        let hideNum = data.hideNum;
        let checkFunc = data.checkFunc;
        let type = data.type;
        if (!node || !checkFunc) {
            console.log("***** RemindController: 缺少node或checkFunc *****");
            return;
        }
        // console.log("***** 创建提示点 *****", name, node, checkFunc);
        let create = () => {
            this._remindList[name] = {};
            this._remindList[name].node = node;
            this._remindList[name].checkFunc = checkFunc;
            let img = getOneFromPool(poolType.img);
            this._remindList[name].remind = img;
            this._remindList[name].hideNum = hideNum;
            this._remindList[name].type = type;
            this._remindList[name].spName = "icon_xhd";
            // console.log("***** img:  *****", img);
            setParent(node, img.node);
            img.node.x = node.width / 2;
            img.node.y = node.height / 2 - 15;
            img.node.scale = data.scale ? data.scale : img.node.scale;
            img.node.x = data.offsetX ? img.node.x + data.offsetX : img.node.x;
            img.node.y = data.offsetY ? img.node.y + data.offsetY : img.node.y;


            let lbl = getOneFromPool(poolType.lbl);
            this._remindList[name].label = lbl;
            // console.log("***** label:  *****", lbl);
            setParent(node, lbl.node);
            lbl.node.x = img.node.x + 1;
            lbl.node.y = img.node.y - 4;
            lbl.node.scale = data.scale ? data.scale : lbl.node.scale;
            lbl.fontSize = 24;
            if (data.scale) {
                lbl.node.x = img.node.x;
                lbl.node.y = img.node.y - 2;
            }
            lbl.node.active = true;
            if (data.type == 1) {
                getSpriteFunc(remindResName).then((spFrame) => {
                    img.spriteFrame = spFrame;
                }).catch(() => {
                    console.log("***** RemindController: 红点没有找到红点资源 *****", remindResName);
                });
                lbl.node.active = false;
            }
            this._updateRemind(name);
            loadFont(lbl);
        }
        if (this._remindList[name]) {
            let remind = this._remindList[name].remind;
            let label = this._remindList[name].label;
            if (remind)
                putNodeInPool(poolType.img, remind.node);
            if (label)
                putNodeInPool(poolType.lbl, label.node);
            // this._remindList[name] = undefined;
            delete this._remindList[name];
        }
        create();
    }
    private _updateRemind(name: string) {
        if (!name) return;
        let info = this._remindList[name];
        if (!info) return;
        let node = info.node;
        let cb = info.checkFunc;
        let remind = info.remind;
        let label = info.label;
        let type = info.type;
        if (!node || !cb || !remind || !remind.node) {
            if (remind)
                putNodeInPool(poolType.img, remind.node);
            if (label)
                putNodeInPool(poolType.lbl, label.node);
            delete this._remindList[name];
            return;
        }
        let num = cb();
        if (type == 2) {//动态监测
            let spname = "icon_common_point";
            if (num[0]) {
                spname = "newtips";
                remind.node[visibleField] = true;
                label.node[visibleField] = false;
            }
            else {
                remind.node[visibleField] = num[1] > 0;
                label.node[visibleField] = num[1] > 0 && !this._remindList[name].hideNum;
                if (label) {
                    setText(label, num[1]);
                }
            }
            if (info.spName != spname) {
                getSpriteFunc(spname).then((spFrame) => {
                    remind.spriteFrame = spFrame;
                }).catch(() => {
                    console.log("***** RemindController: 红点没有找到红点资源 *****", spname);
                });
                this._remindList[name].spName = spname;
            }
        } else {
            remind.node[visibleField] = num > 0;
            label.node[visibleField] = num > 0 && !this._remindList[name].hideNum;
            if (label) {
                setText(label, num);
            }
        }
    }

    private _updateAllRemind() {
        for (const name in this._remindList) {
            this._updateRemind(name);
        }
    }
}