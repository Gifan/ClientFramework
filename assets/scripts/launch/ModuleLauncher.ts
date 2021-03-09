import { SettingController } from "../module/setting/SettingController";
import { AdController } from "../module/ad/AdController";
import { LoginController } from "../module/login/LoginController";
import { CheatController } from "../module/cheat/CheatController";
import { PhysicsController } from "../module/physics/PhysicsController";
import { CurrencyController } from "../module/currency/CurrencyController";
import { EventController } from "../module/event/EventController";
import { LoadingController } from "../module/loading/LoadingController";
import { ScreenCapController } from "../module/screencap/ScreenCapController";
import { PowerController } from "../module/power/PowerController";

export class ModuleLauncher{
    public constructor(){
        new LoadingController();
        new EventController();
        new SettingController();
        new LoginController();
        new AdController();
        new PhysicsController();
        new CurrencyController();
        new PowerController();
        if(wonderSdk.isTest){
            new CheatController();
        }
        if (wonderSdk.isByteDance) {
            new ScreenCapController();
        }
    }
    
}