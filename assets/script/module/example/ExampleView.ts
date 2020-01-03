import { MVC } from "../../framework/MVC";
import { DefaultTransition } from "../../framework/transition/DefaultTransition";
import { Log } from "../../framework/Log";
import { Time } from "../../framework/manager/Time";
import { testViewUI } from "../uiGen/testViewUI";
import { GameUtil } from "../../util/GameUtil";
import { NetNode } from "../../framework/network/NetNode";
import { WebSock } from "../../framework/network/WebSock";
import { DefStringProtocol } from "../../framework/network/NetInterface";
import { NetManager } from "../../framework/network/NetManager";
import { testPackage } from "../../proto/proto";


export class ExampleView extends MVC.BaseView {
    public constructor() {
        super("ui/example/testView", MVC.eUILayer.Panel, MVC.eUIQueue.None, new DefaultTransition());
    }
    private _ui: testViewUI;
    protected onLoad(): void {
        this._ui = new testViewUI(this.node);
        this._ui.button.audioId = 107;
        GameUtil.setListener(this._ui.button.node, this.onClick, this);
        GameUtil.setListener(this._ui.testnet.node, this.onTest, this);
    }

    protected onUnLoad(): void {

    }

    protected changeListener(enable: boolean): void {

    }

    protected onOpen(): void {
        super.onOpen();
        // Time.delay(2, this.close, null, this);
    }
    public close() {
        super.close();
    }
    public onClose(): void {
        super.onClose();
    }

    public onShowFinish(): void {
        super.onShowFinish();
    }

    public onHideFinish(): void {
        super.onHideFinish();
    }

    public onClick() {
        let Node = new NetNode();
        Node.init(new WebSock(), new DefStringProtocol());
        NetManager.getInstance.setNetNode(Node);
        NetManager.getInstance.setResponseHandler(0, this.onrece, this);
        NetManager.getInstance.connect({ url: 'ws://192.168.40.106:8080' });
    }
    public onTest() {
        let msg = testPackage.Test.create({ name: 'haha' });
        let buffer = testPackage.Test.encode(msg).finish();
        NetManager.getInstance.send(buffer);
    }

    public onrece(cmd, msg) {
        Log.log('rec', cmd, msg);
        console.log('typeof', typeof msg);
        if (typeof msg != 'string') {
            // let udata = new Uint8Array(msg);
            Log.log(JSON.stringify(msg));
            let msg1 = testPackage.Test.decode(msg);
            Log.log(msg1.name);
        }
    }
}
