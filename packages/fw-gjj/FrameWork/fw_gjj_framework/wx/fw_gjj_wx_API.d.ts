declare module wx {

    export function login(...temp);
    export function getUserInfo(...temp);
    export function onShow(...temp);
    export function offShow(...temp);
    export function onHide(...temp);
    export function setUserCloudStorage(...temp);
    export function shareAppMessage(...temp);
    export function showShareMenu(...temp);
    export function onShareAppMessage(...temp);
    export function getLaunchOptionsSync(...temp);
    export function openCustomerServiceConversation(...temp);
    export function setClipboardData(...temp);
    export function postMessage(...temp);
    export function createInnerAudioContext(...temp);
    export function navigateToMiniProgram(...temp);
    export function previewImage(...temp);
    export function updateShareMenu(...temp);
    export function getUpdateManager(...temp);
    export function getSetting(...temp);
    export function createUserInfoButton(...temp);
    export function getShareInfo(...temp);

    /** 获取系统信息 */
    export function getSystemInfo(...temp): void;
    /** wx.getSystemInfo 的同步版本 */
    export function getSystemInfoSync(): SystemInfo;
    /**
    * 监听加速度数据事件 
    */
    export function onAccelerometerChange(callback: (res: { x: number, y: number, z: number }) => void);
    /**
    * 开始监听加速度数据 
    */
    export function startAccelerometer(obj: { interval?: string, success?: Function, fail?: Function, complete?: Function });
    /**
    * 停止监听加速度数据 
    */
    export function stopAccelerometer(obj: { success?: Function, fail?: Function, complete?: Function });
    interface SystemInfo {
        /** 手机品牌 (最低版本:1.5.0) */
        brand: string;
        /** 手机型号 */
        model: string;
        /** 设备像素比 */
        pixelRatio: number;
        /** 屏幕宽度 (最低版本:1.1.0) */
        screenWidth: number;
        /** 屏幕高度 (最低版本:1.1.0) */
        screenHeight: number;
        /** 可使用窗口宽度 */
        windowWidth: number;
        /** 可使用窗口高度 */
        windowHeight: number;
        /** 状态栏的高度 (最低版本:1.9.0) */
        statusBarHeight: number;
        /** 微信设置的语言 */
        language: string;
        /** 微信版本号 */
        version: string;
        /** 操作系统版本 */
        system: string;
        /** 客户端平台 */
        platform: string;
        /** 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。 (最低版本:1.5.0) */
        fontSizeSetting: number;
        /** 客户端基础库版本 (最低版本:1.1.0) */
        SDKVersion: string;
        /** (仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50) (最低版本:1.8.0) */
        benchmarkLevel: number;
    }

    interface WxShowEvent {
        /** 实机测试结果 eg. 1545978964122 */
        clickTimestamp: number;
        /** 实机测试结果 eg. 2 */
        prescene: number;
        /** 实机测试结果 eg. "4662289170@chatroom:wxid_bem9376ugyc522" */
        prescene_note: string;
        /** 查询参数 eg. { openid: "xxxx", bms: "xxxx" } */
        query: { [key: string]: string };
        /** 实机测试结果 eg. "?openid=xxxx&bms=xxxx" */
        rawPath: string;
        /** 当场景为由从另一个小程序或公众号或App打开时，返回此字段 eg. {} */
        referrerInfo: {
            /** 来源小程序或公众号或App的 appId */
            appId: string;
            /** 来源小程序传过来的数据，scene=1037或1038时支持 */
            extraData: { [key: string]: any };
        }
        /** 实机测试结果 eg. true */
        reLaunch: boolean;
        /** 实机测试结果 eg. "" */
        referpagepath: string;
        /** 实机测试结果 eg. true */
        relaunch: boolean;
        /** 场景值 eg. 1044 */
        scene: number;
        /** 实机测试结果 eg. "1_wx72643ce972b5be25_1907165885_1545978952_0" */
        scene_note: string;
        /** 实机测试结果 eg. "SessionId@138764291#1545978963971" */
        sessionId: string;
        /** shareTicket eg. "c0269448-cfde-4e69-8c9e-2b8b7364247f" | "<Undefined>" */
        shareTicket: string;
        /** 实机测试结果 eg. 2 */
        usedState: number;
    }
    interface WxLaunchOpton {
        /** 实机测试结果 eg. 0 */
        landing: number;
        /** 查询参数 eg. { openid: "xxxx", bms: "xxxx" } */
        query: { [key: string]: string };
        /** 当场景为由从另一个小程序或公众号或App打开时，返回此字段 eg. {} */
        referrerInfo: {
            /** 来源小程序或公众号或App的 appId */
            appId: string;
            /** 来源小程序传过来的数据，scene=1037或1038时支持 */
            extraData: { [key: string]: any };
        }
        /** 场景值 eg. 1089 */
        scene: number;
        /** shareTicket eg. "c0269448-cfde-4e69-8c9e-2b8b7364247f" | "<Undefined>" */
        shareTicket: string;
    }

    /** 创建打开意见反馈页面的按钮 */
    export function createFeedbackButton(option: CreateFeedbackButtonOption);
    interface CreateFeedbackButtonOption {
        /** 按钮的类型 */
        type: CreateFeedbackButtonType;
        /** 按钮上的文本，仅当 type 为 text 时有效 */
        text?: string;
        /** 按钮的背景图片，仅当 type 为 image 时有效 */
        image?: string;
        /** 按钮的样式 */
        style: CreateFeedbackButtonStyle;
    }
    type CreateFeedbackButtonType =
        /** 可以设置背景色和文本的按钮 */
        'text'
        |
        /** 只能设置背景贴图的按钮，背景贴图会直接拉伸到按钮的宽高 */
        'image'
    interface CreateFeedbackButtonStyle {
        /** 左上角横坐标 */
        left: number;
        /** 左上角纵坐标 */
        top: number;
        /** 宽度 */
        width: number;
        /** 高度 */
        height: number;
        /** 背景颜色 */
        backgroundColor?: string;
        /** 边框颜色 */
        borderColor?: string;
        /** 边框宽度 */
        borderWidth?: number;
        /** 边框圆角 */
        borderRadius?: number;
        /** 文本的水平居中方式 */
        textAlign?: string;
        /** 字号 */
        fontSize?: number;
        /** 文本的行高 */
        lineHeight?: number;
        color?: string;
    }

    //#region [rander]
    export function createImage(...temp);
    export function createCanvas(): Canvas;

    //#endregion [rander]

    //#region [WebSocket]

    /** 创建一个 WebSocket 连接。最多同时存在 5 个 WebSocket 连接。
     * @param object.url 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名	
     * @param object.header HTTP Header，Header 中不能设置 Referer	
     * @param object.method 有效值：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT	
     * @param object.protocol 子协议数组	
     * @param object.success 接口调用成功的回调函数	
     * @param object.fail 接口调用失败的回调函数	
     * @param object.complete 接口调用结束的回调函数（调用成功、失败都会执行）
     * @returns 每次成功调用 wx.connectSocket 会返回一个新的 SocketTask。
     * @example
     * . wx.connectSocket({
     * .     url: 'wss://example.qq.com',
     * .     data: {
     * .         x: '',
     * .         y: ''
     * .     },
     * .     header: {
     * .         'content-type': 'application/json'
     * .     },
     * .     protocols: ['protocol1'],
     * .     method: "GET"
     * . })
     */
    export function connectSocket(object: {
        url: string,
        header: Object,
        method: string = GET,
        protocols: Array<string>,
        success?: function,
        fail?: function,
        complete?: function,
    }): SocketTask;

    /** 通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
     * @param object.data 需要发送的内容	
     * @param object.success 接口调用成功的回调函数	
     * @param object.fail 接口调用失败的回调函数	
     * @param object.complete 接口调用结束的回调函数（调用成功、失败都会执行）
     * @example
     * . var socketOpen = false
     * . var socketMsgQueue = []
     * . wx.connectSocket({
     * .     url: 'test.php'
     * . })
     * . wx.onSocketOpen(function (res) {
     * .     socketOpen = true
     * .     for (var i = 0; i < socketMsgQueue.length; i++) {
     * .         sendSocketMessage(socketMsgQueue[i])
     * .     }
     * .     socketMsgQueue = []
     * . })
     * . function sendSocketMessage(msg) {
     * .     if (socketOpen) {
     * .         wx.sendSocketMessage({
     * .             data: msg
     * .         })
     * .     } else {
     * .         socketMsgQueue.push(msg)
     * .     }
     * . }
     */
    export function sendSocketMessage(object: {
        data: string | ArrayBuffer,
        success?: function,
        fail?: function,
        complete?: function,
    }): void;

    /** 关闭 WeSocket 连接
     * @param object.code 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。	
     * @param object.reason 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本。	
     * @param object.success 接口调用成功的回调函数	
     * @param object.fail 接口调用失败的回调函数	
     * @param object.complete 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    export function closeSocket(object: {
        code: number = 1000,
        reason: string,
        success?: function,
        fail?: function,
        complete?: function,
    }): void;

    /** 监听WebSocket 连接打开事件
     * @param callback 监听事件的回调函数
     * @param callback.res.header 连接成功的 HTTP 响应 Header
     * @example
     * . wx.connectSocket({
     * .     url: 'test.php'
     * . })
     * . wx.onSocketOpen(function (res) {
     * .     console.log('WebSocket连接已打开！')
     * . })
     */
    export function onSocketOpen(callback: (res: { header: object }) => void): void;

    /** 监听WebSocket 接受到服务器的消息事件
     * @param callback 监听事件的回调函数
     * @param callback.res.data 服务器返回的消息
     * @example
     * . wx.connectSocket({
     * .     url: 'test.php'
     * . })
     * . 
     * . wx.onSocketMessage(function (res) {
     * .     console.log('收到服务器内容：' + res.data)
     * . })
     */
    export function onSocketMessage(callback: (res: { data: string | ArrayBuffer }) => void): void;

    /** 监听WebSocket 连接关闭事件
     * @param callback 监听事件的回调函数
     * @returns 返回一个 SocketTask。基础库 1.7.0 开始支持，低版本需做兼容处理
     * @example
     * . wx.connectSocket({
     * .     url: 'test.php'
     * . })
     * . 
     * . //注意这里有时序问题，
     * . //如果 wx.connectSocket 还没回调 wx.onSocketOpen，而先调用 wx.closeSocket，那么就做不到关闭 WebSocket 的目的。
     * . //必须在 WebSocket 打开期间调用 wx.closeSocket 才能关闭。
     * . wx.onSocketOpen(function () {
     * .     wx.closeSocket()
     * . })
     * . 
     * . wx.onSocketClose(function (res) {
     * .     console.log('WebSocket 已关闭！')
     * . })
     */
    export function onSocketClose(callback: (res) => void): SocketTask;

    /** 监听WebSocket 错误事件
     * @param callback 监听事件的回调函数
     * @example
     * . wx.connectSocket({
     * .     url: 'test.php'
     * . })
     * . wx.onSocketOpen(function (res) {
     * .     console.log('WebSocket连接已打开！')
     * . })
     * . wx.onSocketError(function (res) {
     * .     console.log('WebSocket连接打开失败，请检查！')
     * . })
     */
    export function onSocketError(callback: (res) => void): void;

    /** WebSocket 任务，可通过 wx.connectSocket() 接口创建返回 */
    export class SocketTask {
        /** 通过 WebSocket 连接发送数据
         * @param object.data 需要发送的内容	
         * @param object.success 接口调用成功的回调函数	
         * @param object.fail 接口调用失败的回调函数	
         * @param object.complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        send(object: {
            data: string | ArrayBuffer,
            success?: function,
            fail?: function,
            complete?: function,
        }): void;

        /** 关闭 WebSocket 连接
         * @param object.code 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）	
         * @param object.reason 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）	
         * @param object.success 接口调用成功的回调函数	
         * @param object.fail 接口调用失败的回调函数	
         * @param object.complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        close(object: {
            code?: number,
            reason?: string,
            success?: function,
            fail?: function,
            complete?: function,
        }): void;

        /** 监听WebSocket 连接打开事件
         * @param callback 监听事件的回调函数
         * @param callback.res.header 连接成功的 HTTP 响应 Header
         */
        onOpen(callback: (res: { header: object }) => void): void;

        /** 监听WebSocket 连接关闭事件
         * @param callback 监听事件的回调函数
         */
        onClose(callback: () => void): void;

        /** 监听WebSocket 接受到服务器的消息事件
         * @param callback 监听事件的回调函数
         */
        onMessage(callback: () => void): void;

        /** 监听WebSocket 错误事件
         * @param callback 监听事件的回调函数
         */
        onError(callback: () => void): void;
    }

    //#endregion [WebSocket]

    //#region [media][audio]

    export function createInnerAudioContext(): InnerAudioContext;

    //#endregion [media][audio]

    //#region [ad]

    /** 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。
     * @version 基础库 2.0.4 开始支持，低版本需做兼容处理。
     * @returns banner 广告组件
     */
    export function createBannerAd(object: BannerAd.create_object): BannerAd;

    /** banner 广告组件。banner 广告组件是一个原生组件，层级比上屏 Canvas 高，会覆盖在上屏 Canvas 上。banner 广告组件默认是隐藏的，需要调用 BannerAd.show() 将其显示。banner 广告会根据开发者设置的宽度进行等比缩放，缩放后的尺寸将通过 BannerAd.onResize() 事件中提供。 */
    interface BannerAd {
        /** banner 广告组件的样式 */
        style: BannerAd.Style
        /** 显示 banner 广告。
         * @returns banner 广告显示操作的结果
         */
        show(): Promise<any>;
        /** 隐藏 banner 广告 */
        hide();
        /** 销毁 banner 广告 */
        destroy();
        /** 监听 banner 广告尺寸变化事件
         * @param callback banner 广告尺寸变化事件的回调函数
         */
        onResize(callback: fw.cb1<BannerAd.onResize_res>): void;
        /** 取消监听 banner 广告尺寸变化事件
         * @param callback banner 广告尺寸变化事件的回调函数
         */
        offResize(callback: fw.cb1<BannerAd.onResize_res>): void;
        /** 监听 banner 广告加载事件
         * @param callback banner 广告加载事件的回调函数
         */
        onLoad(callback: fw.cb): void;
        /** 取消监听 banner 广告加载事件
         * @param callback banner 广告加载事件的回调函数
         */
        offLoad(callback: fw.cb): void;
        /** 监听 banner 广告错误事件
         * @param callback banner 广告错误事件的回调函数
         */
        onError(callback: fw.cb1<BannerAd.onError_res>): void;
        /** 取消监听 banner 广告错误事件
         * @param callback banner 广告错误事件的回调函数
         */
        offError(callback: fw.cb1<BannerAd.onError_res>): void;
    }
    namespace BannerAd {
        /** 参数 (创建 banner 广告组件) */
        interface create_object {
            /** 广告单元 id */
            adUnitId: string;
            /** banner 广告组件的样式 */
            style?: create_style;
        }
        /** 参数 (创建 banner 广告组件的样式) */
        interface create_style {
            /** banner 广告组件的左上角横坐标 */
            left?: number;
            /** banner 广告组件的左上角纵坐标 */
            top?: number;
            /** banner 广告组件的宽度 */
            width?: number;
            /** banner 广告组件的高度 */
            height?: number;
        }
        /** banner 广告组件的样式。style 上的属性的值仅为开发者设置的值，banner 广告会根据开发者设置的宽度进行等比缩放，缩放后的真实尺寸需要通过 BannerAd.onResize() 事件获得。 */
        interface Style {
            /** banner 广告组件的左上角横坐标 */
            left: number
            /** banner 广告组件的左上角纵坐标 */
            top: number
            /** banner 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 wx.getSystemInfoSync() 获取）。 */
            width: number
            /** banner 广告组件的高度 */
            height: number
            /** banner 广告组件经过缩放后真实的宽度 */
            realWidth: number
            /** banner 广告组件经过缩放后真实的高度 */
            realHeight: number
        }
        /** 参数 (banner 广告尺寸变化事件的回调函数) */
        interface onResize_res {
            /** 缩放后的宽度 */
            width: number;
            /** 缩放后的高度 */
            height: number;
        }
        /** 参数 (banner 广告错误事件的回调函数) */
        interface onError_res {
            /** 错误信息 */
            errMsg: string;
            /** 错误码
             * @version 2.2.2
             */
            errCode: ErrCode;
        }
        /** banner 广告错误事件 errCode 的合法值 */
        type ErrCode =
            /** 后端接口调用失败 */
            1000 |
            /** 参数错误 */
            1001 |
            /** 广告单元无效 */
            1002 |
            /** 内部错误 */
            1003 |
            /** 无合适的广告 */
            1004 |
            /** 广告组件审核中 */
            1005 |
            /** 广告组件被驳回 */
            1006 |
            /** 广告组件被封禁 */
            1007 |
            /** 广告单元已关闭 */
            1008;

    }

    /** 创建激励视频广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。
     * @version 基础库 2.0.4 开始支持，低版本需做兼容处理。
     * @returns 
     */
    export function createRewardedVideoAd(object: RewardedVideoAd.create_object): RewardedVideoAd;

    /** 激励视频广告组件。激励视频广告组件是一个原生组件，并且是一个全局单例。层级比上屏 Canvas 高，会覆盖在上屏 Canvas 上。激励视频 广告组件默认是隐藏的，需要调用 RewardedVideoAd.show() 将其显示。 */
    interface RewardedVideoAd {
        /** 隐藏激励视频广告
         * @returns 激励视频广告加载数据的结果
         */
        load(): Promise<any>;

        /** 显示激励视频广告。激励视频广告将从屏幕下方推入。
         * @returns 激励视频广告显示操作的结果
         */
        show(): Promise<any>;

        /** 监听激励视频广告加载事件
         * @param callback 激励视频广告加载事件的回调函数
         */
        onLoad(callback: fw.cb): void;

        /** 取消监听激励视频广告加载事件
         * @param callback 激励视频广告加载事件的回调函数
         */
        offLoad(callback: fw.cb): void;

        /** 监听激励视频错误事件
         * @param callback 激励视频错误事件的回调函数
         */
        onError(callback: fw.cb1<onError_res>): void;

        /** 取消监听激励视频错误事件
         * @param callback 激励视频错误事件的回调函数
         */
        offError(callback: fw.cb1<onError_res>): void;

        /** 监听用户点击 关闭广告 按钮的事件
         * @param callback 用户点击 关闭广告 按钮的事件的回调函数
         */
        onClose(callback: fw.cb1<onClose_res>): void;

        /** 取消监听用户点击 关闭广告 按钮的事件
         * @param callback 用户点击 关闭广告 按钮的事件的回调函数
         */
        offClose(callback: fw.cb1<onClose_res>): void;
    }
    namespace RewardedVideoAd {
        /** 参数 (创建激励视频广告组件) */
        interface create_object {
            /** 广告单元 id */
            adUnitId: string;
        }
        /** 参数 (用户点击 关闭广告 按钮的事件的回调函数) */
        interface onClose_res {
            /** 视频是否是在用户完整观看的情况下被关闭的
             * @version 2.1.0
             */
            isEnded: boolean;
        }
        /** 参数 (激励视频错误事件的回调函数) */
        interface onError_res {
            /** 错误信息 */
            errMsg: string;
            /** 错误码
             * @version 2.2.2
             */
            errCode: ErrCode;
        }
        /** 激励视频广告错误事件 errCode 的合法值 */
        type ErrCode =
            /** 后端接口调用失败 */
            1000 |
            /** 参数错误 */
            1001 |
            /** 广告单元无效 */
            1002 |
            /** 内部错误 */
            1003 |
            /** 无合适的广告 */
            1004 |
            /** 广告组件审核中 */
            1005 |
            /** 广告组件被驳回 */
            1006 |
            /** 广告组件被封禁 */
            1007 |
            /** 广告单元已关闭 */
            1008;

    }

    export function createInterstitialAd(Object: InterstitialAd.create_object): InterstitialAd;

    namespace InterstitialAd {
        /** 参数 (创建插屏广告组件) */
        interface create_object {
            /** 广告单元 id */
            adUnitId: string;
        }
    }

    //#endregion [ad]
}

