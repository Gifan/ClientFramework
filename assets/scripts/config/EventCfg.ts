import { TConfig } from "./TConfig";


export interface EventCfg extends IConfig {id:number;define?:string;name:string;desc:string;}

export const EventDefine = {
    "home_skinbutton": 1,
    "home_start": 2,
    "home": 3,
    "skin_101": 4,
    "skin_102": 5,
    "click_video_skin103": 6,
    "click_video_skin104": 7,
    "skin_105": 8,
    "skin_106": 9,
    "gamepage_next": 10,
    "gamepage_again": 11,
    "gamepage_timeout_home": 12,
    "gamepage_timeout_continue": 13,
    "checkoutpage_next": 14,
    "click_video_doubleclaim": 15,
    "active_gamejoin_lv": 16,
    "active_gamevictory_lv": 17,
    "loading": 18,
    "click_video_skin107": 19,
    "click_video_skin108": 20,
    "click_video_skin109": 21,
    "click_video_skin110": 22,
    "click_video_nogold": 23,
    "click_video_noenergy": 24,
    "click_video_pushskin": 25,
    "click_video_skinchange": 26,
    "game_bulletvideo": 27,
    "failed_revivevideo": 28,
    "failed_sharevideos": 29,
    "failed_again": 30,
    "failed_skip": 31,
    "victory_sharevideos": 32,
    "FullscreenADS_appear": 33,
    "FullscreenADS_close": 34,
    "FullscreenADS_play": 35,
    "click_video_skin111": 36,
    "click_video_skin112": 37,
    "adventure": 38,
    "click_video_weapon14": 39,
    "click_video_weapon15": 40,
    "click_video_weapon16": 41,
    "click_video_weapon17": 42
}

export class EventCfgReader extends TConfig<EventCfg> {
    protected _name : string = "Event";


}