'use strict';

const Fs = require('fire-fs');
const Path = require('fire-path');
let _altasPaths;

const packageName = "createnodescript";

function mkdirs(dirpath) {
    if (!Fs.existsSync(Path.dirname(dirpath))) {
        mkdirs(Path.dirname(dirpath));
    }
    if (!Fs.existsSync(dirpath)) {
        Fs.mkdirSync(dirpath);
    }
}

var s_subSpace = "";
var m_fields = []; //string[];
var m_imports = []; //string[];
var m_subGenIndex = 0;
var m_subGens = []; //cc.Node[];

var propertyBuilder = "";
var initFuncBuilder = "";
var freeFuncBuilder = "";
var importBuilder = "";

var useExtend = true;
var exportPath = "script/module/";

/// <summary>
/// 自定义的常用结构体
/// </summary>
var s_CustomTypes = {
    Cell: "Cell",
    Button: "ButtonCell",
    Toggle: "ToggleCell",
    Slider: "SliderCell",
    Scroll: "ScrollViewCell",
    Page: "PageViewCell",
    Bar: "BarCell",

    "cc.Button": "ButtonCell",
    "cc.Toggle": "ToggleCell",
    "cc.Slider": "SliderCell",
    "cc.ScrollView": "ScrollViewCell",
    "cc.PageView": "PageViewCell",
    "cc.ProgressBar": "BarCell",
}

function GetType(node) {
    let typeName;
    if (node.getComponent(cc.Toggle)) {
        typeName = "cc.Toggle";
    } else if (node.getComponent(cc.Button)) {
        typeName = "cc.Button";
    } else if (node.getComponent(cc.ToggleContainer)) {
        typeName = "cc.ToggleContainer";
    } else if (node.getComponent(cc.Slider)) {
        typeName = "cc.Slider";
    } else if (node.getComponent(cc.ProgressBar)) {
        typeName = "cc.ProgressBar";
    } else if (node.getComponent(cc.Scrollbar)) {
        typeName = "cc.Scrollbar";
    } else if (node.getComponent(cc.ScrollView)) {
        typeName = "cc.ScrollView";
    } else if (node.getComponent(cc.PageView)) {
        typeName = "cc.PageView";
    } else if (node.getComponent(cc.EditBox)) {
        typeName = "cc.EditBox";
    } else if (node.getComponent(cc.Sprite)) {
        typeName = "cc.Sprite";
    } else if (node.getComponent(cc.Label)) {
        typeName = "cc.Label";
    } else if (node.getComponent(cc.RichText)) {
        typeName = "cc.RichText";
    } else if (node.getComponent(cc.Layout)) {
        typeName = "cc.Layout";
    } else if (node.getComponent(cc.Canvas)) {
        typeName = "cc.Canvas";
    } else if (node.getComponent(cc.Graphics)) {
        typeName = "cc.Graphics";
    } else {
        typeName = "cc.Node";
    }
    return typeName;
}

class NodeInfo {
    constructor(node) {
        this.node = node;
        this.fieldName = "";
        this.fieldPath = "";
        this.fieldNameLower = "";
        this.typeName = "";
        //是否作为单独的类
        this.isCell = false;
        //是否跳过子节点
        this.isSkip = false;
        //是否数组
        this.isArray = false
        this.Analysiss(node);
    }

    Analysiss(node) {
        this.fieldName = node.name;
        this.fieldNameLower = this.fieldName.toLowerCase();
        this.fieldPath = this.fieldName;
        this.typeName = GetType(node);
        // if (this.fieldName.indexOf('=') != -1) {
        //     let names = this.fieldName.split('=');
        //     this.fieldName = names[0];
        //     if(names[1] && names[1] == "Array"){
        //         this.isArray = true;
        //     }
        // }
        // let customType = null;
        // if (this.fieldName.indexOf('=') != -1) {
        //     let names = this.fieldName.split('=');
        //     this.fieldName = names[0];
        //     for (let i = 0; i < names.length; i++) {
        //         const key = names[i];
        //         if (key == "Array") {
        //             this.isArray = true;

        //             names[i] = null;
        //         } else if (key == "Sub") {
        //             //Sub是特别的标示，表示该类型生成一个新的AbsCell对象
        //             this.isCell = true;
        //             this.isSkip = true;
        //             this.typeName = this.fieldName;

        //             if (m_imports.indexOf(this.typeName) == -1) {
        //                 m_imports.push(this.typeName);
        //                 importBuilder += `import { @TypeName } from "./@TypeName"\n`.replace(/@TypeName/g, this.typeName);
        //             }
        //             m_subGens.push(node);
        //             names[i] = null;
        //         } else {
        //             customType = s_CustomTypes[key];
        //             if (customType == null) {
        //                 customType = s_CustomTypes[this.typeName];
        //             }
        //             if (useExtend && customType != null) {
        //                 this.isCell = true;
        //                 this.typeName = customType;

        //                 if (m_imports.indexOf(this.typeName) == -1) {
        //                     m_imports.push(this.typeName);
        //                     importBuilder += TemplateImport.replace(/@TypeName/g, this.typeName);
        //                 }

        //                 names[i] = null;
        //             }
        //         }
        //     }
        //     for (let i = 1; i < names.length; i++) {
        //         const key = names[i];
        //         if (key != null) {
        //             Editor.error("CustomType Error UI Name:" + this.fieldName + " -> " + key);
        //         }
        //     }
        // } else {
        //     customType = s_CustomTypes[this.typeName];
        //     if (useExtend && customType != null) {
        //         this.isCell = true;
        //         this.typeName = customType;

        //         if (m_imports.indexOf(this.typeName) == -1) {
        //             m_imports.push(this.typeName);
        //             importBuilder += TemplateImport.replace(/@TypeName/g, this.typeName);                    
        //         }
        //     }
        // }
    }
}

