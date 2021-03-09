/**
 * 内置资源打包插件
 */
'use strict';

const Path = require('fire-path');
const Fs = require('fire-fs');
const child_process = require("child_process");
const utils = require('./core/utils');
const CfgUtil = require('./core/CfgUtil');
let resPath = "";
let fileList = [];
let info = {
	isCompress: true,
}
const buildPlatform = {
	'baidugame': 1,
	'wechatgame': 1,
}
function getMd5ByUuidArray(buildResults, uuid) { // raw资源一个uuid有两个md5，例如mp3资源，这里要使用数组处理
	return [buildResults._md5Map[uuid], buildResults._nativeMd5Map[uuid]];
}

function getUuidFromPackedAssets(buildResults, uuid) {
	for (const key in buildResults._packedAssets) {
		if (buildResults._packedAssets.hasOwnProperty(key)) {
			const item = buildResults._packedAssets[key];
			for (let index = 0; index < item.length; index++) {
				const element = item[index];
				if (uuid === element) {
					return key;
				}
			}
		}
	}
}

function makeDir(dir) {
	if (!Fs.existsSync(dir)) {
		Fs.ensureDirSync(dir);
	}
}

function getFilePathArray(buildResults, resDir, uuid, md5Array) {
	let asset = buildResults._buildAssets[uuid];
	let pathArray = [];
	for (let index = 0; index < md5Array.length; index++) {
		const md5 = md5Array[index];
		if (md5) {
			let isRawAsset = md5 == buildResults._nativeMd5Map[uuid];
			let extension = isRawAsset ? asset.nativePath.split('.').pop() : 'json';
			let dir;
			if (extension.indexOf('ttf') != -1) { // ttf字体文件路径特殊处理
				dir = Path.join(resDir, 'raw-assets', uuid.substr(0, 2), `${uuid}.${md5}`);
				extension = asset.nativePath.split('/').pop();
				pathArray.push(Path.join(dir, extension));
			} else {
				dir = Path.join(resDir, isRawAsset ? 'raw-assets' : 'import', uuid.substr(0, 2));
				pathArray.push(Path.join(dir, `${uuid}.${md5}.${extension}`));
			}
			makeDir(dir);
		}
	}
	return pathArray;
}

function copyFile(src, dst) {
	if (!Fs.existsSync(dst)) {
		Fs.copySync(src, dst);
		// Editor.log(`copy file ${src} ---> ${dst}`);
	}
}

function onBeforeBuildStart(options, callback) {
	if (buildPlatform[options.actualPlatform]) {
		Fs.removeSync(Path.join(options.dest, 'res'));
		Fs.removeSync(Path.join(options.dest, 'res_internal'));
	}
	initPlugin();
	callback();
}

function onBeforeChangeFiles(options, callback) {
	if (info.isCompress) {
		resPath = options.dest + "/res/raw-assets";
		if (utils.checkIsExistProject(resPath)) {
			fileList = utils.loadPngFiles(5*1024);
			compressionPng(callback);
		} else {
			callback();
		}
	} else {
		callback();
	}
}

