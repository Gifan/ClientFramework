export class LayoutObject {
    public getBoundingRect() {
        return cc.Vec2.ZERO;
    }

    public getPosByIndex(index: number): cc.Vec2 {
        return this.doLayout(index);
    }

    protected doLayout(i: number): cc.Vec2 {
        return cc.Vec2.ZERO;
    }


}