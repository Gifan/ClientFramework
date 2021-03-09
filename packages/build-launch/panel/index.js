var FS = require("fire-fs");
var PATH = require('fire-path');
var fse = require('fs-extra');
var rimraf = require('rimraf');
var Electron = require('electron');
var CfgUtil = Editor.require("packages://build-launch/core/CfgUtil");

Editor.Panel.extend({
    style: FS.readFileSync(Editor.url('packages://build-launch/panel/index.css', 'utf8')) + "",
    template: FS.readFileSync(Editor.url('packages://build-launch/panel/index.html', 'utf8')) + "",

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

        window.plugin = new window.Vue({
            el: this.shadowRoot,
            created() {
                this.initPlugin();
            },
            data: {
                logView : [],
                isCompress : true,
            },
            methods: {
                _addLog(str) {
                    let time = new Date();
                    this.logView += "[" + time.toLocaleString() + "]: " + str + "\n";
                    logListScrollToBottom();
                },
                _addLogNoTime(data) {
                    this.logView += data;
                    logListScrollToBottom();
                },

                initPlugin() {
                    CfgUtil.initCfg(function (data) {
                        if (data) {
                            this.isCompress = data.isCompress;
                        }
                    }.bind(this));
                },
                
                onLogViewMenu(event) {
                    Editor.log("onLogViewMenu");
                    Editor.Ipc.sendToMain('build-launch:popup-create-menu', event.x, event.y, null);
                },

                queryBuildOptions(a) {
                },

                onCompress() {
                    this.isCompress = !this.isCompress;
                    CfgUtil.setIsCompress(this.isCompress);
                    this._addLog('图片压缩选项: ' + this.isCompress);
                    // Editor.Ipc.sendToMain('build-setting:setFlagCompress', this.isCompress);
                },

                onSaveCfg() {
                },
            }
        })
    },

    // register your ipc messages here
    messages: {

    }
});
