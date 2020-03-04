import ILoginCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_ILoginCtrler";
export default class VivoLoginCtrler implements ILoginCtrler {
    /** 登陆, 通过平台和bms获取到用户的唯一id
     * @param successCB 登陆成功回调
     * @param failCB 登陆失败回调
     */
    login(successCB: (data: any) => void, failCB?: (msg: string) => void) {
        /* 留待实现 */
    }
}