function onBuildFinish(options, callback) {
	Editor.log("当前构建平台", options.actualPlatform);
	let buildResults = options.buildResults;

	if (buildPlatform[options.actualPlatform] && !options.debug && options.md5Cache) {
		let uuidSet = new Set(); // 避免互相依赖

		function copyAssetByUuid(uuid) {
			let md5Array = getMd5ByUuidArray(buildResults, uuid);
			if (md5Array && md5Array.length > 0) {
				let srcArray = getFilePathArray(buildResults, Path.join(options.dest, 'res'), uuid, md5Array);
				let dstArray = getFilePathArray(buildResults, Path.join(options.dest, 'res_internal'), uuid, md5Array);
				for (let index = 0; index < srcArray.length; index++) {
					const src = srcArray[index];
					const dst = dstArray[index];
					copyFile(src, dst);
				}
			}
		}

		function copyAssets(uuids) {
			for (let i = 0; i < uuids.length; ++i) {
				let uuid = uuids[i];
				if (uuidSet.has(uuid)) continue;

				let asset = buildResults._buildAssets[uuid];
				if (asset && buildResults.getAssetType(uuid) != 'folder') {

					copyAssetByUuid(uuid);
					uuidSet.add(uuid);

					// 依赖数据
					let asset = buildResults._buildAssets[uuid];
					asset && asset.dependUuids && copyAssets(asset.dependUuids); // 递归依赖

					// 合并数据
					let packedUuid = getUuidFromPackedAssets(buildResults, uuid);
					packedUuid && copyAssetByUuid(packedUuid);
				}
			}
		}

		function queryAssets(dbPath) {
			Editor.assetdb.queryAssets(dbPath, null, (err, assetInfos) => {
				if (!err) {
					let array = assetInfos.map(x => x.uuid);
					copyAssets(array);
				}
			});
		}
		// 打包启动场景资源

		// 方法1：读路径 
		// queryAssets('db://assets/Scene/LaunchScene.fire');

		// 方法2：读配置
		var startSceneUuid = options.startScene;
		copyAssets([startSceneUuid]);

	}
	callback();
}


function compressionPng(callback) {
	Editor.success("pngquant start!")

	let index = 0;

	let url = ""
	if (cc.sys.os == "OS X") {
		url = 'packages://build-launch/tool/mac/pngquant';
	} else if (cc.sys.os == "Windows") {
		url = 'packages://build-launch/tool/windows/pngquant';
	};
	let pngquant_path = Editor.url(url);
	let cmd = pngquant_path + " --force --ext .png --quality=65-80";

	let item = fileList[index];

	let exe_cmd = cmd + ' ' + item.path;

	var totalSizeEX = 0;
	var totalSize = 0;

	function exec() {
		child_process.exec(exe_cmd, { timeout: 3654321 }, function (error, stdout, stderr) {
			if (stderr) {
				Editor.error("pngquant error : " + stderr);
				//return;
			}

			let file_path = item.path.replace(resPath, " ");
			let afterSize = getFileState(item.path).size;
			totalSizeEX = totalSizeEX + item.size;
			totalSize = totalSize + afterSize;
			Editor.log(`[${file_path}] 原始大小:${item.size} B,压缩后大小:${afterSize} B,压缩率:${(afterSize / item.size * 100).toFixed(2)}%`);

			if (index < fileList.length - 1) {
				index++;
				item = fileList[index];
				exe_cmd = cmd + ' ' + item.path;
				exec();
			} else {
				Editor.success("pngquant finished!");
				Editor.log(`压缩完成,原始总大小${(totalSizeEX / 1000).toFixed(2)}KB:, 压缩后总大小${(totalSize / 1000).toFixed(2)}KB:,总压缩率:${(totalSize / totalSizeEX * 100).toFixed(2)}% 总压缩文件数:${fileList.length}个`);
				callback && callback.call();
			}
		});
	}

	exec();
}

function getFileState(res_path) {
	return Fs.lstatSync(res_path);
}

function initPlugin() {
	CfgUtil.initCfg(function (data) {
		if (data) {
			info.isCompress = data.isCompress;
		}
	});
}

module.exports = {
	load() {
		// Editor.Builder.on('build-start', onBeforeBuildStart);
		// Editor.Builder.on('before-change-files', onBeforeChangeFiles);
		// Editor.Builder.on('build-finished', onBuildFinish);
	},

	unload() {
		// Editor.Builder.removeListener('build-start', onBeforeBuildStart);
		// Editor.Builder.removeListener('before-change-files', onBeforeChangeFiles);
		// Editor.Builder.removeListener('build-finished', onBuildFinish);
	},

	messages: {
		'build'() {
			Editor.log('内置资源打包插件');
		},
		'open'() {
            // open entry panel registered in package.json
            Editor.Panel.open('build-launch');
        },
	},
};