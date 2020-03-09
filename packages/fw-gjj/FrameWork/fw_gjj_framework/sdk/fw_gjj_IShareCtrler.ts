export default interface IShareCtrler {
    shareWX():void;
    shareQQ():void;
    share(
        shareInfo: ShareInfo,
        onCpl?: (rsl: ShareResult) => void
    ): void;
    share(
        shareInfo: ShareInfo,
        customArg?: any,
        onCpl?: (rsl: ShareResult) => void
    ): void;
}
export interface ShareInfo {
    /** 设置转发标题，不传则默认使用当前小游戏的昵称 */
    title?: string;
    /** 设置转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径 */
    imageUrl?: string;
    /** 设置查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。最大长度 128 个字符，超过部分会被截断 */
    query?: string;
    /** 对象格式的参数 */
    queryObj?: { [key: string]: string | number | boolean };
}
export interface ShareResult {
    /** 分享是否成功 */
    iSuccess: boolean;
    /** 群信息, 如果有则不为空 */
    shareTicket?: string;
    /** 失败原因, 暂时未定义 */
    failCode?: number;
    /** 失败文案 */
    failReason?: string;
    /** 其他数据, 留作扩展 */
    data?: any;
}