var TemplateClass = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateClass.txt', 'utf8')) + "";
var TemplateProperty = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateProperty.txt', 'utf8')) + "";
var TemplateInitFuncBody = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitFuncBody.txt', 'utf8')) + "";
var TemplateInitFuncBodyList = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitFuncBodyList.txt', 'utf8')) + "";
var TemplateInitNodeBody = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitNodeBody.txt', 'utf8')) + "";
var TemplateInitNodeBodyList = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitNodeBodyList.txt', 'utf8')) + "";
var TemplateFreeFunc = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateFreeFunc.txt', 'utf8')) + "";
var TemplateInitCellBody = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitCellBody.txt', 'utf8')) + "";
var TemplateInitCellBodyList = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateInitCellBodyList.txt', 'utf8')) + "";
var TemplateFreeCell = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateFreeCell.txt', 'utf8')) + "";
var TemplateFreeCellList = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateFreeCellList.txt', 'utf8')) + "";
var TemplateImport = Fs.readFileSync(Editor.url('packages://' + packageName + '/utils/TemplateImport.txt', 'utf8')) + "";

function Generate(uiRoot) {
    m_subGenIndex = 0;
    m_subGens = [];
    s_subSpace = "";
    StartGenerate(uiRoot);
}

function StartGenerate(uiRoot) {
    let spaceName = s_subSpace;
    let fileName = uiRoot.name;
    fileName = fileName.split('=')[0] + "UI";
    Editor.log("StartGenerate UI:" + uiRoot.name + " File:" + fileName);

    m_fields = [];
    m_imports = [];
    propertyBuilder = "";
    initFuncBuilder = "";
    freeFuncBuilder = "";
    importBuilder = "";

    let typeName = GetType(uiRoot);

    for (let index = 0; index < uiRoot.children.length; index++) {
        const child = uiRoot.children[index];
        DoGenerate("node", child);
    }

    let template = TemplateClass.replace(/@ClassName/g, fileName)
        .replace(/@Property/g, propertyBuilder)
        .replace(/@InitFuncBody/g, initFuncBuilder)
        .replace(/@FreeFuncBody/g, freeFuncBuilder)
        .replace(/@Import/g, importBuilder);

    //Debug.Log("template:" + template);

    let folderPath = "/assets/script/module/uiGen/";
    mkdirs(Editor.Project.path + folderPath);

    //Editor.log("assetdb", Editor.assetdb)

    let filePath = Path.join(Editor.Project.path + folderPath, fileName + ".ts");
    Fs.writeFileSync(filePath, template);
    Editor.log("UICodeGenerate:" + filePath);
    // if (m_subGenIndex < m_subGens.length) {
    //     ++m_subGenIndex;
    //     StartGenerate(m_subGens[m_subGenIndex - 1]);
    // }
    //Editor.log("refreshPath", dbPath);

    // let dbPath = "db:/" + folderPath + fileName + ".ts";
    // Editor.Ipc.sendToMain(
    //     'asset-db:refresh',
    //     dbPath,
    //     function(err, results) {
    //         Editor.log("UICodeGenerate refresh:" + dbPath);
    //     }
    // )
}

//忽略不需要的UI节点，提高初始化速度
function IgnorTransform(node) {
    let name = node.name;
    if (name[0] == "_") {
        return true;
    }

    if (name.indexOf(" ") != -1) {
        Editor.error("Error UI Name:" + name);
        return true;
    }

    if (m_fields.indexOf(name) != -1) {
        //已经存在
        return true;
    }

    return false;
}

