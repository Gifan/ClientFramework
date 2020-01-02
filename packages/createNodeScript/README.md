# ui-creator for Cocos Creator

Cocos Creator 编辑器扩展：PSD导出生成UIPrefab，Prefab生成对应结构TS代码

## 插件安装方法

请参考 [扩展编辑器:安装与分享](http://www.cocos.com/docs/creator/extension/install-and-share.html) 文档。

一般来说
推荐项目安装的方式，直接拷贝ui-creator到对应项目的packages文件夹下，重启编辑器即可

特殊步骤
1.安装Photoshop CS6，（其他版本应该也可以，但是我没有测试过 》_《）
2.将插件目录下photoshop文件夹下的全部脚本拷贝至“ps安装目录\Presets\Scripts”目录下，如：“C:\Program Files\Adobe\Adobe Photoshop CS6 (64 Bit)\Presets\Scripts”。注意先更新svn，如果脚本有修改，需要用最新的覆盖。

## 导出PSD文件信息

打开一个psd文件，在ps中选择“文件->脚本->Export Json”，导出成功后后弹出时间消耗统计
导出目录固定为“C:/PsdExport/”（未提供导出目录选择）。


## UI图片简单命名规范

功能前缀_模块_说明

如：btn_common_bule
表示通用的蓝色按钮
功能前缀必须是下面固定的单词，但是模块，说明可以接受拼音

功能前缀举例：
按钮：			btn_
单选框：		chk_
图片(小图)：	img_
图标：			icon_
图片文字：		txt_
背景（大图）：	bg_
进度条：		bar_



## Json信息生成Prefab

1.将美术切图导入项目文件夹，推荐目录"art/altas/模块名称"，设置好九宫格配置
2.从主菜单打开 ui-creator 面板： `扩展->ui-creator`。
3.输入当前模块图片所在文件夹
4.点击《生成预制件》按钮

## Prefab导出TS代码

1.将UI的Prefab拖入Scene中，并选中Prefab跟节点
2.点击《导出代码》按钮

格式说明
SettingUI@Setting       --@之前为导出TS名称，之后的为导出目录名称
    _bg_frame           --_下划线开头表示不导出
    btn_item=Array      --=Array表示导出为数组，属性名称 btn_items
    btn_item=Array
    ItemUI=Sub          --=Sub表示导出一个单独的TS文件对象
    node_xxx            --普通节点将按照挂载的脚本生成对象