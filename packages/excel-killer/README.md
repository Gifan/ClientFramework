# excel-killer
## 插件说明:
插件特色:
- 插件自动监测excel文件内容变化
- 自动容错处理
- excel转json
- excel转js
- excel转lua(后续支持)
- excel转csv(后续支持)

![](../../doc/excel-killer/scene.png)
## 插件打开方式
- 菜单:扩展/excel-killer
- 快捷键: Ctrl+Shift+J
## 格式转换说明
#### excel
##### 支持的格式:
- *.xlsx, *.xls
- [示例excel](../../doc/excel-killer/test.xlsx)
##### 内容格式如下
- 第1行: 字段的索引key,这个是不能重复的,想必这个肯定是常识吧!，name_1,name_2这样带_数字的格式将导出为数组
- 第2行: 字段的中文注释
- 第3行: 字段的导出目标: 包含有 c 字符的代表导出到client目标，包含有 s字符代表导出到Server目标，一个表格，前端后端公用 :)
- 第4行: 字段的导出类型，（ number,string,object,define ）?number类型前带问号表示改列内容可以不填
- 尽量不要出现空Sheet,当然插件会自动跳过该Sheet
- 尽量不要出现空行,空单元格,当然插件也做了这方面的优化,空单元格统一处理为空字符串,空行直接跳过
##### 水果sheet:fruit
|id	| fruit     | cost      |   num    	|
|编号	| 水果      | 价格    	|  数量  	|
|cs	| cs        | cs    	|  cs  		|
|number	| string    | number    |  number  	|
|1	| 香蕉      | 1      	|   5    	|
|2	| 苹果      | 1      	|   6   	|
|3	| 草莓      | 1      	|   7    	|
##### 人类sheet:man
|id	| name      | age       |
|编号	| 名字      | 年龄      |
|cs	| cs        | cs       	|
|number	| string    | number    |
|1	| 小明      | 10        |
|2	| 小红      | 20        |
|3	| 小蓝      | 30        |


#### 转换的js代码为
```javascript
module.export = {
        fruit: {
            1: {fruit: "香蕉", cost: 1, num: 5},
            2: {fruit: "苹果", cost: 1, num: 6},
            3: {fruit: "草莓", cost: 1, num: 7}
        },
        man: {
            1: {name: "小明", age: 10},
            2: {name: "小红", age: 20},
            3: {name: "小蓝", age: 30},
        }
    }
```
#### 转换的json文件为:
- 未合并的json
> fruit.json
```json
{
    "1": {"fruit": "香蕉", "cost": 1, "num": 5},
    "2": {"fruit": "苹果", "cost": 1, "num": 6},
    "3": {"fruit": "草莓", "cost": 1, "num": 7}
}
```
> man.json
```json
{
    "1": {"name": "小明", "age": 10},
    "2": {"name": "小红", "age": 20},
    "3": {"name": "小蓝", "age": 30}
}
```
- 合并后的json
```json
{
    "fruit": {
        "1": {"fruit": "香蕉", "cost": 1, "num": 5},
        "2": {"fruit": "苹果", "cost": 1, "num": 6},
        "3": {"fruit": "草莓", "cost": 1, "num": 7}
    },
    "man": {
        "1": {"name": "小明", "age": 10},
        "2": {"name": "小红", "age": 20},
        "3": {"name": "小蓝", "age": 30}
    }
}
```


## 使用说明:
### 配置-json
#### json存放路径:
> 插件自动指定路径,不能手动指定,生成的json配置会统一存放在该目录下

#### json格式化:
> 勾选该选项,生成的json文件将会格式化之后输出,例如:
```json
{
    "test":100
}
```
>未勾选该选项,生成的json将会是一行,例如:
```json
{"test":100}
```
从上边观察可以看出:
- 格式化后的json更容易查阅,但是文件体积比较大,适合开发的时候使用
- 未格式化的json文件体积比较小,但是不容易查阅,适合项目发布的时候使用
#### 合并所有Json:
- 未勾选该选项,每个excel的sheet会生成一个对应的json配置,因此,需要保证sheet不能出现重名
- 勾选该选项,所有的json配置将合并为一个json,因此,需要手动指定json配置的文件名

