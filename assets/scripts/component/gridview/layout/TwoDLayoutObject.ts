import { LayoutObject } from "./LayoutObject";


export enum LAYOUT_HORIZONTAL_TYPE {
    LEFT,
    RIGHT,
    CENTER,
}

export enum LAYOUT_VERTICAL_TYPE {
    CENTER,
    TOP,
    BOTTOM
}

export class TwoDLayoutObject extends LayoutObject {
    public key_count: number = 0;

    public item_size: cc.Vec2 = cc.Vec2.ZERO;

    public parent_size: cc.Vec2 = cc.Vec2.ZERO;

    public item_anchor_point: cc.Vec2 = cc.Vec2.ZERO;

    public count: number = 0;

    public horizontal_layout_type: LAYOUT_HORIZONTAL_TYPE = LAYOUT_HORIZONTAL_TYPE.LEFT;

    public vertical_layout_type: LAYOUT_VERTICAL_TYPE = LAYOUT_VERTICAL_TYPE.TOP;

    public space: cc.Vec2 = cc.Vec2.ZERO;

    public left: number = 0;
    public right: number = 0;
    public top: number = 0;
    public bottom: number = 0;


    public getRowByIndex(index: number): number {
        return Math.floor(index / this.key_count);
    }

    public getColumnByIndex(i: number): number {
        return i % this.key_count;
    }

    public rows(): number {
        let rows = Math.ceil(this.count / this.key_count);
        return rows;
    }

    public columns(): number {
        if (this.count <= this.key_count - 1) {
            return this.count;
        }
        else {
            return this.key_count;
        }
    }

    public getBoundingRect(): cc.Vec2 {
        let rows = this.rows();
        let cols = this.columns();

        let h = rows * this.item_size.y + (rows - 1) * this.space.y + this.top + this.bottom;
        let w = cols * this.item_size.x + (cols - 1) * this.space.x + this.left + this.right;

        return new cc.Vec2(w, h);
    }

    public getIndex(row: number, col: number): number {
        return row * this.key_count + col;
    }

    protected doLayout(i: number): cc.Vec2 {
        let row = this.getRowByIndex(i);
        let getColumnByIndex = this.getColumnByIndex(i);

        let x = 0;
        let y = 0;

        switch (this.horizontal_layout_type) {
            case LAYOUT_HORIZONTAL_TYPE.LEFT:
                x = this.left + getColumnByIndex * (this.item_size.x + this.space.x) + this.item_anchor_point.x * this.item_size.x;
                break;

            case LAYOUT_HORIZONTAL_TYPE.CENTER:
                if (this.key_count === 1) {
                    let space_x = (this.parent_size.x - this.item_size.x - this.left - this.right) / 2;
                    x = this.left + space_x + this.item_anchor_point.x * this.item_size.x;
                }
                else {
                    let space_x = (this.parent_size.x - (this.left + this.right) - this.key_count * this.item_size.x) / (this.key_count - 1);
                    x = this.left + getColumnByIndex * (this.item_size.x + space_x) + this.item_anchor_point.x * this.item_size.x;
                }
                break;

            case LAYOUT_HORIZONTAL_TYPE.RIGHT:
                {
                    let offset_x = this.parent_size.x - this.getBoundingRect().x;
                    x = this.left + getColumnByIndex * (this.item_size.x + this.space.x) + this.item_anchor_point.x * this.item_size.x + offset_x;
                }
                break;
        }

        switch (this.vertical_layout_type) {
            case LAYOUT_VERTICAL_TYPE.TOP:
                y = this.top + row * (this.item_size.y + this.space.y) + (1 - this.item_anchor_point.y) * this.item_size.y;
                break;

            case LAYOUT_VERTICAL_TYPE.CENTER:
                if (this.key_count === 1) {
                    let space_y = (this.parent_size.y - this.item_size.y - this.top - this.bottom) / 2;
                    y = this.top + space_y + (1 - this.item_anchor_point.y) * this.item_size.y;
                }
                else {
                    let space_y = (this.parent_size.y - (this.top + this.bottom) - this.key_count * this.item_size.y) / (this.key_count - 1);
                    y = this.top + row * (this.item_size.y + space_y) + (1 - this.item_anchor_point.y) * this.item_size.y;
                }
                break;

            case LAYOUT_VERTICAL_TYPE.BOTTOM:
                {
                    let offset_y = this.parent_size.y - this.getBoundingRect().y;
                    y = this.top + row * (this.item_size.y + this.space.y) + (1 - this.item_anchor_point.y) * this.item_size.y + offset_y;
                }
                break;
        }

        let pos = new cc.Vec2(x, -y);
        return pos;
    }

}