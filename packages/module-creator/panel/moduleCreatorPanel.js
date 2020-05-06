'use strict';
//const Fs = require('fs');
const Fs = require('fire-fs');
const Path = require('fire-path');

const packageName = "module-creator";
let TemplateModel = Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/TemplateModel.txt', 'utf8')) + "";
let TemplateView = Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/TemplateView.txt', 'utf8')) + "";
let TemplateController = Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/TemplateController.txt', 'utf8')) + "";

function refreshPath(path) {
  let folderPath = path.substring(Editor.Project.path.length);
  let dbPath = "db:/" + folderPath.replace(/\\/g, '/');
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

function mkdirs(dirpath) {
  if (!Fs.existsSync(Path.dirname(dirpath))) {
    mkdirs(Path.dirname(dirpath));
  }
  if (!Fs.existsSync(dirpath)) {
    Fs.mkdirSync(dirpath);
    refreshPath(dirpath);
  }
}

function exportCode(module, useModel, useController, useView) {
  let folderPath = Path.join(Editor.Project.path, "assets/script/module/" + module.toLowerCase());
  Editor.log("exportCode", module, folderPath);
  mkdirs(folderPath);

  if (useModel) {
    let file = TemplateModel.replace(/@ModuleName/g, module);
    let filePath = Path.join(folderPath, module + "Model.ts");
    if (!Fs.existsSync(filePath)) {
      Fs.writeFileSync(filePath, file);
      refreshPath(filePath);
    }
  }

  if (useView) {
    let file = TemplateView.replace(/@ModuleName/g, module).replace(/@moduleName/g, module.toLowerCase());
    let filePath = Path.join(folderPath, module + "View.ts");
    if (!Fs.existsSync(filePath)) {
      Fs.writeFileSync(filePath, file);
      refreshPath(filePath);
    }
  }

  if (useController) {
    let file = TemplateController.replace(/@ModuleName/g, module);
    let filePath = Path.join(folderPath, module + "Controller.ts");
    if (!Fs.existsSync(filePath)) {
      Fs.writeFileSync(filePath, file);
      refreshPath(filePath);
    }
  }
}

var createVM = function (elem) {
  return new Vue({
    el: elem,
    data: {
      module: "",
      useModel: true,
      useController: true,
      useView: true,
    },
    watch: {
      resources() {
        this.refresh();
      },
    },
    methods: {
      onClickExport() {
        exportCode(this.module, this.useModel, this.useController, this.useView);
      },
    }
  });
};

Editor.Panel.extend({
  template: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/panel.html'), 'utf-8'),
  style: Fs.readFileSync(Editor.url('packages://' + packageName + '/panel/style.css'), 'utf-8'),

  $: {
    'warp': '#warp'
  },

  ready() {
    this.vm = createVM(this.$warp);
    // this.vm.refresh();
  }
});