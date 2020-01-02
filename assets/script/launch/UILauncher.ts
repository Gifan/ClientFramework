import { UIManager } from "../framework/manager/UIManager";
import { MVC } from "../framework/MVC";
import { Manager } from "../framework/manager/Manager";
import { Cfg } from "../config/Cfg";

export class UILauncher{
    public constructor(){
        UIManager.Init();
        MVC.ViewHandler.initAssetHandler(
            Manager.loader.loadAssetAsync.bind(Manager.loader),
            Manager.loader.unLoadAsset.bind(Manager.loader),
        )

        Cfg.Func.forEach(cfg => {
            UIManager.RegisterViewType(cfg.id, cfg.view);
        })
    }
}