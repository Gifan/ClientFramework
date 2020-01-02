let packageName = "hot-update";
let fs = require('fire-fs');
let path = require('fire-path');
module.paths.push(path.join(Editor.Project.path,"packages/hot-update/node_modules"));
let CryptoJS = require('crypto-js');
let Electron = require('electron');
let CfgUtil = Editor.require('packages://' + packageName + '/core/CfgUtil.js');
let zipper = require("zip-local");
let packsrcpath = "";
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

        this.plugin = new window.Vue({
            el: this.shadowRoot,
            created() {
                this._initPluginCfg();
            },
            init() {
            },
            data: {
                logView: "",
                isExportLocal: false,//导出本地配置
                isExportRemote: false,//导出服务器配置
                isExportCompressImport: false,// 是否压缩import文件夹
                isExportCompressRaw: false,// 是否压缩raw-asstes文件夹
                packageSrcPath: null,// 更新包源路径
                packageDestPath: null,// 更新包目标路径
                remoteSavePath: null,    //服务器资源路径
                oldVersion: null,   //版本号
                newVersion: null,
            },
            methods: {
                ////////////////////////////////////////////////////////////////////////
                _addLog(str) {
                    let time = new Date();
                    // this.logView = "[" + time.toLocaleString() + "]: " + str + "\n" + this.logView;
                    this.logView += "[" + time.toLocaleString() + "]: " + str + "\n";
                    logListScrollToBottom();
                },
                _saveConfig() {
                    let data = {
                        isExportLocal: this.isExportLocal,//导出本地配置
                        isExportRemote: this.isExportRemote,//导出服务器配置
                        isExportCompressImport: this.isExportCompressImport,// 是否压缩import文件夹
                        isExportCompressRaw: this.isExportCompressRaw,// 是否压缩raw-asstes文件夹
                        packageSrcPath: this.packageSrcPath,// 更新包源路径
                        packageDestPath: this.packageDestPath,// 更新包目标路径
                        remoteSavePath: this.remoteSavePath,    //服务器资源路径
                        oldVersion: this.oldVersion,   //版本号
                        newVersion: this.newVersion,
                    };
                    CfgUtil.saveCfgByData(data);
                },
                _initPluginCfg() {
                    //console.log("initCfg");
                    CfgUtil.initCfg(function (data) {
                        if (data) {
                            this.isExportLocal = !!data.isExportLocal;
                            this.isExportRemote = !!data.isExportRemote;
                            this.isExportCompressImport = data.isExportCompressImport || false;
                            this.isExportCompressRaw = data.isExportCompressRaw || false;
                            this.packageSrcPath = data.packageSrcPath || path.join(Editor.Project.path, "build/jsb-link");
                            this.packageDestPath = path.join(Editor.Project.path, "remote-assets/");
                            this.remoteSavePath = data.remoteSavePath || "",
                            this.oldVersion = data.oldVersion || "1.0.0";
                            this.newVersion = data.newVersion || "1.0.1";
                        } else {
                            this.packageDestPath = path.join(Editor.Project.path, "remote-assets/");
                        }
                    }.bind(this));

                    this._initCfgSavePath();// 默认json路径
                },
                _initCfgSavePath() {
                    let projectPath = Editor.Project.path;
                    let pluginResPath = path.join(projectPath, "remote-assets");
                    if (!fs.existsSync(pluginResPath)) {
                        fs.mkdirSync(pluginResPath);
                    }
                },
                onBtnClickOpenPackageSrcPath() {
                    let res = Editor.Dialog.openFile({
                        title: "选择更新包源目录",
                        defaultPath: path.join(Editor.Project.path, "build"),
                        properties: ['openDirectory'],
                    });
                    if (res !== -1) {
                        let dir = res[0];
                        if (dir !== this.packageSrcPath) {
                            this.packageSrcPath = dir;
                            this._saveConfig();
                        }
                    }
                },
                onBtnClickOpenPackageDestPath() {
                    if (fs.existsSync(this.packageDestPath)) {
                        Electron.shell.showItemInFolder(this.packageDestPath);
                        Electron.shell.beep();
                    } else {
                        this._addLog("目录不存在：" + this.packageDestPath);
                    }
                },

                //导出远程配置
                onBtnClickIsExportRemote() {
                    this.isExportRemote = !this.isExportRemote;
                    if (this.isExportLocal) {
                        this.isExportLocal = false;
                    }
                    this._saveConfig();
                },

                //导出本地配置
                onBtnClickIsExportLocal() {
                    this.isExportLocal = !this.isExportLocal;
                    if (this.isExportRemote) {
                        this.isExportRemote = false;
                    }
                    this._saveConfig();
                },

                //是否压缩import文件夹
                onBtnClickExportCompressImport() {
                    this.isExportCompressImport = !this.isExportCompressImport;
                    this._saveConfig();
                },

                //是否压缩raw-asstes文件夹
                onBtnClickExportCompressRaw() {
                    this.isExportCompressRaw = !this.isExportCompressRaw;
                    this._saveConfig();
                },

                //版本更改变化
                onVersionChanged() {
                    this._saveConfig();
                },

                onRemotePathChanged() {
                    this._saveConfig();
                },

                // 生成配置
                onBtnClickGen() {
                    let manifest = {
                        packageUrl: this.remoteSavePath,
                        remoteManifestUrl: this.remoteSavePath+ 'project.manifest',
                        remoteVersionUrl: this.remoteSavePath+'version.manifest',
                        version: '1.0.0',
                        assets: {},
                        searchPaths: [],
                    };
                    let destManifest = "";
                    let destVersion = "";
                    packsrcpath = path.join(this.packageSrcPath,"/");
                    if (this.isExportLocal) {
                        destManifest = path.join(Editor.Project.path, "assets/project.manifest");
                        destVersion = path.join(Editor.Project.path, "assets/version.manifest");
                    } else if (this.isExportRemote) {
                        destManifest = path.join(this.packageDestPath, "project.manifest");
                        destVersion = path.join(this.packageDestPath, "version.manifest");
                    } else {
                        this._addLog("请选择需要导出的类型[本地|远程]");
                        return;
                    }
                    let this1 = this;
                    let finishprogress = 0;
                    if(this.isExportCompressImport){
                        finishprogress++;
                    }
                    if(this.isExportCompressRaw){
                        finishprogress++;
                    }
                    if(this.isExportCompressImport){
                        this._addLog("压缩import...");
                        let importzip = path.join(this1.packageSrcPath, "/res/import.zip");
                        if(fs.existsSync(importzip)){
                            fs.unlinkSync(importzip)
                        }
                        zipper.zip(path.join(this.packageSrcPath, '/res/import'), (err, obj)=>{
                            obj.compress().save(importzip, ()=>{
                                this1._addLog("压缩import成功");
                                finishprogress--;
                                wirtefile();
                            });
                            
                        })
                        
                    }
                    if(this.isExportCompressRaw){
                        this._addLog("压缩raw-assets...");
                        let rawzip = path.join(this1.packageSrcPath, "/res/raw-assets.zip");
                        if(fs.existsSync(rawzip)){
                            fs.unlinkSync(rawzip);
                        }
                        zipper.zip(path.join(this.packageSrcPath, '/res/raw-assets/'), (err, obj)=>{
                            obj.compress().save(rawzip, ()=>{
                                finishprogress--;
                                this1._addLog("压缩raw-assets成功");
                                wirtefile();
                            });
                            
                        })
                    }
                    var wirtefile = function(){
                        if(finishprogress > 0) return;
                        this._addLog("生成配置中，请稍候...");
                        let srcpath = path.join(this.packageSrcPath, '/src');
                        let respath = path.join(this.packageSrcPath, '/res')
                        this._readDir(srcpath, manifest.assets);
                        this._readDir(respath, manifest.assets);
                        if(this.isExportRemote){
                            this._addLog("拷贝远程文件中...");
                            let destsrcPath = path.join(this.packageDestPath, "/src");
                            this._deleteFolder(destsrcPath);
                            let destresPath = path.join(this.packageDestPath, "/res");
                            this._deleteFolder(destresPath);
                            this._copyFolder(srcpath, destsrcPath);
                            this._copyFolder(respath, destresPath);
                            this._addLog("拷贝远程文件完成");
                        }

                        fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
                            if (err) throw err;
                            this._addLog("生成project.manifest成功!");
                        });
                        delete manifest.assets;
                        delete manifest.searchPaths;
                        fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
                            if (err) throw err;
                            this._addLog("生成version.manifest成功!");
                        });
                    }.bind(this)
                    
                },

                //导入当前配置
                onBtnClickImport() {
                    let self = this;
                    let configFilePath = path.join(Editor.Project.path, "assets/version.manifest");
                    let b = fs.existsSync(configFilePath);
                    if (b) {
                        console.log("cfg path: " + configFilePath);
                        fs.readFile(configFilePath, 'utf-8', function (err, data) {
                            if (!err) {
                                let saveData = JSON.parse(data.toString());
                                this.oldVersion = saveData.version;
                                var vA = saveData.version.split('.');
                                let newversion = "";
                                for (let i = 0; i < vA.length; ++i) {
                                    let a = parseInt(vA[i]);
                                    if (i != 0) {
                                        newversion += ".";
                                    }
                                    if (i == vA.length - 1) {
                                        a = Number(a) + 1;
                                    }
                                    newversion += `${a}`;
                                }
                                this.newVersion = newversion;
                                this.remoteSavePath = saveData.packageUrl;
                                this._addLog("导入成功!");
                            } else {
                                this._addLog("导入出错!", err);
                            }
                        }.bind(self));
                    } else {
                        this._addLog("导入失败! 当前版本文件不存在:", configFilePath);
                    }

                },

                _readDir(dir, obj) {
                    var stat = fs.statSync(dir);
                    if (!stat.isDirectory()) {
                        return;
                    }
                    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
                    for (var i = 0; i < subpaths.length; ++i) {
                        if (subpaths[i][0] === '.') {
                            continue;
                        }
 
                        subpath = path.join(dir, subpaths[i]);
                        stat = fs.statSync(subpath);
                        if (stat.isDirectory()) {
                            if(subpaths[i] == "import" && this.isExportCompressImport){
                                continue;
                            }
                            if(subpaths[i] == "raw-assets" && this.isExportCompressRaw){
                                continue;
                            }
                            this._readDir(subpath, obj);
                        }
                        else if (stat.isFile()) {
                            // Size in Bytes
                            size = stat['size'];
                            let data =fs.readFileSync(subpath,'utf-8')
                            md5 = CryptoJS.MD5(data);
                            compressed = path.extname(subpath).toLowerCase() === '.zip';
                            relative = path.relative(packsrcpath, subpath);
                            relative = relative.replace(/\\/g, '/');
                            relative = encodeURI(relative);
                            obj[relative] = {
                                'size': size,
                                'md5': md5.toString(),
                            };
                            if (compressed) {
                                obj[relative].compressed = true;
                            }
                        }
                    }
                },

                _copyFolder(from, to) {        // 复制文件夹到指定目录
                    let files = [];
                    if (fs.existsSync(to)) {           // 文件是否存在 如果不存在则创建
                        files = fs.readdirSync(from);
                        files.forEach((file, index) =>{
                            var targetPath = from + "/" + file;
                            var toPath = to + '/' + file;
                            if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
                                this._copyFolder(targetPath, toPath);
                            } else {                                    // 拷贝文件
                                let readable = fs.createReadStream( targetPath );
                                // 创建写入流
                                writable = fs.createWriteStream( toPath );  
                                // 通过管道来传输流
                                readable.pipe( writable );
                                // fs.copyFileSync(targetPath, toPath);
                            }
                        });
                    } else {
                        fs.mkdirSync(to);
                        this._copyFolder(from, to);
                    }
                },
                _deleteFolder(path) {
                    var files = [];
                    if (fs.existsSync(path)) {
                        if (fs.statSync(path).isDirectory()) {
                            files = fs.readdirSync(path);
                            files.forEach((file, index) =>{
                                var curPath = path + "/" + file;
                                if (fs.statSync(curPath).isDirectory()) {
                                    this._deleteFolder(curPath);
                                } else {
                                    fs.unlinkSync(curPath);
                                }
                            });
                            fs.rmdirSync(path);
                        } else {
                            fs.unlinkSync(path);
                        }
                    }
                },
            },
        });
    },

    messages: {
        'hot-update:hello'(event) {
        }
    }
});