### 配置-JavaScript
#### js存放路径:
> 插件自动指定路径,不能手动指定,生成的js配置会统一存放在该目录下
#### js配置文件名
> 生成的js配置的文件的名字
#### 代码格式化
> 勾选该选项,生成的js文件将会格式化之后输出,例如:
```javascript
module.exports={
    test:"100"
}
```
> 未勾选该选项,生成的js文件将会是一行,例如:
```javascript
module.exports={test:"100"}
```
是否使用该选项,和上边的同理,视情况而定.
### 配置-Excel
### Excel文件路径:
> 需要手动指定自己的excel所存放的目录,插件会识别出来目录下的所有excle文件,因此允许目录嵌套的方式存放excel
### Excel列表
- 列表中罗列出来了目录下的所有excel的sheet
- 标题右侧 **sheet[x] excel[y]** 的意思是,目录下sheet一共x个,excel文件一共y个
- 每个sheet列表条目都有一个选中项,如果勾选,则会加入到生成队列中,反之不会被生成,默认全部选中

## 插件反馈
- 详细的说明文档:点击插件的[帮助按钮](https://github.com/tidys/CocosCreatorPlugins/tree/master/packages/excel-killer/README.md)直达
- 如果使用过程中遇到任何问题,欢迎点击[QQ交谈](http://wpa.qq.com/msgrd?v=3&uin=774177933&site=qq&menu=yes)给我留言




##  扩展支持了导出TypeScript文件，支持常量定义，支持数组类型

字段的导出类型，（ define, boolean, number, string, number[], string[], object, cc.Vec2 )
define一张表只能定义一列，用于导出常量声明
类型前带问号表示改列内容可以不填，比如：?string
为保证每行列数与表头一致，在最后一列为可选内容时，可以加入一列ce全部填1作为冗余信息，保证格式正确

同时导出Json和Ts时，ts将不包含数据，需要在使用前调用一次Cfg.initBySingleJson()来异步加载全部配置表
//导出合并
//await Cfg.initByMergeJson();
//导出单个json时
await Cfg.initBySingleJson();
//其他初始化行为

##推荐使用TS定义+Json数据的导出方式，方便热更数据表
导出的TS需要手动拷贝到asset/script/config/文件夹下
##当导出部分配置表时，生成的Cfg.ts文件是不齐全的，需要自己手动合并

##### 功能配置表sheet:Func
|id     | name     | define     | view    	  | unlock          | pic_1     | pic_2     | ce
|编号   | 名称      | 唯一定义    | 类名  	    | 解锁条件        | 展示图片   |           | 行尾
|cs	    | cs       | cs    	    | c  		  | cs	            | c	        | c	        | e
|number	| string   | ?define    | ?string  	  | ?object	        | ?string	| ?string   |
|1	    | 登录界面  | Login    	 | LoginView   | {"level":10}    | example1  | example2	 | 1
|2	    | 设置界面  | Setting  	 | SettingView |                 | example1  |           | 1

#### 转换的ts文件为:
declare interface FuncCfg extends IConfig {
	id:number;
	define?:string;
	name?:string;
	view?:string;
	unlock?:object;
	pics?:string[];
}

export const FuncDefine = {
    "Login": 1,
    "Setting": 2,
    "Affirm": 3
}

export class FuncCfgReader extends TConfig<FuncCfg> {
        public constructor() {
        super();
        this.initByMap({
            "1": {
                "id": 1,
                "define": "Login",
                "name": "登录界面",
                "view": "LoginView",
                "unlock": {
                    "level": 10
                },
                "pics": [
                    "example1",
                    "example2"
                ]
            },
            "2": {
                "id": 2,
                "define": "Setting",
                "name": "设置界面",
                "view": "SettingView",
                "pics": [
                    "example1"
                ]
            }
        });
    }
}



