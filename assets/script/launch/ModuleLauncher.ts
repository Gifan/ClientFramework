import { FuncController } from "../module/func/FuncController";
import { SettingController } from "../module/setting/SettingController";

export class ModuleLauncher{
    public constructor(){
        new FuncController();
        new SettingController();

        // let sov: SOVCtrler;
        // let screenTap: screenTapCtrler;
        // let redBag: RedBagCtrler;
        // try { sov = new SOVCtrler(); } catch (e) { console.error("[initCtrler][share]", e); }
        // try { screenTap = new screenTapCtrler(); } catch (e) { console.error("[initCtrler][screenTap]", e); }
        // try { redBag = new RedBagCtrler(); } catch (e) { console.error("[initCtrler][redBag]", e); }
        // let cls = { screenTap, sov, redBag };
        // fw["cls"] = cls as any;
    }
    
}