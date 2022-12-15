export class Point
{
    public x = 0;
    public y = 0;

    constructor(x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    public clone(): Point
    {
        return new Point(this.x, this.y);
    }

    public equals(p: Point): boolean
    {
        return ((p.x === this.x) && (p.y === this.y));
    }

    public set(x: number = 0, y: number = x): Point
    {
        this.x = x;
        this.y = y;

        return this;
    }

    public add(point: Point): Point
    {
        const clone = this.clone();

        clone.x += point.x;
        clone.y += point.y;

        return clone;
    }
}
