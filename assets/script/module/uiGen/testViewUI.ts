
/**
* 程序生成的UI代码类，请勿修改
*/
export class testViewUI{
    public _node:cc.Node = null;
    public constructor(node ?: cc.Node) {
        if (node != null) {
            this.Init(node);
        }
    }
    
    public sprite : cc.Sprite;
    public button : cc.Button;
    public Background : cc.Sprite;
    public label : cc.Label;

    public Init(node : cc.Node) {
        this._node = node;
        
		let spriteXform = node.getChildByName("sprite");
		if ( spriteXform != null) {
			this.sprite = spriteXform.getComponent(cc.Sprite);				
		} else {
			cc.error("sprite Can't Find Under node");
		}
		let buttonXform = node.getChildByName("button");
		if ( buttonXform != null) {
			this.button = buttonXform.getComponent(cc.Button);				
		} else {
			cc.error("button Can't Find Under node");
		}
		let BackgroundXform = buttonXform.getChildByName("Background");
		if ( BackgroundXform != null) {
			this.Background = BackgroundXform.getComponent(cc.Sprite);				
		} else {
			cc.error("Background Can't Find Under buttonXform");
		}
		let labelXform = BackgroundXform.getChildByName("label");
		if ( labelXform != null) {
			this.label = labelXform.getComponent(cc.Label);				
		} else {
			cc.error("label Can't Find Under BackgroundXform");
		}
    }
}