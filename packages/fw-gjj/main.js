'use strict';
let name = "fw-gjj";

module.exports = {
    messages: {
        'test'() { Editor.log('测试框架运行'); },
        'count-all-d'() { fileTypeToJson("allD.json", [".prefab", ".png", ".jpg", ".jpeg", ".mp3", ".wav"], false); },
        'count-all-a'() { fileTypeToJson("allA.json", [".prefab", ".png", ".jpg", ".jpeg", ".mp3", ".wav"], true); },
        'count-pfb-d'() { fileTypeToJson("pfbD.json", [".prefab"], false); },
        'count-pfb-a'() { fileTypeToJson("pfbA.json", [".prefab"], true); },
        'count-img-d'() { fileTypeToJson("imgD.json", [".png", ".jpg", ".jpeg"], false); },
        'count-img-a'() { fileTypeToJson("imgA.json", [".png", ".jpg", ".jpeg"], true); },
        'count-ado-d'() { fileTypeToJson("audioD.json", [".mp3", ".wav"], false); },
        'count-ado-a'() { fileTypeToJson("audioA.json", [".mp3", ".wav"], true); },
        'log-auto-bind-list'() { logAutoBindList(); },
        'active-all-node-awhile'() { activeAllNodeAwhile(); },
        'enable-retina-wx-193'() { enableRetinaWx193(); },
    },
};
//var exec = require('child_process').exec;
function logAutoBindList() {
    Editor.Scene.callSceneScript(
        name,
        'log-auto-bind-list',
        s => {
            Editor.log(s);
            //exec('echo "' + s + '" | clip');
        }
    );
}

function enableRetinaWx193() {
    if (!checkExist(Editor.Project.path + "/build/", "wechatgame"))
        return Editor.log("未找到微信打包目录:" + Editor.Project.path + "/build/wechatgame");

    let ss = fs.readdirSync(Editor.Project.path + "/build/wechatgame");
    let name;
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        if (s.indexOf("main.") === 0 && s.lastIndexOf(".js") === s.length - 3) {
            name = s;
            break;
        }
    }
    Editor.log("读取文件:" + Editor.Project.path + "/build/wechatgame/" + name);
    let txt = readTextFile(Editor.Project.path + "/build/wechatgame/", name);
    let loc = "cc.view.resizeWithBrowserSize(true);";
    let ins = "let systemInfo = wx.getSystemInfoSync(); if (systemInfo && systemInfo.platform === 'android') cc.view.enableRetina(true);";
    let rsl = insertTxt(txt, loc, ins);
    if (rsl.e) return Editor.log(rsl.e);
    if (!rsl.txt) return Editor.log("未知错误");
    buildTextFile(Editor.Project.path + "/build/wechatgame/", name, rsl.txt, true);
    Editor.log("微信包抗锯齿添加完成");
}

function insertTxt(org, loc, ins) {
    let index = org.indexOf(loc);
    if (index === -1) return { e: "未定位到位置" };
    if (org[index + loc.length] === ins[0]) return { e: "已经添加过相关内容" };
    return { txt: org.substr(0, index + loc.length) + ins + org.substr(index + loc.length, org.length - 1) };
}

function activeAllNodeAwhile() {
    Editor.Scene.callSceneScript(
        name,
        'active-all-node-awhile'
    );
}

//let fs = require("fs");
let path = require('path');

function checkFileTypeInRes(path, fileTypes, isArray, onEnd) {
    let a = [];
    checkDir(
        path,
        (dir, name) => {
            name = name.substring(0, name.lastIndexOf("."));
            dir = dir.replace(/\\/g, '/');
            dir = dir.substring(dir.indexOf("resources/") + 10, dir.length);
            if (dir[dir.length - 1] !== "/") dir += "/";
            isArray ?
                a.push('\n"' + dir + name + '"') :
                a.push('\n"' + name + '":"' + dir + '"');
        },
        () => onEnd && onEnd(a),
        fileTypes
    );
}

