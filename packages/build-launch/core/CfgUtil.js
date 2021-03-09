const FS = require('fire-fs');
const path = require('fire-path');
const electron = require('electron');
let self = module.exports = {
    cfgData: {
        isCompress : true,
    },
    setIsCompress(b) {
        this.cfgData.isCompress = b;
        this.saveConfig();
    },

    //
    saveConfig() {
        let configFilePath = self._getAppCfgPath();
        FS.writeFile(configFilePath, JSON.stringify(this.cfgData), function (error) {
            if (!error) {
                Editor.log("保存配置成功!");
            }
        }.bind(this));
    },
    cleanConfig() {
        FS.unlink(this._getAppCfgPath());
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
        return path.join(userDataPath, "build-launch" + tar + ".json");
    },
    initCfg(cb) {
        let configFilePath = this._getAppCfgPath();
        if (FS.existsSync(configFilePath)) {
            // Editor.log("cfg path: " + configFilePath);
            let data = FS.readFileSync(configFilePath, 'utf-8');
            let saveData = JSON.parse(data.toString());
            self.cfgData = saveData;
            if (cb) {
                cb(saveData);
            }
        } else {
            if (cb) {
                cb(null);
            }
        }
    }
};