//#region [rander]

/** 画布对象 */
declare class Canvas {
    /** 画布的宽度 */
    width: number;

    /** 画布的高度 */
    height: number;

    /** 将当前 Canvas 保存为一个临时文件，并生成相应的临时文件路径。 */
    toTempFilePath(object: Object): string;

    /** 获取画布对象的绘图上下文 */
    getContext(contextType: '2d', contextAttributes?: Object): CanvasRenderingContext2D;
    getContext(contextType: 'webgl', contextAttributes?: Object): WebGLRenderingContext;

    /** 把画布上的绘制内容以一个 data URI 的格式返回 */
    toDataURL(): string;

    toTempFilePathSync(...temp);
}
/** 通过 Canvas.getContext('2d') 接口可以获取 CanvasRenderingContext2D 对象。CanvasRenderingContext2D 实现了 HTML Canvas 2D Context 定义的大部分属性、方法。通过 Canvas.getContext('webgl') 接口可以获取 WebGLRenderingContext 对象。 WebGLRenderingContext 实现了 WebGL 1.0 定义的所有属性、方法、常量。 */
declare class RenderingContext extends CanvasRenderingContext2D { }

declare class WebGLRenderingContext extends WebGLRenderingContext {
    /** WebGL 的纹理类型枚举值 */
    texture: number;
    /** 需要绑定为 Texture 的 Canvas */
    canvas: Canvas;
    /** 支持版本 >= 2.0.0 : 将一个 Canvas 对应的 Texture 绑定到 WebGL 上下文。 
     * 
     * @example
     * //示例代码
     * //使用 wxBindCanvasTexture
     * gl.wxBindCanvasTexture(gl.TEXTURE_2D, canvas)
     * //等同于
     * const texture = gl.createTexture()
     * gl.bindTexture(gl.TEXTURE_2D, texture)
     * ......
     * gl.texImage2D(target, level, internalformat, format, type, canvas)
    */
    wxBindCanvasTexture(texture: number, canvas: Canvas): void;
}

