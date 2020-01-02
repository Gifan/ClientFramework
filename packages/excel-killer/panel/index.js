let packageName = "excel-killer";
let fs = require('fire-fs');
let path = require('fire-path');
let lzstring = Editor.require('packages://' + packageName + '/panel/lzstring.js');
let CfgUtil = Editor.require('packages://' + packageName + '/core/CfgUtil.js');
let excelItem = Editor.require('packages://' + packageName + '/panel/item/excelItem.js');
let nodeXlsx = Editor.require('packages://' + packageName + '/node_modules/node-xlsx');
let Electron = require('electron');
let uglifyJs = Editor.require('packages://' + packageName + '/node_modules/uglify-js');
let fsExtra = Editor.require('packages://' + packageName + '/node_modules/fs-extra');
let jsonBeautifully = Editor.require('packages://' + packageName + '/node_modules/json-beautifully');
let chokidar = Editor.require('packages://' + packageName + '/node_modules/chokidar');
let extendClass = Editor.require('packages://' + packageName + '/panel/item/extendClass.js');

let TemplateCatalog = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateCatalog.txt', 'utf8')) + "";
let TemplateConstructor = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateConstructor.txt', 'utf8')) + "";
let TemplateImport = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateImport.txt', 'utf8')) + "";
let TemplateProperty = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateProperty.txt', 'utf8')) + "";
let TemplateReader = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateReader.txt', 'utf8')) + "";
let TemplateImportJs = fs.readFileSync(Editor.url('packages://' + packageName + '/panel/item/TemplateImportJs.txt', 'utf8')) + "";

const Globby = require('globby');

let dirClientName = "client";
let dirServerName = "server";

