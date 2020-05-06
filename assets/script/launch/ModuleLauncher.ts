import { FuncController } from "../module/func/FuncController";
import { SettingController } from "../module/setting/SettingController";
import RemindController from "../module/tips/RemindController";
import { AdController } from "../module/ad/AdController";
import { EventController } from "../module/event/EventController";
import { LoginController } from "../module/login/LoginController";

export class ModuleLauncher{
    public constructor(){
        new FuncController();
        new LoginController();
        new SettingController();
        new EventController();
        new AdController();
        // new RemindController();
    }
    
}