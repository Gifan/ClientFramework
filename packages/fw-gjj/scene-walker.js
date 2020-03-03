module.exports = {
    'log-auto-bind-list': function (e) {
        e.reply && e.reply(logAutoBindList());
    },
    'active-all-node-awhile': function (e) {
        activeAllNodeAwhile();
    },
};

function logAutoBindList() {
    let o = { s: "" };
    getAbNode_Recursive(o, cc.director.getScene());
    o.s = o.s ? "[本场景自动绑定清单]\n    //#region [AutoBind]\n    \n" + o.s + "    \n    //#endregion [AutoBind]"
        : "未找到可以自动绑定的节点";
    return o.s;
}


function getAbNode_Recursive(o, node) {
    if (!node) return;
    let name = node.name;
    if (name && name[0] === '$') {
        let index = name.lastIndexOf('_') + 1;
        let bindType = index ? name.substring(index, name.length) : "n";
        let content = index ? name.substring(index - 4, index - 1) : name.substring(name.length - 3, name.length);
        let type;
        switch (bindType) {
            case "n": type = "cc.Node"; break;
            case "sp": type = "cc.Sprite"; break;
            case "lbl": type = "cc.Label"; break;
            case "eb": type = "cc.EditBox"; break;
            case "sld": type = "cc.Slider"; break;
            case "pb": type = "cc.ProgressBar"; break;
            case "sv": type = "cc.ScrollView"; break;
            case "pv": type = "cc.PageView"; break;
            case "lo": type = "cc.Layout"; break;
            case "wg": type = "cc.Widget"; break;
            case "tgl": type = "cc.Toggle"; break;
            case "btn": type = "cc.Button"; break;
            case "ps": type = "cc.ParticleSystem"; break;
            case "rt": type = "cc.RichText"; break;
            case "db": type = "dragonBones.ArmatureDisplay"; break;
            default: break;
        }
        o.s += "    " + node.name + ": " + type + " = null;\n";
        if (content === "Btn")
            o.s += "    $" + node.name + "_te() { cc.log('on " + node.name + " tap'); }\n    \n";
    }
    for (let i = 0; i < node.children.length; i++)
        getAbNode_Recursive(o, node.children[i]);
}

function activeAllNodeAwhile() {
    let activeDict = {};
    getNode_Recursive(cc.director.getScene(), n => {
        if (!n._parent) return;
        //Editor.log("[" + n.uuid + "]" + n.active + ":" + n.name);
        activeDict[n.uuid] = n.active;
        n.active = true;
    });
    Editor.log("已激活全部节点, 0.5秒后恢复, 请勿操作");
    setTimeout(() => {
        getNode_Recursive(cc.director.getScene(), n => {
            let active = activeDict[n.uuid];
            if (typeof active === "undefined") return;
            n.active = active;
        });
        Editor.log("已恢复全部节点");
    }, 500);
}

function getNode_Recursive(node, onNode) {
    if (!node) return;
    onNode(node);
    for (let i = 0; i < node.children.length; i++)
        getNode_Recursive(node.children[i], onNode);
}

//#region [NodeLike]

/*

interface Node extends NodeLike {
    gizmo: object;
    active: boolean;
    activeInHierarchy: boolean;
    // _hasListenerCache: null; // private, error to read
}

interface Scene extends NodeLike {
    _super: null;
    autoReleaseAssets: undefined;
    _inited: boolean;
    dependAssets: null;
    _instantiate: null;
    _hasListenerCache: null;

    // overwrite
    _parent: null;
    _prefab: null;
}

interface NodeLike {
    _name: string;
    _objFlags: number;
    _parent: object;
    _children: object;
    _tag: number;
    _active: boolean;
    _components: object;
    _prefab: object;
    _id: string;
    _opacity: number;
    _color: object;
    _cascadeOpacityEnabled: boolean;
    _anchorPoint: object;
    _contentSize: object;
    _rotationX: number;
    _rotationY: number;
    _scaleX: number;
    _scaleY: number;
    _position: object;
    _skewX: number;
    _skewY: number;
    _localZOrder: number;
    _globalZOrder: number;
    _opacityModifyRGB: boolean;
    groupIndex: number;
    _capturingListeners: object;
    _bubblingListeners: object;
    _activeInHierarchy: boolean;
    __instanceId: number;
    __eventTargets: object;
    _sgNode: object;
    _sizeProvider: object;
    _reorderChildDirty: boolean;
    _widget: object;
    _touchListener: object;
    _mouseListener: object;
    group: string;
    x: number;
    y: number;
    rotation: number;
    rotationX: number;
    rotationY: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    opacity: number;
    cascadeOpacity: boolean;
    color: object;
    anchorX: number;
    anchorY: number;
    width: number;
    height: number;
    zIndex: number;
    _persistNode: boolean;
    name: string;
    uuid: string;
    children: object;
    childrenCount: number;
    _serialize: null;
    _deserialize: null;
}

*/

//#endregion [NodeLike]