//#endregion [rander]

//#region [audio]

declare class InnerAudioContext {
    /** 音频资源的地址 */
    src: string
    /** 是否自动播放 */
    autoplay: boolean
    /** 是否循环播放 */
    loop: boolean
    /** 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音 */
    obeyMuteSwitch: boolean
    /** 当前音频的长度，单位 s。只有在当前有合法的 src 时返回 */
    duration: number
    /** 当前音频的播放位置，单位 s。只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位 */
    currentTime: number
    /** 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放 */
    paused: boolean
    /** 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲 */
    buffered: number
    /** 音量。范围 0~1。 */
    volume: number
    startTime: number
    /** 播放 */
    play()
    /** 暂停。暂停后的音频再播放会从暂停处开始播放 */
    pause()
    /** 停止。停止后的音频再播放会从头开始播放。 */
    stop()
    /** 跳转到指定位置，单位 s */
    seek(position: number)
    /** 销毁当前实例 */
    destroy()
    /** 监听音频进入可以播放状态的事件 */
    onCanplay(callback: function)
    /** 取消监听音频进入可以播放状态的事件 */
    offCanplay(callback: function)
    /** 监听音频播放事件 */
    onPlay(callback: function)
    /** 取消监听音频播放事件 */
    offPlay(callback: function)
    /** 监听音频暂停事件 */
    onPause(callback: function)
    /** 取消监听音频暂停事件 */
    offPause(callback: function)
    /** 监听音频停止事件 */
    onStop(callback: function)
    /** 取消监听音频停止事件 */
    offStop(callback: function)
    /** 监听音频自然播放至结束的事件 */
    onEnded(callback: function)
    /** 取消监听音频自然播放至结束的事件 */
    offEnded(callback: function)
    /** 监听音频播放进度更新事件 */
    onTimeUpdate(callback: function)
    /** 取消监听音频播放进度更新事件 */
    offTimeUpdate(callback: function)
    /** 监听音频播放错误事件 */
    onError(callback: function)
    /** 取消监听音频播放错误事件 */
    offError(callback: function)
    /** 监听音频加载中事件，当音频因为数据不足，需要停下来加载时会触发 */
    onWaiting(callback: function)
    /** 取消监听音频加载中事件，当音频因为数据不足，需要停下来加载时会触发 */
    offWaiting(callback: function)
    /** 监听音频进行跳转操作的事件 */
    onSeeking(callback: function)
    /** 取消监听音频进行跳转操作的事件 */
    offSeeking(callback: function)
    /** 监听音频完成跳转操作的事件 */
    onSeeked(callback: function)
    /** 取消监听音频完成跳转操作的事件 */
    offSeeked(callback: function)

}
/*
1.	offCanplay:ƒ (n)
2.	offEnded:ƒ (n)
3.	offError:ƒ (n)
4.	offPause:ƒ (n)
5.	offPlay:ƒ (n)
6.	offSeeked:ƒ (n)
7.	offSeeking:ƒ (n)
8.	offStop:ƒ (n)
9.	offWaiting:ƒ (n)

10.	onCanplay:ƒ (n)
11.	onEnded:ƒ (n)
12.	onError:ƒ (n)
13.	onPause:ƒ (n)
14.	onPlay:ƒ (n)
15.	onSeeked:ƒ (n)
16.	onSeeking:ƒ (n)
17.	onStop:ƒ (n)
18.	onWaiting:ƒ (n)

19.	autoplay:false
20.	buffered:0
21.	currentTime:0
22.	duration:0
23.	loop:false
24.	obeyMuteSwitch:true
25.	paused:true
26.	src:""
27.	startTime:0
28.	volume:1

** 音频资源的地址 *
src: string
** 是否自动播放 *
autoplay: boolean
** 是否循环播放 *
loop: boolean
** 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音 *
obeyMuteSwitch: boolean
** 当前音频的长度，单位 s。只有在当前有合法的 src 时返回 *
duration: number
** 当前音频的播放位置，单位 s。只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位 *
currentTime: number
** 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放 *
paused: boolean
** 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲 *
buffered: number
** 音量。范围 0~1。 *
volume: number

let ctx;
ctx = wx.createInnerAudioContext();

ctx.onCanplay(()=>console.log("onCanplay"));
ctx.onEnded(()=>console.log("onEnded"));
ctx.onError(()=>console.log("onError"));
ctx.onPause(()=>console.log("onPause"));
ctx.onPlay(()=>console.log("onPlay"));
ctx.onSeeked(()=>console.log("onSeeked"));
ctx.onSeeking(()=>console.log("onSeeking"));
ctx.onStop(()=>console.log("onStop"));
ctx.onWaiting(()=>console.log("onWaiting"));

ctx.src = "http://isure.stream.qqmusic.qq.com/C200004ZX0AQ49Bc8Y.m4a?guid=2000001544&vkey=4850496ECE335F3466C89F86E1D2DC26E46428F8D0E0AA8C7D0DAE2AD9DE2A87C0DDAD3610305D803ED1AF3BBE8266B82248EB2073B3604F&uin=&fromtag=50";
ctx.src = "http://isure.stream.qqmusic.qq.com/C200001jkRFY2velQF.m4a?guid=2000001544&vkey=7417C830623D755B998588481A9F27C971AB6BEA9C3F102A3D0D58C2D514D734B416D5D13A28A13F638E81F0088C8F2617B9DF3494DBAAD4&uin=&fromtag=50";

ctx.autoplay
ctx.buffered
ctx.currentTime
ctx.duration
ctx.loop
ctx.obeyMuteSwitch
ctx.paused
ctx.src
ctx.startTime
ctx.volume

*/

//#endregion [audio]
