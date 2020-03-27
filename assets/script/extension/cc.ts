import { Manager } from "../framework/manager/Manager";
import { Const } from "../config/Const";

// cc.Button.prototype._onTouchEnded = function (event) {
//     if (!this.interactable || !this.enabledInHierarchy) return;

//     if (this._pressed) {
//         cc.Component.EventHandler.emitEvents(this.clickEvents, event);
//         this.node.emit('click', this);
//         if (this.audioId) {
//             Manager.audio.playAudio(this.audioId);
//         }
//     }
//     this._pressed = false;
//     this._updateState();
//     event.stopPropagation();
// }
// cc.Button.prototype.audioId = Const.ButtonAudioId;