let isLog = false;
/** 自动绑定
 * @ $xxx_sp  => cc.Sprite
 * @ $xxx_lbl => cc.Label
 * @ $xxx_eb  => cc.EditBox
 * @ $xxx_sld => cc.Slider
 * @ $xxx_pb  => cc.ProgressBar
 * @ $xxx_sv  => cc.ScrollView
 * @ $xxx_pv  => cc.PageView
 * @ $xxx_lo  => cc.Layout
 * @ $xxx_wg  => cc.Widget
 * @ $xxx_tgl => cc.Toggle
 * @ $xxx_btn => cc.Button
 * @ $xxx_ps  => cc.ParticleSystem
 * @ $xxx_rt  => cc.RichText
 * @ $xxx_db  => dragonBones.ArmatureDisplay
 * @example
 ** // 场景节点树
 ** let sampleSecneNodeTree = {
 **     name: "rootNode",
 **     components: [AutobindUser],
 **     children: [
 **         {
 **             name: "$sample1",
 **             components: []
 **         },
 **         {
 **             name: "$sample2",
 **             components: [cc.Label, cc.Button]
 **         },
 **         {
 **             name: "$sample3",
 **             components: [cc.Widget, cc.Layout]
 **         },
 **     ],
 ** }
 ** 
 ** class AutobindUser extends cc.Component {
 **     start() { let ab = new Autobind(this); }
 ** 
 **     // $属性必须初始化赋值为 null
 **     $sample1: cc.Node = null; // $sample1 属性 匹配 $sample1 节点
 **     $$sample1_te() { cc.log("sample1 tap"); } // $$sample1_te 属性 匹配 $sample1 属性 对应节点
 ** 
 **     $sample2: cc.Node = null; // $sample2 属性 匹配 $sample2 节点
 **     $sample2_lbl: cc.Sprite = null; // $sample2_lbl 属性 匹配 $sample2 节点 cc.Label 控件
 **     $sample2_btn: cc.Label = null; // $sample2_btn 属性 匹配 $sample2 节点 cc.Button 控件
 **     $$sample2_lbl_te() { cc.log("sample2 tap"); } // $$sample2_lbl_te 属性 匹配 $sample2_lbl 属性 对应节点
 ** 
 **     $$sample3_te() { cc.log("sample3 tap"); } // $$sample3_te 属性 匹配 $sample3 属性 对应节点 (自动匹配 $sample3 节点)
 ** }
 */
export class Autobind {
    static showLog(showLog: boolean) { isLog = showLog; }
    static quick(cpm: CpmLike, customSign?: string) { new Autobind(cpm, customSign); }
    public autoBindDict: BindDict;
    constructor(
        protected cpm: CpmLike,
        protected customSign?: string
    ) { this._checkAutoBind(cpm); }

    protected _checkAutoBind(cpm: CpmLike) {
        let abPpts: AbDict = Object.create(null);
        let tempDict: AbDict = Object.create(null);
        for (const pptName in cpm) {
            if (pptName[0] !== '$') continue;
            isLog && console.log("[Autobind] check $", pptName);
            let ppt = cpm[pptName];
            if (!ppt) {
                this._sliceName(pptName, abPpts);
                continue;
            }
            if (typeof ppt !== "function") continue;
            let doubleSlice = this._sliceName(pptName, tempDict, ppt);
            if (doubleSlice) this._sliceName(doubleSlice, abPpts);
        }
        isLog && console.log("[Autobind] on auto bind check end", abPpts, tempDict);
        if (Object.getOwnPropertyNames(abPpts).length) {
            this._abSceneNode_Recursive(cpm, abPpts, cpm.node);
            for (const key in abPpts) if (!abPpts[key])
                console.warn("[Autobind] can not find node or component in scene named " + key + " at auto bind prototype.");
        }
        for (const key in tempDict) {
            const ab = tempDict[key];
            this._autoBindByType(ab.bindType, ab.content, ab.fn);
        }
    }

