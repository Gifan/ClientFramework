
'use strict';

//const Fs = require('fs');
const fs = require('fire-fs');
const Electron = require('electron');
var createVM = function (elem) {
    return new Vue({
        el: elem,
        data: {
            moudule: "",
            prefab:null,
        },
        watch: {
            resources() {
                this.refresh();
            },
        },
        methods: {
            onClickCreate() {
                let paths = {}               
                Editor.assetdb.queryUrlByUuid(this.prefab, function(err,result){
                    paths.moudule = result;
                    Editor.Scene.callSceneScript('createnodescript', 'create', paths, function (err, result) {
                    Editor.log(result);
                });
                })  
            },
            onChange(){
                Editor.log("onChange",this.prefab,Editor.assetdb.queryUrlByUuid(this.prefab, function(err,result){
                    Editor.log(result);
                }));
            },
            onBtnClickOpenSavePath(){
                let saveFileFullPath =  Editor.Project.path+"/assets/script/module/uiGen/";
                Editor.log("saveFileFullPath",saveFileFullPath,fs.existsSync(saveFileFullPath));
                if (fs.existsSync(saveFileFullPath)) {
                    Electron.shell.openItem(saveFileFullPath);
                    Electron.shell.beep();
                }
            }

        }
    });
};

Editor.Panel.extend({
    template: fs.readFileSync(Editor.url('packages://createNodeScript/panel/panel.html'), 'utf-8'),
    style: fs.readFileSync(Editor.url('packages://createNodeScript/panel/style.css'), 'utf-8'),

    $: {
        'warp': '#warp'
    },

    ready() {
        this.vm = createVM(this.$warp);
        this.vm.refresh();
    }
});