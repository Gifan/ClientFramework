import { TwoDLayoutObject } from "./TwoDLayoutObject";

export class TwoDHorizontalLayoutObject extends TwoDLayoutObject
{
    public getRowByIndex(index:number):number
    {
        return super.getColumnByIndex(index);
    }

    public getColumnByIndex(index:number):number
    {
        return super.getRowByIndex(index);
    }

    public rows():number
    {
        return super.columns();
    }

    public columns():number
    {
        return super.rows();
    }

    public getIndex(row:number, col:number):number
    {
        return row + col * this.key_count;
    }
}