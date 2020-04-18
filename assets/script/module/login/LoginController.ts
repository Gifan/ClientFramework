import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import LoginModel from "./LoginModel";
import { Const } from "../../config/Const";
import { NotifyID } from "../../framework/notify/NotifyID";

/*
 * desc
 */
export class LoginController extends MVC.MController<LoginModel> {
    public constructor() {
        super();
        this.setup(LoginModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "LoginController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.Login_Start, this.onLoginStart, this);
        Notifier.changeListener(enable, ListenID.Login_Finish, this.onLoginFinish, this);
    }

    private onLoginStart(): void {

    }

    private onLoginFinish(): void {
        cc.director.loadScene(Const.GAME_SCENENAME, () => {
            
        });
    }
}

