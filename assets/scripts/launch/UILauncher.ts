import { UIManager } from "../manager/UIManager";
import { MVC } from "../framework/MVC";
import { Manager } from "../manager/Manager";

export class UILauncher {
    public constructor() {
        UIManager.Init();
        // MVC.ViewHandler.initAssetHandler(
        //     Manager.loader.loadRes.bind(Manager.loader),
        //     Manager.loader.releaseAsset.bind(Manager.loader),
        // )
    }
}