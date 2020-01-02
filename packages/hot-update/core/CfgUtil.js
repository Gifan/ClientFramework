let fs = require('fire-fs');
let path = require('fire-path');
let electron = require('electron');
module.exports = {
    cfgData: {
                isExportLocal: false,//导出本地配置
                isExportRemote: false,//导出服务器配置
                isExportCompressImport: false,// 是否压缩import文件夹
                isExportCompressRaw: false,// 是否压缩raw-asstes文件夹
                packageSrcPath: null,// 更新包源路径
                packageDestPath: null,// 更新包目标路径
                remoteSavePath:null,    //服务器资源路径
                oldVersion:null,   //版本号
                newVersion:null,
    },
    initCfg(cb) {
        let configFilePath = this._getAppCfgPath();
        let b = fs.existsSync(configFilePath);
        if (b) {
            //console.log("cfg path: " + configFilePath);
            fs.readFile(configFilePath, 'utf-8', function (err, data) {
                if (!err) {
                    let saveData = JSON.parse(data.toString());
                    self.cfgData = saveData;
                    if (cb) {
                        cb(saveData);
                    }
                }
            }.bind(self));
        } else {
            if (cb) {
                cb(null);
            }
        }
    },
    saveCfgByData(data) {
        this.cfgData.isExportLocal = data.isExportLocal;
        this.cfgData.isExportRemote = data.isExportRemote;
        this.cfgData.isExportCompressImport = data.isExportCompressImport;
        this.cfgData.isExportCompressRaw = data.isExportCompressRaw;
        this.cfgData.packageSrcPath = data.packageSrcPath;
        this.cfgData.packageDestPath = data.packageDestPath;
        this.cfgData.remoteSavePath = data.remoteSavePath;
        this.cfgData.oldVersion = data.oldVersion;
        this.cfgData.newVersion = data.newVersion;
        this._save();
    },
    _save() {
        let savePath = this._getAppCfgPath();
        fs.writeFileSync(savePath, JSON.stringify(this.cfgData));
        //console.log("save ok!");
    },
    _getAppCfgPath() {
        let userDataPath = null;
        if (electron.remote) {
            userDataPath = electron.remote.app.getPath('userData');
        } else {
            userDataPath = electron.app.getPath('userData');
        }
        let tar = Editor.libraryPath;
        tar = tar.replace(/\\/g, '-');
        tar = tar.replace(/:/g, '-');
        tar = tar.replace(/\//g, '-');
        return path.join(userDataPath, "hot-update-" + tar + ".json");
    },
};