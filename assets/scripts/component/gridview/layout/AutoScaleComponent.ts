import { GRID_TYPE } from "../GridView";

// 根据布局方案得到一个合适的缩放比;
export class AutoScaleComponent {
    public parentSize: cc.Vec2 = cc.Vec2.ZERO;
    public itemSize: cc.Vec2 = cc.Vec2.ZERO;
    public type: GRID_TYPE;

    public space: cc.Vec2 = cc.Vec2.ZERO;

    public keyCount: number = 0;

    public getScale() {
        let scale: number = 1.0;
        let realParam = 0;
        let itemParam = 0;
        let spaceParam = 0;
        let parentParam = 0;
        switch (this.type) {
            case GRID_TYPE.GRID_VERTICAL:
                itemParam = this.itemSize.x;
                spaceParam = this.space.x;
                parentParam = this.parentSize.x;
                break;

            case GRID_TYPE.GRID_HORIZONTAL:
                itemParam = this.itemSize.y;
                spaceParam = this.space.y;
                parentParam = this.parentSize.y;
                break;
        }

        realParam = itemParam * this.keyCount + spaceParam * (this.keyCount - 1);
        if (realParam > parentParam) {
            let theoryParam = (parentParam - (spaceParam * (this.keyCount - 1))) / this.keyCount;
            scale = theoryParam / itemParam;
        }
        return scale;
    }
}