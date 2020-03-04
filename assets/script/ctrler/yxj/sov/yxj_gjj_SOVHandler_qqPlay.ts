import SOVHandler_Base from "./yxj_gjj_SOVHandler";

export default class SOVHandler_QQPlay extends SOVHandler_Base {

    get isIpShield(): boolean { return true; };
    protected _maxVideoCount = 999;

    customShare(title: string, spfOrPath: string | cc.SpriteFrame | cc.Sprite, query?: PathObj, arg?: any) {
        // typeof spfOrPath === "string" ?
        //     1 : this.img2path2(spfOrPath);

        // this._qqShare_customConfig(title, spfOrPath._textureFilename, null, null, query, arg);

        // let shareInfo: any = {
        //     title: title,
        //     imageUrl: path,// spfOrPath._textureFilename,
        //     query: query,
        //     // query: query && fw.Util.objToPath(query),
        // };
        // console.log("开始游戏按钮节点",spfOrPath.node)
        // fw.sdk.share(shareInfo);
        this._qqShare_bmsConfig(null, null, query, arg);
    }


    img2path(spf: cc.SpriteFrame) {
        // console.log("[SOVHandler_qq][img2path]");
        // let image = spf.getTexture().getHtmlElementObj();
        // console.log("[SOVHandler_qq][img2path] image:", image);
        // let canvas = document.createElement("canvas");
        // console.log("[SOVHandler_qq][img2path] canvas:", canvas);
        // canvas.width = 500;
        // canvas.height = 500;
        // let ctx = canvas.getContext("2d");
        // console.log("[SOVHandler_qq][img2path] ctx:", ctx);
        // ctx.drawImage(image, 0, 0, 500, 500);
        // let tempFilePath = canvas.toTempFilePathSync({
        //     x: 0,
        //     y: 0,
        //     width: 500,
        //     height: 500,
        //     destWidth: 500,
        //     destHeight: 400
        // });
        // console.log("[SOVHandler_qq][img2path] path:", tempFilePath);
        // return tempFilePath;
    }

    commonShare(type?: string, query?: PathObj, arg?: any) {
        console.log("分享1");
        this._qqShare_bmsConfig(null, type, query, arg);
        // fw.sdk.share(null);
    }

    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        console.log("分享2");
        this._qqShare_bmsConfig(onCpl, type, query, arg);
    }

    private _qqShare_bmsConfig(onCpl?: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        // console.log("query.bms0",query)
        console.log("分享3");
        let config = this._getRandomConfig();
        if (!config) return onCpl && onCpl("素材还没准备好哦");
        if (!query) query = {};
        // console.log("随机获取来的分享信息",config)
        query.bms = config;
        // query.bms = JSON.stringify(config);
        // console.log("query.bms1",query)
        this._qqShare_customConfig(config.title, config.image, onCpl, type, query, arg);
        this._rq_BMS_SHARE_SHOW(config);

    }

    private _qqShare_customConfig(title: string, image: string, onCpl?: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        // console.log("query.bms2",query)
        console.log("分享4");
        if (!query) query = {};
        let shareInfo: any = {
            title: title,
            imageUrl: image,
            query: query,
            // query: query && fw.Util.objToPath(query),
        };
        fw.sdk.share(shareInfo, (rsl) => { onCpl && onCpl(rsl.iSuccess ? null : "要分享到好友聊天才有效哦") });
    }
}
