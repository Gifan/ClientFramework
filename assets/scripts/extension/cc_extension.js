(function () {
    /*cc.PhysicsContact.prototype.emit = function (contactType) {
        var func;
        var ContactType = {
            BEGIN_CONTACT: 'begin-contact',
            END_CONTACT: 'end-contact',
            PRE_SOLVE: 'pre-solve',
            POST_SOLVE: 'post-solve'
        };
        switch (contactType) {
            case ContactType.BEGIN_CONTACT:
                func = 'onBeginContact';
                break;
            case ContactType.END_CONTACT:
                func = 'onEndContact';
                break;
            case ContactType.PRE_SOLVE:
                func = 'onPreSolve';
                break;
            case ContactType.POST_SOLVE:
                func = 'onPostSolve';
                break;
        }

        var colliderA = this.colliderA;
        var colliderB = this.colliderB;

        var bodyA = colliderA.body;
        var bodyB = colliderB.body;

        var comps;
        var i, l, comp;
        var parentcomps;
        if (bodyA.enabledContactListener) {
            comps = bodyA.node._components;
            this._inverted = false;
            parentcomps = bodyA.node.physicCBComp;
            if (parentcomps) {
                if (parentcomps[func]) {
                    parentcomps[func](this, colliderA, colliderB);
                }
            } else {
                for (i = 0, l = comps.length; i < l; i++) {
                    comp = comps[i];
                    if (comp[func]) {
                        comp[func](this, colliderA, colliderB);
                        break;
                    }
                }
            }
        }

        if (bodyB.enabledContactListener) {
            comps = bodyB.node._components;
            this._inverted = true;
            parentcomps = bodyB.node.physicCBComp;
            if (parentcomps) {
                if (parentcomps[func]) {
                    parentcomps[func](this, colliderB, colliderA);
                }
            } else {
                for (i = 0, l = comps.length; i < l; i++) {
                    comp = comps[i];
                    if (comp[func]) {
                        comp[func](this, colliderB, colliderA);
                        break;
                    }
                }
            }
        }

        if (this.disabled || this.disabledOnce) {
            this.setEnabled(false);
            this.disabledOnce = false;
        }
    };*/
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
})();