function DoGenerate(parentName, node) {
    if (IgnorTransform(node)) {
        return;
    }

    let info = new NodeInfo(node);
    if (info.isArray) {
        let property = TemplateProperty.replace(/@TypeName/g, info.typeName + "[]")
            .replace(/@FieldName/g, info.fieldName + "s")
            .replace(/@XformName/g, info.fieldPath);
        propertyBuilder += property;

        if (info.isCell) {
            let initFunc = TemplateInitCellBodyList.replace(/@TypeName/g, info.typeName)
                .replace(/@FieldName/g, info.fieldName)
                .replace(/@ParentName/g, parentName)
                .replace(/@XformName/g, info.fieldPath);
            initFuncBuilder += initFunc;

            let freeFunc = TemplateFreeCellList.replace(/@FieldName/g, info.fieldName + "s");
            freeFuncBuilder += (freeFunc);
        } else {
            let initFunc;
            if (info.typeName != "cc.Node") {
                initFunc = TemplateInitFuncBodyList.replace(/@TypeName/g, info.typeName)
                    .replace(/@FieldName/g, info.fieldName)
                    .replace(/@ParentName/g, parentName)
                    .replace(/@XformName/g, info.fieldPath);
            } else {
                initFunc = TemplateInitNodeBodyList.replace(/@TypeName/g, info.typeName)
                    .replace(/@FieldName/g, info.fieldName)
                    .replace(/@ParentName/g, parentName)
                    .replace(/@XformName/g, info.fieldPath);
            }
            initFuncBuilder += (initFunc);

            let freeFunc = TemplateFreeFunc.replace(/@FieldName/g, info.fieldName + "s");
            freeFuncBuilder += (freeFunc);
        }
    } else {
        let property = TemplateProperty.replace(/@TypeName/g, info.typeName)
            .replace(/@FieldName/g, info.fieldName)
            .replace(/@XformName/g, info.fieldPath);
        propertyBuilder += (property);

        if (info.isCell) {
            let initFunc = TemplateInitCellBody.replace(/@TypeName/g, info.typeName)
                .replace(/@FieldName/g, info.fieldName)
                .replace(/@ParentName/g, parentName)
                .replace(/@XformName/g, info.fieldPath);
            initFuncBuilder += (initFunc);

            let freeFunc = TemplateFreeCell.replace(/@FieldName/g, info.fieldName);
            freeFuncBuilder += (freeFunc);
        } else {
            let initFunc;
            if (info.typeName != "cc.Node") {
                initFunc = TemplateInitFuncBody.replace(/@TypeName/g, info.typeName)
                    .replace(/@FieldName/g, info.fieldName)
                    .replace(/@ParentName/g, parentName)
                    .replace(/@XformName/g, info.fieldPath);
            } else {
                initFunc = TemplateInitNodeBody.replace(/@TypeName/g, info.typeName)
                    .replace(/@FieldName/g, info.fieldName)
                    .replace(/@ParentName/g, parentName)
                    .replace(/@XformName/g, info.fieldPath);
            }
            initFuncBuilder += (initFunc);

            let freeFunc = TemplateFreeFunc.replace(/@FieldName/g, info.fieldName);
            freeFuncBuilder += (freeFunc);
        }
    }

    m_fields.push(node.name);
    if (info.isSkip) {
        return;
    }

    // if (info.typeName == "cc.ScrollView" || info.typeName == "ScrollViewCell") {
    //     let scroll = node.getComponent(cc.ScrollView);
    //     for (let index = 0; index < scroll.content.children.length; index++) {
    //         const child = scroll.content.children[index];
    //         DoGenerate("this." + info.fieldName + ".content", child);
    //     }
    //     for (let index = 0; index < node.children.length; index++) {
    //         const child = node.children[index];
    //         if (child.name == "view" || child == scroll.content) {
    //             continue;
    //         }
    //         DoGenerate(info.fieldName + "Xform", child);
    //     }
    // } else if (info.typeName == "cc.PageView" || info.typeName == "PageViewCell") {
    //     let page = node.getComponent(cc.PageView);
    //     for (let index = 0; index < page.content.children.length; index++) {
    //         const child = page.content.children[index];
    //         DoGenerate("this." + info.fieldName + ".content", child);
    //     }
    //     for (let index = 0; index < node.children.length; index++) {
    //         const child = node.children[index];
    //         if (child.name == "view" || child == page.content) {
    //             continue;
    //         }
    //         DoGenerate(info.fieldName + "Xform", child);
    //     }
    // } else {
    for (let index = 0; index < node.children.length; index++) {
        const child = node.children[index];
        DoGenerate(info.fieldName + "Xform", child);
    }
    // }
}
function refreshPath(path) {
    let dbPath = "db://assets/script/module/uiGen";
    //Editor.log("refreshPath", dbPath);
    Editor.remote.assetdb.refresh(dbPath);
    // Editor.Ipc.sendToMain(
    //   'asset-db:refresh',
    //   dbPath,
    //   function(err, results) {
    //     Editor.log("Generate refresh", dbPath);
    //   }
    // )
}

let message = {};

message['create'] = function (event, paths) {
    let modulepath = paths.moudule;

    let text = modulepath.replace("db://assets/resources/", "").replace(".prefab", "")
    Editor.log('预制体路径', text);
    cc.loader.loadRes(text, function (err, prefab) {
        var node = cc.instantiate(prefab);
        Generate(node);
        event.reply(null, 'create successful');
        refreshPath();
    });
    if (!event.reply) {
        return;
    }

};

module.exports = message;