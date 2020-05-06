cc.Button.prototype.audioId = 1;
cc.Button.prototype._onTouchEnded = function (event) {
    if (!this.interactable || !this.enabledInHierarchy) return;

    if (this._pressed) {
        cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        this.node.emit('click', this);
        if (cc._gameManager) {
            cc._gameManager.audio.playAudio(this.audioId);
        }
    }
    this._pressed = false;
    this._updateState();
    event.stopPropagation();
}