
export function getBtnStyle(btn: cc.Node) {
    btn.active = false;
    let canvasHeight = cc.Canvas.instance.node.height;
    let pos = btn.convertToWorldSpaceAR(cc.Vec2.ZERO);
    pos.y = canvasHeight - pos.y;
    let scale = wx.getSystemInfoSync().screenHeight / canvasHeight;
    let style = {
        left: (pos.x - btn.width * 0.5) * scale,
        top: (pos.y - btn.height * 0.5) * scale,
        width: btn.width * scale,
        height: btn.height * scale,
    };
    console.log("[WxUtil][getBtnStyle]", canvasHeight, scale, style);
    return style;
}