Editor.Panel.extend({
    style: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.css', 'utf8')) + "",
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/panel/index.html', 'utf8')) + "",


    $: {
        logTextArea: '#logTextArea',
    },

    ready() {
        let logCtrl = this.$logTextArea;
        let logListScrollToBottom = function () {
            setTimeout(function () {
                logCtrl.scrollTop = logCtrl.scrollHeight;
            }, 10);
        };


        excelItem.init();
        this.plugin = new window.Vue({
            el: this.shadowRoot,
            created() {
                this._initPluginCfg();
            },
            init() {
            },
            data: {
                logView: "",
                excelRootPath: null,

                isMergeJson: false,
                isMergeJavaScript: false,
                isExportJson: false,// 是否导出Json
                isExportJs: false,// 是否导出Js
                isExportTs: false,// 是否导出Ts
                isFormatJson: false,// 是否格式化Json
                isCompressJson: false,//是否压缩json为文本
                isExportClient: false,// 是否导出客户端
                isExportServer: false,// 是否导出服务端
                isJsonAllCfgFileExist: false,// 是否单一配置文件存在
                jsonSavePath: null,// json保存文件夹路径
                jsonAllCfgFileName: null,// json配置文件名

                jsSavePath: null,// 插件资源目录
                jsFileName: null,//js配置合并为一个文件的文件名
                isJsFileExist: false,
                isFormatJsCode: false,
                excelArray: [],
                excelFileArr: [],


                importProjectCfgPath: null,
            },
            methods: {
                ////////////////////////////导入到项目////////////////////////////////////////////
                onBtnClickSelectProjectJsonCfgPath() {
                    let res = Editor.Dialog.openFile({
                        title: "选择项目配置存放目录",
                        defaultPath: path.join(Editor.Project.path, "assets"),
                        properties: ['openDirectory'],
                    });
                    if (res !== -1) {
                        let dir = res[0];
                        if (dir !== this.importProjectCfgPath) {
                            this.importProjectCfgPath = dir;
                            this._saveConfig();
                        }
                    }
                },
                onBtnClickImportProjectJsonCfg_Server() {
                    this._importJsonCfg("server");
                },
                onBtnClickImportProjectJsonCfg_Client() {
                    this._importJsonCfg("client");
                },
                _importJsonCfg(typeDir) {
                    if (!fs.existsSync(this.importProjectCfgPath)) {
                        this._addLog("导入项目路径不存在:" + this.importProjectCfgPath);
                        return;
                    }

                    if (!this.isExportJson) {
                        this._addLog("[Warning] 您未勾选导出Json配置,可能导入的配置时上个版本的!");
                    }
                    let importPath = Editor.assetdb.remote.fspathToUrl(this.importProjectCfgPath);
                    if (importPath.indexOf("db://assets") >= 0) {

                        // 检索所有的json配置
                        let clientDir = path.join(this.jsonSavePath, typeDir);
                        if (!fs.existsSync(clientDir)) {
                            this._addLog("配置目录不存在:" + clientDir);
                            return;
                        }
                        let pattern = path.join(clientDir, '**/*.json');
                        let files = Globby.sync(pattern);
                        //Editor.log("files", files, importPath)
                        this._addLog("一共导入文件数量: " + files.length);
                        for (let i = 0; i < files.length; i++) {

                        }
                        Editor.assetdb.import(files, importPath,
                            function (err, results) {
                                results.forEach(function (result) {
                                    //console.log(result.path);
                                    // result.uuid
                                    // result.parentUuid
                                    // result.url
                                    // result.path
                                    // result.type
                                });
                            }.bind(this));
                    } else {
                        this._addLog("非项目路径,无法导入 : " + this.importProjectCfgPath);
                    }
                },
                ////////////////////////////////////////////////////////////////////////
                _addLog(str) {
                    let time = new Date();
                    // this.logView = "[" + time.toLocaleString() + "]: " + str + "\n" + this.logView;
                    this.logView += "[" + time.toLocaleString() + "]: " + str + "\n";
                    logListScrollToBottom();
                },
                onBtnClickTellMe() {
                    // let data = nodeXlsx.parse(path.join(this.excelRootPath, 'test2.xlsx'));
                    // //console.log(data);
                    // return;
                    let url = "http://wpa.qq.com/msgrd?v=3&uin=774177933&site=qq&menu=yes";
                    Electron.shell.openExternal(url);
                },
                _saveConfig() {
                    let data = {
                        excelRootPath: this.excelRootPath,
                        jsFileName: this.jsFileName,
                        jsonAllFileName: this.jsonAllCfgFileName,
                        isMergeJson: this.isMergeJson,
                        isMergeJavaScript: this.isMergeJavaScript,
                        isFormatJsCode: this.isFormatJsCode,
                        isFormatJson: this.isFormatJson,
                        isCompressJson: this.isCompressJson,
                        isExportJson: this.isExportJson,
                        isExportJs: this.isExportJs,
                        isExportTs: this.isExportTs,
                        isExportClient: this.isExportClient,
                        isExportServer: this.isExportServer,
                        importProjectCfgPath: this.importProjectCfgPath,
                    };
                    CfgUtil.saveCfgByData(data);
                },
                onBtnClickFreshExcel() {
                    this._onAnalyzeExcelDirPath(this.excelRootPath);
                },
                _watchDir(event, filePath) {
                    return;
                    //console.log("监控文件....");
                    //console.log(event, filePath);
                    let ext = path.extname(filePath);
                    if (ext === ".xlsx" || ext === ".xls") {
                        this._onAnalyzeExcelDirPath(this.excelRootPath);
                    }
                },
                onBtnClickHelpDoc() {
                    let url = "https://github.com/tidys/CocosCreatorPlugins/tree/master/packages/excel-killer/README.md";
                    Electron.shell.openExternal(url);
                },
                _initPluginCfg() {
                    //console.log("initCfg");
                    CfgUtil.initCfg(function (data) {
                        if (data) {
                            this.excelRootPath = data.excelRootPath || "";
                            if (fs.existsSync(this.excelRootPath)) {
                                this._onAnalyzeExcelDirPath(this.excelRootPath);
                                chokidar.watch(this.excelRootPath, {
                                    usePolling: true,
                                    // interval: 1000,
                                    // awaitWriteFinish: {
                                    //     stabilityThreshold: 2000,
                                    //     pollInterval: 100
                                    // },
                                }).on('all', this._watchDir.bind(this));
                            } else {

                            }
                            this.jsFileName = data.jsFileName || "GameJsCfg";
                            this.jsonAllCfgFileName = data.jsonAllFileName || "GameJsonCfg";
                            this.isMergeJson = data.isMergeJson || false;
                            this.isMergeJavaScript = data.isMergeJavaScript || false;
                            this.isFormatJsCode = data.isFormatJsCode || false;
                            this.isFormatJson = data.isFormatJson || false;
                            this.isCompressJson = data.isCompressJson || false;
                            this.isExportJson = data.isExportJson || false;
                            this.isExportJs = data.isExportJs || false;
                            this.isExportTs = data.isExportTs || false;
                            this.isExportClient = data.isExportClient || false;
                            this.isExportServer = data.isExportServer || false;
                            this.importProjectCfgPath = data.importProjectCfgPath || null;
                            this.checkJsFileExist();
                            this.checkJsonAllCfgFileExist();
                        } else {
                            this.jsFileName = "GameJsCfg";
                            this.jsonAllCfgFileName = "GameJsonCfg";
                        }
                    }.bind(this));
                    this._initCfgSavePath();// 默认json路径
                },
                _initCfgSavePath() {
                    let projectPath = Editor.Project.path;
                    let pluginResPath = path.join(projectPath, "plugin-resource");
                    if (!fs.existsSync(pluginResPath)) {
                        fs.mkdirSync(pluginResPath);
                    }

                    let pluginResPath1 = path.join(pluginResPath, "json");
                    if (!fs.existsSync(pluginResPath1)) {
                        fs.mkdirSync(pluginResPath1);
                    }
                    this.jsonSavePath = pluginResPath1;
                    this._initCSDir(this.jsonSavePath);

                    let pluginResPath2 = path.join(pluginResPath, "js");
                    if (!fs.existsSync(pluginResPath2)) {
                        fs.mkdirSync(pluginResPath2);
                    }
                    this.jsSavePath = pluginResPath2;
                    this._initCSDir(this.jsSavePath);
                },
                // 初始化client-server目录
                _initCSDir(saveDir) {
                    let clientDir = path.join(saveDir, dirClientName);
                    if (!fs.existsSync(clientDir)) {
                        fs.mkdirSync(clientDir);
                    }
                    let serverDir = path.join(saveDir, dirServerName);
                    if (!fs.existsSync(serverDir)) {
                        fs.mkdirSync(serverDir);
                    }
                },
                onBtnClickFormatJson() {
                    this.isFormatJson = !this.isFormatJson;
                    this._saveConfig();
                },
                onBtnClickCompressJson() {
                    this.isCompressJson = !this.isCompressJson;
                    this._saveConfig();
                },
                // 是否合并json
                onBtnClickMergeJson() {
                    this.isMergeJson = !this.isMergeJson;
                    this._saveConfig();
                },
                onBtnClickMergeJavaScript() {
                    this.isMergeJavaScript = !this.isMergeJavaScript;
                    this._saveConfig();
                },
                // 打开合并的json
                onBtnClickJsonAllCfgFile() {
                    let saveFileFullPath1 = path.join(this.jsonSavePath, dirClientName, this.jsonAllCfgFileName + ".json");
                    let saveFileFullPath2 = path.join(this.jsonSavePath, dirServerName, this.jsonAllCfgFileName + ".json");
                    if (fs.existsSync(saveFileFullPath1)) {
                        Electron.shell.openItem(saveFileFullPath1);
                        Electron.shell.beep();
                    } else if (fs.existsSync(saveFileFullPath2)) {
                        Electron.shell.openItem(saveFileFullPath2);
                        Electron.shell.beep();
                    } else {
                        // this._addLog("目录不存在：" + this.resourceRootDir);
                        this._addLog("目录不存在:" + saveFileFullPath1 + ' or:' + saveFileFullPath2);
                        return;
                    }
                },
                checkJsonAllCfgFileExist() {
                    let saveFileFullPath1 = path.join(this.jsonSavePath, dirClientName, this.jsonAllCfgFileName + ".json");
                    let saveFileFullPath2 = path.join(this.jsonSavePath, dirServerName, this.jsonAllCfgFileName + ".json");
                    if (fs.existsSync(saveFileFullPath1) || fs.existsSync(saveFileFullPath2)) {
                        this.isJsonAllCfgFileExist = true;
                    } else {
                        this.isJsonAllCfgFileExist = false;
                    }
                },
                onBtnClickFormatJsCode() {
                    this.isFormatJsCode = !this.isFormatJsCode;
                    this._saveConfig();
                },
                onBtnClickOpenExcelRootPath() {
                    if (fs.existsSync(this.excelRootPath)) {
                        Electron.shell.showItemInFolder(this.excelRootPath);
                        Electron.shell.beep();
                    } else {
                        this._addLog("目录不存在：" + this.excelRootPath);
                    }
                },
                onBtnClickSelectExcelRootPath() {
                    let res = Editor.Dialog.openFile({
                        title: "选择Excel的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ['openDirectory'],
                    });
                    if (res !== -1) {
                        let dir = res[0];
                        if (dir !== this.excelRootPath) {
                            this.excelRootPath = dir;
                            chokidar.watch(this.excelRootPath).on('all', this._watchDir.bind(this));
                            this._onAnalyzeExcelDirPath(dir);
                            this._saveConfig();
                        }
                    }
                },
                // 修改js配置文件
                onJsFileNameChanged() {
                    this._saveConfig();
                },
                // 修改json配置文件
                onJsonAllCfgFileChanged() {
                    this._saveConfig();
                },
                onBtnClickIsExportJson() {
                    this.isExportJson = !this.isExportJson;
                    if (this.isExportJs) {
                        this.isExportJs = false;
                    }
                    this._saveConfig();
                },
                onBtnClickIsExportJs() {
                    this.isExportJs = !this.isExportJs;
                    if (this.isExportJson) {
                        this.isExportJson = false;
                    }
                    this._saveConfig();
                },
                onBtnClickIsExportTs() {
                    this.isExportTs = !this.isExportTs;
                    this._saveConfig();
                },
                onBtnClickExportClient() {
                    this.isExportClient = !this.isExportClient;
                    this._saveConfig();
                },
                onBtnClickExportServer() {
                    this.isExportServer = !this.isExportServer;
                    this._saveConfig();
                },
                // 查找出目录下的所有excel文件
                _onAnalyzeExcelDirPath(dir) {
                    let self = this;

                    // let dir = path.normalize("D:\\proj\\CocosCreatorPlugins\\doc\\excel-killer");
                    if (dir) {
                        // 查找json文件
                        let allFileArr = [];
                        let excelFileArr = [];
                        // 获取目录下所有的文件
                        readDirSync(dir);
                        // 过滤出来.xlsx的文件
                        for (let k in allFileArr) {
                            let file = allFileArr[k];
                            let extName = path.extname(file);
                            if (extName === ".xlsx" || extName === ".xls") {
                                excelFileArr.push(file);
                            } else {
                                this._addLog("不支持的文件类型: " + file);
                            }
                        }

                        this.excelFileArr = excelFileArr;
                        // 组装显示的数据
                        let excelSheetArray = [];
                        let sheetDuplicationChecker = {};//表单重名检测
                        for (let k in excelFileArr) {
                            let itemFullPath = excelFileArr[k];
                            // this._addLog("excel : " + itemFullPath);

                            let excelData = nodeXlsx.parse(itemFullPath);
                            //todo 检测重名的sheet
                            for (let j in excelData) {
                                let itemData = {
                                    isUse: true,
                                    fullPath: itemFullPath,
                                    name: "name",
                                    sheet: excelData[j].name
                                };
                                itemData.name = itemFullPath.substr(dir.length + 1, itemFullPath.length - dir.length);

                                if (itemData.sheet[0] == "_") {
                                    this._addLog("[Log] 跳过Sheet: " + itemData.name + " - " + itemData.sheet);
                                    continue;
                                }

                                if (excelData[j].data.length === 0) {
                                    this._addLog("[Error] 空Sheet: " + itemData.name + " - " + itemData.sheet);
                                    continue;
                                }

                                if (sheetDuplicationChecker[itemData.sheet]) {
                                    //  重名sheet问题
                                    this._addLog("[Error ] 出现了重名sheet: " + itemData.sheet);
                                    this._addLog("[Sheet1] " + sheetDuplicationChecker[itemData.sheet].fullPath);
                                    this._addLog("[Sheet2] " + itemFullPath);
                                    this._addLog("请仔细检查Excel-Sheet!");
                                } else {
                                    sheetDuplicationChecker[itemData.sheet] = itemData;
                                    excelSheetArray.push(itemData);
                                }
                            }
                        }
                        this.excelArray = excelSheetArray;

                        function readDirSync(dirPath) {
                            let dirInfo = fs.readdirSync(dirPath);
                            for (let i = 0; i < dirInfo.length; i++) {
                                let item = dirInfo[i];
                                let itemFullPath = path.join(dirPath, item);
                                let info = fs.statSync(itemFullPath);
                                if (info.isDirectory()) {
                                    // this._addLog('dir: ' + itemFullPath);
                                    readDirSync(itemFullPath);
                                } else if (info.isFile()) {
                                    let headStr = item.substr(0, 2);
                                    if (headStr === "~$") {
                                        self._addLog("检索到excel产生的临时文件:" + itemFullPath);
                                    } else {
                                        allFileArr.push(itemFullPath);
                                    }
                                    // this._addLog('file: ' + itemFullPath);
                                }
                            }
                        }
                    }
                },
                onStopTouchEvent(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    // //console.log("dragOver");
                },
                onBtnClickSelectSheet(event) {
                    let b = event.currentTarget.value;
                    for (let k in this.excelArray) {
                        this.excelArray[k].isUse = b;
                    }
                },
                onBtnClickOpenJsonSavePath() {
                    let saveFileFullPath1 = path.join(this.jsonSavePath, dirClientName);
                    let saveFileFullPath2 = path.join(this.jsonSavePath, dirServerName);
                    if (fs.existsSync(saveFileFullPath1)) {
                        Electron.shell.openItem(saveFileFullPath1);
                        Electron.shell.beep();
                    } else if (fs.existsSync(saveFileFullPath2)) {
                        Electron.shell.openItem(saveFileFullPath2);
                        Electron.shell.beep();
                    } else {
                        // this._addLog("目录不存在：" + this.resourceRootDir);
                        this._addLog("目录不存在:" + saveFileFullPath1 + ' or:' + saveFileFullPath2);
                        return;
                    }
                },
                onBtnClickOpenJsSavePath() {
                    let saveFileFullPath1 = path.join(this.jsSavePath, dirClientName);
                    let saveFileFullPath2 = path.join(this.jsSavePath, dirServerName);
                    if (fs.existsSync(saveFileFullPath1)) {
                        Electron.shell.openItem(saveFileFullPath1);
                        Electron.shell.beep();
                    } else if (fs.existsSync(saveFileFullPath2)) {
                        Electron.shell.openItem(saveFileFullPath2);
                        Electron.shell.beep();
                    } else {
                        // this._addLog("目录不存在：" + this.resourceRootDir);
                        this._addLog("目录不存在:" + saveFileFullPath1 + ' or:' + saveFileFullPath2);
                        return;
                    }
                },
                onBtnClickOpenJsExportPath() {
                    let saveFileFullPath1 = path.join(this.jsSavePath, dirClientName);
                    // let files = fs.readdirSync(saveFileFullPath1);
                    // Editor.log("files", files)
                    let saveFileFullPath2 = path.join(Editor.Project.path, "assets/script/config");
                    if (fs.existsSync(saveFileFullPath2)) {
                        // 检索所有的ts配置
                        let pattern = path.join(saveFileFullPath1, '*.ts');
                        let files = Globby.sync(pattern)
                        this._addLog("一共导入脚本数量: " + files.length);
                        let importPath = Editor.assetdb.remote.fspathToUrl(saveFileFullPath2);
                        //Editor.log("fs", fs)
                        Editor.assetdb.import(files, importPath,
                            function (err, results) {
                                results.forEach(function (result) {
                                    //console.log(result.path);
                                    // result.uuid
                                    // result.parentUuid
                                    // result.url
                                    // result.path
                                    // result.type
                                });
                            }.bind(this));

                        // Electron.shell.openItem(saveFileFullPath2);
                        // Electron.shell.beep();                       
                    } else {
                        // this._addLog("目录不存在：" + this.resourceRootDir);
                        this._addLog("目录不存在:" + saveFileFullPath1);
                        return;
                    }
                },
                onBtnClickClear() {
                    let jsPath1 = path.join(this.jsSavePath, dirClientName);
                    fs.emptyDirSync(jsPath1);

                    let jsPath2 = path.join(this.jsSavePath, dirServerName);
                    fs.emptyDirSync(jsPath2);

                    let jsonPath1 = path.join(this.jsonSavePath, dirClientName);
                    fs.emptyDirSync(jsonPath1);

                    let jsonPath2 = path.join(this.jsonSavePath, dirServerName);
                    fs.emptyDirSync(jsonPath2);
                },
                _parseValue(type, value, importData) {
                    if (type[0] == "?") {
                        type = type.substr(1);
                    }
                    let v;
                    switch (type) {
                        case "boolean":
                            if (value != null) {
                                if (typeof value == "string") {
                                    value = (value.toLocaleLowerCase() == "true")
                                } else {
                                    value = value !== 0;
                                }
                            } else {
                                value = false;
                            }
                            break;
                        case "define":
                            //无需处理
                            break;
                        case "string":
                            if (typeof value != "string") {
                                //Editor.warn("_parseValue string warn:" + type, "value:" + value);
                                //this._addLog("填表类型不匹配:" + type + " value:" + value);
                                value = value.toString();
                            }
                            break;
                        case "number":
                            if (value != null && value != "") {
                                if (typeof value != "number") {
                                    Editor.warn("_parseValue number warn:" + type, "value:" + value);
                                    this._addLog("填表类型不匹配:" + type + " value:" + value + " parse:" + parseFloat(value));
                                    value = parseFloat(value) || 0;
                                }
                            }
                            break;
                        case "object":
                        case "string[]":
                        case "number[]":
                        case "string[][]":
                        case "number[][]":
                            try {
                                value = JSON.parse(value);
                            } catch (error) {
                                Editor.error("_parseValue error json, type:" + type, "value:" + value);
                            }
                            break;
                        case "cc.Vec2":
                            try {
                                v = JSON.parse(value);
                            } catch (error) {
                                Editor.error("_parseValue error json, type:" + type, "value:" + value);
                            }
                            value = new cc.v2(v[0], v[1]);
                            break;
                        case "cc.Vec3":
                            try {
                                v = JSON.parse(value);
                            } catch (error) {
                                Editor.error("_parseValue error json, type:" + type, "value:" + value);
                            }
                            value = new cc.v3(v[0], v[1], v[2]);
                            break;
                        default:
                            let extendImport = extendClass[type];
                            if (extendImport != null) {
                                if (extendImport.isJson) {
                                    try {
                                        value = JSON.parse(value);
                                    } catch (error) {
                                        Editor.error("_parseValue error json, type:" + type, "value:" + value);
                                    }
                                }
                            } else {
                                Editor.log("_parseValue untreated type:" + type, "value:" + value);
                                try {
                                    value = JSON.parse(value);
                                } catch (error) {
                                    Editor.error("_parseValue error json, type:" + type, "value:" + value);
                                }
                            }
                            break;
                    }
                    return value;
                },
                _getJavaScriptSaveData(excelData, itemSheet, isClient) {
                    let title = excelData[0];
                    let desc = excelData[1];
                    let target = excelData[2];
                    let types = excelData[3];
                    let sheetFormatData = {};
                    let sheetDefineData = {};
                    let sheetImportData = {};
                    let sheetClassData = "{";
                    for (let j = 0; j < title.length; j++) {
                        let key = title[j];
                        let type = types[j];
                        if (type === undefined) {
                            continue;
                        }
                        if (type == "define") {
                            type = "string";
                        } else if (type == "?define") {
                            type = "?string";
                        }
                        let arraySlicePos = key.indexOf("_");
                        if (arraySlicePos > 0 && parseInt(key.substr(arraySlicePos + 1)) != null) {
                            if (parseInt(key.substr(arraySlicePos + 1)) == 1) {
                                key = key.slice(0, arraySlicePos) + "s";
                                type = type + "[]";
                            } else {
                                continue;
                            }
                        }

                        if (type[0] == "?") {
                            type = type.substr(1);
                            sheetClassData += "" + key + "?:" + type + ";";
                        } else {
                            sheetClassData += "" + key + ":" + type + ";";
                        }

                        let extendImport = extendClass[type];
                        if (extendImport != null) {
                            if (sheetImportData != null) {
                                sheetImportData[type] = extendImport.path;
                            }
                        }
                    }
                    sheetClassData += "}";

                    for (let i = 4; i < excelData.length; i++) {
                        let lineData = excelData[i];
                        if (lineData.length === 0) {
                            // 空行直接跳过
                            continue;
                        } else {
                            if (lineData.length < title.length) {
                                Editor.error("[Error] 发现第" + i + "行缺少字段,跳过该行数据配置.");
                                this._addLog(itemSheet.name + "*" + itemSheet.sheet + "[Error] 发现第" + i + "行缺少字段,跳过该行数据配置.");
                                continue;
                            } else if (lineData.length > title.length) {
                                Editor.error("[Error] 发现第" + i + "行多余字段,跳过该行数据配置.");
                                this._addLog(itemSheet.name + "*" + itemSheet.sheet + "[Error] 发现第" + i + "行多余字段,跳过该行数据配置.");
                                continue;
                            }

                            if (lineData[0][0] == "#") {
                                Editor.error(itemSheet.name + "*" + itemSheet.sheet + "[Log] 发现第" + i + "行需要跳过.id:" + lineData[0]);
                                this._addLog(itemSheet.name + "*" + itemSheet.sheet + "[Log] 发现第" + i + "行需要跳过.id:" + lineData[0]);
                                continue;
                            }
                        }
                        let saveLineData = {};
                        let canExport = false;
                        for (let j = 0; j < title.length; j++) {
                            canExport = false;
                            if (target[j] == null) {
                                target[j] = "";
                                Editor.error(itemSheet.name + "*" + itemSheet.sheet + "[Log] 发现第" + j + "列导出配置为空");
                            }
                            if (isClient && target[j].indexOf('c') !== -1) {
                                canExport = true;
                            } else if (!isClient && target[j].indexOf('s') !== -1) {
                                canExport = true;
                            }
                            if (canExport) {
                                let key = title[j];
                                let value = lineData[j];
                                let type = types[j];
                                if (type == "define" || type == "?define") {
                                    if (value === undefined) {
                                        continue;
                                    }
                                    sheetDefineData[value] = lineData[0];
                                }

                                //合并为数组
                                let arraySlicePos = key.indexOf("_");
                                if (arraySlicePos > 0 && parseInt(key.substr(arraySlicePos + 1)) != null) {
                                    if (value === undefined) {
                                        continue;
                                    }
                                    let arrayKey = key.slice(0, arraySlicePos) + "s";
                                    let array = saveLineData[arrayKey];
                                    if (array == null) {
                                        array = [];
                                        saveLineData[arrayKey] = array;
                                    }
                                    value = this._parseValue(type, value, sheetImportData);
                                    array.push(value);
                                } else {
                                    if (value === undefined) {
                                        //value = "";
                                        if (type[0] != "?") {
                                            Editor.error("[Error] 发现空单元格:" + itemSheet.name + "*" + itemSheet.sheet + " => (" + key + "," + (i + 1) + ")");
                                            this._addLog("[Error] 发现空单元格:" + itemSheet.name + "*" + itemSheet.sheet + " => (" + key + "," + (i + 1) + ")");
                                        }
                                        continue;
                                    }
                                    value = this._parseValue(type, value, sheetImportData);
                                    saveLineData[key] = value;
                                }
                            }
                        }

                        canExport = false;
                        if (isClient && target[0].indexOf('c') !== -1) {
                            canExport = true;
                        } else if (!isClient && target[0].indexOf('s') !== -1) {
                            canExport = true;
                        }
                        if (canExport) {
                            sheetFormatData[lineData[0].toString()] = saveLineData;
                        }
                    }
                    return [sheetFormatData, sheetDefineData, sheetClassData, sheetImportData];
                },
                _getJsonSaveData(excelData, itemSheet, isClient) {
                    let title = excelData[0];
                    let desc = excelData[1];
                    let target = excelData[2];
                    let types = excelData[3];
                    let ret = null;
                    let useFormat1 = false;
                    if (useFormat1) {
                        let saveData1 = [];// 格式1:对应的为数组
                        for (let i = 4; i < excelData.length; i++) {
                            let lineData = excelData[i];
                            if (lineData.length < title.length) {
                                continue;
                            } else if (lineData.length > title.length) {
                                continue;
                            }

                            if (lineData[0][0] == "#") {
                                continue;
                            }

                            let saveLineData = {};
                            let canExport = false;
                            for (let j = 0; j < title.length; j++) {
                                canExport = false;
                                if (isClient && target[j].indexOf('c') !== -1) {
                                    canExport = true;
                                } else if (!isClient && target[j].indexOf('s') !== -1) {
                                    canExport = true;
                                }
                                if (canExport) {
                                    let key = title[j];
                                    let value = lineData[j];
                                    let type = types[j];
                                    //合并为数组
                                    let arraySlicePos = key.indexOf("_");
                                    if (arraySlicePos > 0 && parseInt(key.substr(arraySlicePos + 1)) != null) {
                                        let arrayKey = key.slice(0, arraySlicePos) + "s";
                                        let array = saveLineData[arrayKey];
                                        if (array == null) {
                                            array = [];
                                            saveLineData[arrayKey] = array;
                                        }
                                        if (value !== undefined) {
                                            value = this._parseValue(type, value);
                                            array.push(value);
                                        }
                                    } else {
                                        if (value === undefined) {
                                            //value = "";
                                            continue;
                                        }
                                        value = this._parseValue(type, value);
                                        saveLineData[key] = value;
                                    }
                                }
                            }

                            canExport = false;
                            if (isClient && target[0].indexOf('c') !== -1) {
                                canExport = true;
                            } else if (!isClient && target[0].indexOf('s') !== -1) {
                                canExport = true;
                            }
                            if (canExport) {
                                saveData1.push(saveLineData);
                            }
                        }
                        ret = saveData1;
                    } else {
                        let saveData2 = {};// 格式2:id作为索引
                        for (let i = 4; i < excelData.length; i++) {
                            let lineData = excelData[i];
                            if (lineData.length !== title.length) {
                                this._addLog(`配置表头和配置数据不匹配:${itemSheet.name} - ${itemSheet.sheet} : 第${i + 1}行`);
                                this._addLog("跳过该行数据");
                                Editor.error(`配置表头和配置数据不匹配:${itemSheet.name} - ${itemSheet.sheet} : 第${i + 1}行`);
                                continue;
                            }

                            if (lineData[0][0] == "#") {
                                continue;
                            }

                            let saveLineData = {};
                            let canExport = false;

                            // todo 将ID字段也加入到data中
                            for (let j = 0; j < title.length; j++) {
                                canExport = false;
                                if (isClient && target[j] && target[j].indexOf('c') !== -1) {
                                    canExport = true;
                                } else if (!isClient && target[j] && target[j].indexOf('s') !== -1) {
                                    canExport = true;
                                }
                                if (canExport) {
                                    let key = title[j];
                                    let value = lineData[j];
                                    let type = types[j];
                                    //合并为数组
                                    let arraySlicePos = key.indexOf("_");
                                    if (arraySlicePos > 0 && parseInt(key.substr(arraySlicePos + 1)) != null) {
                                        let arrayKey = key.slice(0, arraySlicePos) + "s";
                                        let array = saveLineData[arrayKey];
                                        if (array == null) {
                                            array = [];
                                            saveLineData[arrayKey] = array;
                                        }
                                        if (value !== undefined) {
                                            value = this._parseValue(type, value);
                                            array.push(value);
                                        }
                                    } else {
                                        if (value === undefined) {
                                            //value = "";
                                            continue;
                                        }
                                        value = this._parseValue(type, value);
                                        saveLineData[key] = value;
                                    }
                                }
                            }

                            canExport = false;
                            if (isClient && target[0] && target[0].indexOf('c') !== -1) {
                                canExport = true;
                            } else if (!isClient && target[0] && target[0].indexOf('s') !== -1) {
                                canExport = true;
                            }
                            if (canExport) {
                                saveData2[lineData[0].toString()] = saveLineData;
                            }
                        }
                        ret = saveData2;
                    }
                    return ret;
                },
                // 打开生成的js配置文件
                onBtnClickOpenJsFile() {
                    let saveFileFullPath1 = path.join(this.jsSavePath, dirClientName, this.jsFileName + ".js");
                    let saveFileFullPath2 = path.join(this.jsSavePath, dirServerName, this.jsFileName + ".js");
                    if (fs.existsSync(saveFileFullPath1)) {
                        Electron.shell.openItem(saveFileFullPath1);
                        Electron.shell.beep();
                    } else if (fs.existsSync(saveFileFullPath2)) {
                        Electron.shell.openItem(saveFileFullPath2);
                        Electron.shell.beep();
                    } else {
                        // this._addLog("目录不存在：" + this.resourceRootDir);
                        this._addLog("目录不存在:" + saveFileFullPath1 + ' or:' + saveFileFullPath2);
                    }
                },
                // 检测js配置文件是否存在
                checkJsFileExist() {
                    let saveFileFullPath1 = path.join(this.jsSavePath, dirClientName, this.jsFileName + ".js");
                    let saveFileFullPath2 = path.join(this.jsSavePath, dirServerName, this.jsFileName + ".js");
                    if (fs.existsSync(saveFileFullPath1) || fs.existsSync(saveFileFullPath2)) {
                        this.isJsFileExist = true;
                    } else {
                        this.isJsFileExist = false;
                    }
                },
                // 生成配置
                onBtnClickGen() {
                    //console.log("onBtnClickGen");
                    // 参数校验
                    if (this.excelArray.length <= 0) {
                        this._addLog("未发现要生成的配置!");
                        return;
                    }

                    if (this.isMergeJson) {
                        if (!this.jsonAllCfgFileName || this.jsonAllCfgFileName.length <= 0) {
                            this._addLog("请输入要保存的json文件名!");
                            return;
                        }
                    }
                    if (this.isMergeJavaScript) {
                        if (!this.jsFileName || this.jsFileName.length <= 0) {
                            this._addLog("请输入要保存的js文件名!");
                            return;
                        }
                    }
                    // TODO
                    if (this.isExportServer === false && this.isExportClient === false) {
                        this._addLog("请选择要导出的目标!");
                        return;
                    }

                    if (this.isExportJson === false && this.isExportJs === false && this.isExportTs === false) {
                        this._addLog("请选择要导出的类型!");
                        return;
                    }


                    this.logView = "";
                    // 删除老的配置
                    let jsonSavePath1 = path.join(this.jsonSavePath, dirClientName);
                    let jsonSavePath2 = path.join(this.jsonSavePath, dirServerName);
                    fsExtra.emptyDirSync(jsonSavePath1);
                    fsExtra.emptyDirSync(jsonSavePath2);

                    let jsSavePath1 = path.join(this.jsSavePath, dirClientName);
                    let jsSavePath2 = path.join(this.jsSavePath, dirServerName);
                    fsExtra.emptyDirSync(jsSavePath1);
                    fsExtra.emptyDirSync(jsSavePath2);

                    let jsonAllSaveDataClient = {};// 保存客户端的json数据
                    let jsonAllSaveDataServer = {};// 保存服务端的json数据

                    let jsAllSaveDataClient = {};// 保存客户端的js数据
                    let jsAllSaveDataServer = {};// 保存服务端的js数据          

                    for (let k in this.excelArray) {
                        let itemSheet = this.excelArray[k];
                        if (!itemSheet.isUse) {
                            //console.log("忽略配置: " + itemSheet.fullPath + ' - ' + itemSheet.sheet);
                            continue;
                        }
                        let excelData = nodeXlsx.parse(itemSheet.fullPath);
                        let sheetData = null;
                        for (let j in excelData) {
                            if (excelData[j].name === itemSheet.sheet) {
                                sheetData = excelData[j].data;
                            }
                        }

                        if (sheetData) {

                        } else {
                            this._addLog("未发现数据");
                            continue;
                        }

                        if (sheetData.length <= 3) {
                            this._addLog("行数低于3行,无效sheet:" + itemSheet.sheet);
                            continue;
                        }

                        if (this.isExportJson) {
                            // 保存为json
                            let writeFileJson = function (pathSave, isClient) {
                                let jsonSaveData = this._getJsonSaveData(sheetData, itemSheet, isClient);
                                if (Object.keys(jsonSaveData).length > 0) {
                                    if (this.isMergeJson) {
                                        if (isClient) {
                                            // 检测重复问题
                                            if (jsonAllSaveDataClient[itemSheet.sheet] === undefined) {
                                                jsonAllSaveDataClient[itemSheet.sheet] = jsonSaveData;
                                            } else {
                                                Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                                this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            }
                                        } else {
                                            // 检测重复问题
                                            if (jsonAllSaveDataServer[itemSheet.sheet] === undefined) {
                                                jsonAllSaveDataServer[itemSheet.sheet] = jsonSaveData;
                                            } else {
                                                Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                                this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            }
                                        }
                                    } else {
                                        let saveFileFullPath = path.join(pathSave, itemSheet.sheet + ".json");
                                        this._onSaveJsonCfgFile(jsonSaveData, saveFileFullPath);
                                    }
                                }
                            }.bind(this);
                            if (this.isExportClient) writeFileJson(jsonSavePath1, true);
                            if (this.isExportServer) writeFileJson(jsonSavePath2, false);
                        }
                        if (this.isExportJs) {
                            // 保存为js
                            let writeFileJs = function (savePath, isClient) {
                                let [sheetJsData] = this._getJavaScriptSaveData(sheetData, itemSheet, isClient);
                                if (Object.keys(sheetJsData).length > 0) {
                                    if (this.isMergeJavaScript) {
                                        if (isClient) {
                                            // 检测重复问题
                                            if (jsAllSaveDataClient[itemSheet.sheet] === undefined) {
                                                jsAllSaveDataClient[itemSheet.sheet] = sheetJsData;
                                            } else {
                                                Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                                this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            }
                                        } else {
                                            // 检测重复问题
                                            if (jsAllSaveDataServer[itemSheet.sheet] === undefined) {
                                                jsAllSaveDataServer[itemSheet.sheet] = sheetJsData;
                                            } else {
                                                Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                                this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            }
                                        }
                                    } else {
                                        // 保存js配置
                                        let fileNameFullPath = path.join(savePath, itemSheet.sheet + "JsCfg.js");
                                        this._onSaveJavaScriptCfgFile(fileNameFullPath, sheetJsData);
                                    }
                                }
                            }.bind(this);
                            if (this.isExportClient) writeFileJs(jsSavePath1, true);
                            if (this.isExportServer) writeFileJs(jsSavePath2, false);
                        }
                        if (this.isExportTs) {
                            // 保存为Ts
                            let writeFileTs = function (savePath, isClient) {
                                let [sheetJsData, sheetDefineData, sheetClassData, sheetImportData] = this._getJavaScriptSaveData(sheetData, itemSheet, isClient);
                                if (Object.keys(sheetJsData).length > 0) {
                                    if (isClient) {
                                        // 检测重复问题
                                        if (jsAllSaveDataClient[itemSheet.sheet] === undefined) {
                                            jsAllSaveDataClient[itemSheet.sheet] = sheetJsData;
                                        } else {
                                            Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                        }
                                    } else {
                                        // 检测重复问题
                                        if (jsAllSaveDataServer[itemSheet.sheet] === undefined) {
                                            jsAllSaveDataServer[itemSheet.sheet] = sheetJsData;
                                        } else {
                                            Editor.warn("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                            this._addLog("发现重名sheet:" + itemSheet.name + "(" + itemSheet.sheet + ")");
                                        }
                                    }

                                    if (this.isExportJson || this.isExportJs) {
                                        //数据保存在json中，TS需要存储
                                        sheetJsData = null;
                                    }

                                    // 保存Ts配置
                                    let fileNameFullPath = path.join(savePath, itemSheet.sheet + "Cfg.ts");
                                    this._onSaveTypeScriptCfgFile(fileNameFullPath, itemSheet.sheet, sheetJsData, sheetDefineData, sheetClassData, sheetImportData);
                                }
                            }.bind(this);
                            if (this.isExportClient) writeFileTs(jsSavePath1, true);
                            if (this.isExportServer) writeFileTs(jsSavePath2, false);
                        }
                        if (this.isCompressJson) {
                            let writeFileCompress = function (pathSave) {
                                let jsonSaveData = this._getJsonSaveData(sheetData, itemSheet, true);
                                let saveFileFullPath = path.join(pathSave, itemSheet.sheet + ".config");
                                this._onSaveCompressConfig(jsonSaveData, saveFileFullPath);
                            }.bind(this);
                            if (this.isExportClient) {
                                writeFileCompress(jsonSavePath1, false);
                            }
                        }
                    }
                    // =====================>>>>  合并json文件   <<<=================================
                    if (this.isExportJson && this.isMergeJson) {
                        if (this.isExportClient) {
                            let saveFileFullPath = path.join(jsonSavePath1, this.jsonAllCfgFileName + ".json");
                            this._onSaveJsonCfgFile(jsonAllSaveDataClient, saveFileFullPath);
                        }
                        if (this.isExportServer) {
                            let saveFileFullPath = path.join(jsonSavePath2, this.jsonAllCfgFileName + ".json");
                            this._onSaveJsonCfgFile(jsonAllSaveDataServer, saveFileFullPath);
                        }
                        this.checkJsonAllCfgFileExist();
                    }
                    // =====================>>>>  合并js文件   <<<=================================
                    if (this.isExportJs && this.isMergeJavaScript) {
                        if (this.isExportClient) {
                            this._onSaveJavaScriptCfgFile(path.join(jsSavePath1, this.jsFileName + "JsCfg.js"), jsAllSaveDataClient);
                        }
                        if (this.isExportServer) {
                            this._onSaveJavaScriptCfgFile(path.join(jsSavePath2, this.jsFileName + "JsCfg.js"), jsAllSaveDataServer);
                        }

                        this.checkJsFileExist();
                    }

                    if (this.isExportTs) {
                        if (this.isExportClient) {
                            this._onSaveTypeScriptCatalogFile(path.join(jsSavePath1, "Cfg.ts"), jsAllSaveDataClient);
                        }
                        if (this.isExportServer) {
                            //this._onSaveJavaScriptCfgFile(path.join(jsSavePath2, this.jsFileName + ".Ts"), jsAllSaveDataServer);
                        }
                    }

                    this._addLog("全部转换完成!");
                },
                // 保存为json配置
                _onSaveJsonCfgFile(data, saveFileFullPath) {
                    let str = JSON.stringify(data);
                    if (this.isFormatJson) {
                        str = jsonBeautifully(str);
                    }
                    fs.writeFileSync(saveFileFullPath, str);
                    this._addLog("[Json]:" + saveFileFullPath);
                },
                // 保存为js配置
                _onSaveJavaScriptCfgFile(saveFileFullPath, jsSaveData) {
                    // TODO 保证key的顺序一致性
                    let saveStr = "module.exports = " + JSON.stringify(jsSaveData) + ";";
                    if (this.isFormatJsCode) {// 保存为格式化代码
                        let ast = uglifyJs.parse(saveStr);
                        let ret = uglifyJs.minify(ast, {
                            output: {
                                beautify: true,//如果希望得到格式化的输出，传入true
                                indent_start: 0,//（仅当beautify为true时有效） - 初始缩进空格
                                indent_level: 4,//（仅当beautify为true时有效） - 缩进级别，空格数量
                            }
                        });
                        if (ret.error) {
                            this._addLog('error: ' + ret.error.message);
                        } else if (ret.code) {
                            fs.writeFileSync(saveFileFullPath, ret.code);
                            this._addLog("[JavaScript]" + saveFileFullPath);
                        } else {
                            this._addLog(JSON.stringify(ret));
                        }
                    } else {// 保存为单行代码
                        fs.writeFileSync(saveFileFullPath, saveStr);
                        this._addLog("[JavaScript]" + saveFileFullPath);
                    }
                },
                // 保存为TypeScript配置
                _onSaveTypeScriptCfgFile(saveFileFullPath, className, cfgData, defineData, classData, importData) {
                    let importStr = "";
                    for (const key in importData) {
                        const element = importData[key];
                        importStr += element;
                    }
                    //Editor.log("className:", JSON.stringify(importData));

                    let saveStr = TemplateReader.replace(/@TypeName/g, className)
                        .replace(/@ClassDefine/g, classData).replace(/@Import/g, importStr);

                    if (Object.keys(defineData).length > 0) {
                        let defineStr = "export const " + className + "Define = " + JSON.stringify(defineData, null, 4);
                        saveStr = saveStr.replace(/@ConstDefine/g, defineStr);
                    } else {
                        saveStr = saveStr.replace(/@ConstDefine/g, "");
                    }

                    if (cfgData != null) {
                        let cfgStr = JSON.stringify(cfgData, null, 4);
                        cfgStr = TemplateConstructor.replace(/@Data/g, cfgStr);
                        saveStr = saveStr.replace(/@Constructor/g, cfgStr);
                    } else {
                        saveStr = saveStr.replace(/@Constructor/g, "");
                    }

                    //Editor.log(className, "\n", saveStr);                    
                    fs.writeFileSync(saveFileFullPath, saveStr);
                    this._addLog("[TypeScript]" + saveFileFullPath);
                },
                _onSaveTypeScriptCatalogFile(saveFileFullPath, classData) {
                    let importBuilder = "";
                    let propertyBuilder = "";
                    let KeyToJsMap = "";
                    for (const key in classData) {
                        let importFunc = TemplateImport.replace(/@TypeName/g, key);
                        importBuilder += (importFunc);

                        let propertyFunc = TemplateProperty.replace(/@TypeName/g, key);
                        propertyBuilder += (propertyFunc);
                        if (this.isExportJs) {
                            let importFuncjs = TemplateImportJs.replace(/@TypeName/g, key);
                            importBuilder += (importFuncjs);
                            KeyToJsMap += ("'" + key + "':" + key + "JsCfg,");
                        }
                    }
                    let catalogBuilder = TemplateCatalog.replace(/@Import/g, importBuilder)
                        .replace(/@Property/g, propertyBuilder).replace(/@JsPro/g, KeyToJsMap);

                    fs.writeFileSync(saveFileFullPath, catalogBuilder);
                    this._addLog("[TypeScript] Catalog" + saveFileFullPath);
                },
                _onSaveCompressConfig(jsondata, saveFileFullPath) {
                    let CompressBuilder = lzstring.compressToBase64(JSON.stringify(jsondata));
                    fs.writeFileSync(saveFileFullPath, CompressBuilder);
                }
            },
        });
    },

    messages: {
        'excel-killer:hello'(event) {
        }
    }
});