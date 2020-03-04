import IShareCtrler, { ShareInfo, ShareResult } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";

export default class QQPlayShareCtrler implements IShareCtrler {
    share(  shareInfo: ShareInfo,onCpl?: (rsl: ShareResult) => void
    ){
        this.shareToQQChat(shareInfo,onCpl);
    }
    shareToQQChat(shareInfo: ShareInfo, onCpl?: (res?: any) => void) {
        console.log("分享6");
        console.log("分享拓展字段字符串",shareInfo.query)
        console.log("分享拓展字段字符串2",JSON.stringify(shareInfo.query))
        let qqShareInfo  = {
            summary: shareInfo.title,          //QQ聊天消息标题
            picUrl:shareInfo.imageUrl,               //QQ聊天消息图片
            extendInfo:shareInfo.query?JSON.stringify(shareInfo.query):"",    //QQ聊天消息扩展字段
            localPicPath:"",   
            gameName:"游戏机不见了",       
        };
        console.log("QQ分享参数",qqShareInfo);
        console.log("分享成功回调",onCpl);
        BK.QQ.share(qqShareInfo, (retCode: number, shareDest: any, isFirstShare: boolean) => {
            console.log("[QQShareCtrler][shareToQQChat] cb", retCode, shareDest, isFirstShare);
            if(!onCpl)return;
            switch (retCode) {
                case 1: return onCpl({iSuccess: false,});
                case -1: case 2: return  onCpl({iSuccess: false,});
            }
            switch (shareDest) {
                case 0: return  onCpl({iSuccess: true,}); // BK.ShareDest.QQ:
                case 1: return  onCpl({iSuccess: false,}); // BK.ShareDest.QZone:
                case 2: return  onCpl({iSuccess: false,}); // BK.ShareDest.WX:
                case 3: return  onCpl({iSuccess: false,}); // BK.ShareDest.WXCircle:
                default: break;
            }
        });
    }

    // qqPlayshare(shareInfo: ShareInfo, onCpl?: (res?: any) => void, failCB?: (res?: any) => void) {
    //     var qqShareInfo: BK.ShareReturnInfo = {
    //         summary: shareInfo.title, //QQ聊天消息标题
    //         picUrl: shareInfo.imageUrl, //QQ聊天消息图片
    //         extendInfo: shareInfo.query, //QQ聊天消息扩展字段
    //     };

    //     BK.QQ.share(qqShareInfo, (retCode: number, shareDest: BK.ShareDest, isFirstShare: boolean) => {
    //         console.log("[QQShareCtrler][qqPlayshare] cb", retCode, shareDest, isFirstShare);
    //         switch (retCode) {
    //             case 1: return failCB && failCB("分享失败");
    //             case -1: case 2: return failCB && failCB("用户取消分享");
    //         }
    //         switch (shareDest) {
    //             case 0: return onCpl && onCpl({ iSuccess: true, });         // BK.ShareDest.QQ:
    //             case 1: return onCpl && onCpl("成功分享至QQ空间");     // BK.ShareDest.QZone:
    //             case 2: return onCpl && onCpl("成功分享至微信");       // BK.ShareDest.WX:
    //             case 3: return onCpl && onCpl("成功分享至微信朋友圈"); // BK.ShareDest.WXCircle:
    //             default: break;
    //         }
    //     });
    // }
}

//自定义跳转二维码url,开发者
//http://cmshow.qq.com/apollo/html/game-platform/scan-game.html?gameId=2911&src=220&gameParam=扩展参数
//跳转结果
//GameStatusInfo.gameParam = '{"data":"扩展参数"}'

//分享默认二维码url
//http://cmshow.qq.com/apollo/html/game-platform/scan-game.html?gameId=2911

//测试二维码url,decode
//http://cmshow.qq.com/start-apollo-game.html/?data={"gameId":2911,"roomId":0,"gameMode":8,"src":220,"extendInfo":""}