    protected _sliceName(name: string, dict: AbDict, fn?: Function) {
        let index = name.lastIndexOf('_') + 1;
        let bindType, content;
        if (fn) {
            if (!index) return;
            bindType = name.substring(index, name.length);
            content = name.substring(1, index - 1);
            dict[name] = { bindType, content, fn, name };
            isLog && console.log("[Autobind] add fn ppt", name);
            if (name[1] === '$')
                return content;//.substring(1, content.length);
        }
        else {
            if (dict[name]) return;
            bindType = index ? name.substring(index, name.length) : "n";
            content = name.substring(0, index - 1);
            if (!this.customSign)
                return dict[content] = dict[name] = { bindType, content, name };

            let cContent = this.customSign + content.substring(1, content.length);
            let cName = this.customSign + name.substring(1, name.length);
            dict[cContent] = dict[cName] = { bindType, content, name };
            isLog && console.log("[Autobind] add ab ppt", name);
        }
    }

    protected _abSceneNode_Recursive(cpm: CpmLike, abPpts: AbDict, node: cc.Node) {
        if (!node) return;
        let ab = abPpts[node.name];
        if (ab) {
            isLog && console.log("[Autobind] ab ppt hit " + node.name);
            switch (ab.bindType) {
                case "n": cpm[ab.name] = node; break;
                case "sp": cpm[ab.name] = node.getComponent(cc.Sprite); break;
                case "lbl": cpm[ab.name] = node.getComponent(cc.Label); break;
                case "eb": cpm[ab.name] = node.getComponent(cc.EditBox); break;
                case "sld": cpm[ab.name] = node.getComponent(cc.Slider); break;
                case "pb": cpm[ab.name] = node.getComponent(cc.ProgressBar); break;
                case "sv": cpm[ab.name] = node.getComponent(cc.ScrollView); break;
                case "pv": cpm[ab.name] = node.getComponent(cc.PageView); break;
                case "lo": cpm[ab.name] = node.getComponent(cc.Layout); break;
                case "wg": cpm[ab.name] = node.getComponent(cc.Widget); break;
                case "tgl": cpm[ab.name] = node.getComponent(cc.Toggle); break;
                case "btn": cpm[ab.name] = node.getComponent(cc.Button); break;
                case "ps": cpm[ab.name] = node.getComponent(cc.ParticleSystem); break;
                case "rt": cpm[ab.name] = node.getComponent(cc.RichText); break;
                case "db": cpm[ab.name] = node.getComponent(dragonBones.ArmatureDisplay); break;
                default: break;
            }
        }
        for (let i = 0; i < node.children.length; i++)
            this._abSceneNode_Recursive(cpm, abPpts, node.children[i]);
    }

    protected _autoBindByType(bindType: string, content: string, fn: Function) {
        switch (bindType) {
            case "ts": return this._autoBindOn(content, fn, cc.Node.EventType.TOUCH_START);
            case "tc": return this._autoBindOn(content, fn, cc.Node.EventType.TOUCH_CANCEL);
            case "tm": return this._autoBindOn(content, fn, cc.Node.EventType.TOUCH_MOVE);
            case "te": return this._autoBindOn(content, fn, cc.Node.EventType.TOUCH_END);
            case "stt": return this._autoBindOn(content, fn, "scroll-to-top");
            case "stb": return this._autoBindOn(content, fn, "scroll-to-bottom");
            case "pt": return this._autoBindOn(content, fn, "page-turning");
        }
        if (!this.autoBindDict)
            this.autoBindDict = Object.create(null);
        let list = this.autoBindDict[bindType];
        if (!list) list = this.autoBindDict[bindType] = [];
        list.push({ content, fn });
    }

    protected _autoBindOn(content: string, fn, onType: string) {
        let ppt = this.cpm[content];
        if (ppt instanceof cc.Node) return ppt.on(onType, fn, this.cpm);
        if (ppt instanceof cc.Component) return ppt.node.on(onType, fn, this.cpm);
        return console.warn("[Autobind] can not find node or component named " + content + " at auto bind function.");
    }
}
interface CpmLike { node: cc.Node }

export type BindDict = { [bindType: string]: Array<BindData> };
export type BindData = { content: string, fn };
type AbDict = { [key: string]: AutoBindObject };
interface AutoBindObject {
    name: string;
    bindType: string;
    content: string;
    fn?: Function;
}