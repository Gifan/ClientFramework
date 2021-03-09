
export class MathUtils
{
    public static Clamp(value:number, a:number, b:number):number
    {
        let cur_value = value;
        if(value < a)
        {
            cur_value = a;
        }
        else if(value > b)
        {
            cur_value = b;
        }

        return cur_value;
    }
}