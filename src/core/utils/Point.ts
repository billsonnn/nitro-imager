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

    public copyFrom(p: Point): Point
    {
        this.add(p.x, p.y);

        return this;
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
}
