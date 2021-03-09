// 区间类,连续区间,不是离散区间;
export class MathSection {
    public left: number = Number.NEGATIVE_INFINITY;
    public right: number = Number.NEGATIVE_INFINITY;

    // 保证左边小于右边;
    public adjust() {
        let tmp_left = this.left;
        let tmp_right = this.right;

        if (tmp_left > tmp_right) {
            this.left = tmp_right;
            this.right = tmp_left;
        }
    }

    // 是否为空区间;
    public isNullRange(): boolean {
        if (this.left === Number.NEGATIVE_INFINITY && this.right === Number.NEGATIVE_INFINITY) {
            return true;
        }
        return false;
    }

    // 区间的长度;
    public length(): number {
        return this.right - this.left;
    }

    // 交集;
    public and(b: MathSection): MathSection {
        let math_set = new MathSection();
        if (this.isNullRange() || b.isNullRange()) {
            return math_set;
        }

        this.adjust();
        b.adjust();

        if (this.left >= b.left && this.left <= b.right) {
            math_set.left = this.left;
        }
        else if (b.left >= this.left && b.left <= this.right) {
            math_set.left = b.left;
        }

        if (this.right >= b.left && this.right <= b.right) {
            math_set.right = this.right;
        }
        else if (b.right >= this.left && b.right <= this.right) {
            math_set.right = b.right;
        }

        return math_set;
    }

    // 求以b为全集,当前区间的补集.注:当前区间是b的子集,且a,b的区间任意一边要相同,这样才能得到一个解;
    public Invert(b: MathSection): MathSection {
        if (this.isNullRange()) {
            return b;
        }

        let c = new MathSection();
        if (this.left === b.left && this.right === b.right) {
            return c;
        }

        if (this.left === b.left) {
            c.left = this.right + 1;
            c.right = b.right;
        }
        else if (this.right === b.right) {
            c.left = b.left;
            c.right = this.left - 1;
        }
        return c;
    }
}