function fileTypeToJson(jsonName, fileTypes, isArray) {
    let path = Editor.Project.path + "/assets/resources";
    checkFileTypeInRes(path, fileTypes, isArray, (ss) => {
        path += "/fw_resList/";
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
            Editor.assetdb.refresh("db://assets/resources/fw_resList/");
        }
        buildTextFile(path, jsonName, isArray ? "[" + ss.join(",") + "\n]" : "{" + ss.join(",") + "\n}", true);
        Editor.assetdb.refresh("db://assets/resources/fw_resList/" + jsonName);
        Editor.log("更新成功");
    });
}

function checkDir(dir, onIsFile, onEnd, whiteExts, blackExts) {
    let names = fs.readdirSync(dir);
    for (let i = 0; i < names.length; i++) {
        let name = names[i], fullPath = path.join(dir, name);
        switch (checkDirType(fullPath, whiteExts, blackExts)) {
            case 0: continue;
            case 1: checkDir(fullPath, onIsFile, null, whiteExts, blackExts); break;
            case 2: onIsFile && onIsFile(dir, name); break;
        }
    }
    onEnd && onEnd();
}

function checkDirType(fullPath, whiteExts, blackExts) {
    let stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return 1;
    if (!stat.isFile()) return 0;

    let ext = path.extname(fullPath);
    if (whiteExts) {
        for (let i = 0; i < whiteExts.length; i++)
            if (ext === whiteExts[i]) return 2;
        return 0;
    }
    if (blackExts) for (let i = 0; i < blackExts.length; i++)
        if (ext === blackExts[i]) return 0;
    return 2;
}


//#region io

let fs = require("fs");
let http = require('https');

function buildDir(dir, name) {
    if (checkExist(dir, name)) return;
    dir += name;
    fs.mkdirSync(dir);
    Editor.log("创建目录:" + name);
}

function buildTextFile(dir, name, text, forceWrite, option) {
    if (checkExist(dir, name, forceWrite)) return;
    dir += name;
    fs.writeFileSync(dir, text, option);
    Editor.log("创建文件:" + name);
}

function copyFile(dir, name, toDir, toName, forceWrite) {
    if (!checkExist(dir, name)) return Editor.log(dir + " 目录不存在, 取消复制");
    if (checkExist(toDir, toName, forceWrite)) return Editor.log("取消复制");

    fs.createReadStream(dir + name).pipe(fs.createWriteStream(toDir + toName));
}

function downloadTextFile(url, dir, name, forceWrite) {
    if (checkExist(dir, name, forceWrite)) return Editor.log("取消下载");
    let s = "";
    http.get(url, res => {
        res.on('data', d => s += d);
        res.on('end', () => buildTextFile(dir, name, s, forceWrite));
    });
}

function checkExist(dir, name, isDelete) {
    dir += name;
    if (fs.existsSync(dir)) {
        if (isDelete) return fs.unlinkSync(dir), Editor.log("删除文件:" + name);
        else return true; // Editor.log(name + " 已存在"), true;
    }
}

function readTextFile(dir, name) {
    if (!fs.existsSync(dir + name)) return Editor.log("文件不存在无法读取");
    return fs.readFileSync(dir + name) + "";
}

function zipDir(dir, name, beZipDir, forceWrite) {
    if (checkExist(dir, name, forceWrite)) return Editor.log("取消压缩");

    let archiver;
    try {
        archiver = require('archiver');
        if (!archiver) throw new Error("archiver not a moudle");
    } catch (error) {
        Editor.error("未安装压缩模块, 打开系统命令行运行'npm install archiver --save', 待安装完成后再运行本指令")
        return;
    }
    dir += name;
    let output = fs.createWriteStream(dir);
    let archive = archiver('zip');
    archive.on('error', err => Editor.error(err));
    archive.pipe(output);
    archive.directory(beZipDir, false);
    archive.finalize();
    Editor.log("完成压缩:" + name);
}

function getTime() {
    return new Date().toLocaleString().replace(/:/g, "-").replace(/\//g, "-");
}

//#endregion io