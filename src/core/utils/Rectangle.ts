export class Rectangle
{
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public clone(): Rectangle
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    public copyFrom(rectangle: Rectangle): Rectangle
    {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this;
    }

    public copyTo(rectangle: Rectangle): Rectangle
    {
        rectangle.x = this.x;
        rectangle.y = this.y;
        rectangle.width = this.width;
        rectangle.height = this.height;

        return rectangle;
    }

    public contains(x: number, y: number): boolean
    {
        if(this.width <= 0 || this.height <= 0) return false;

        if(x >= this.x && x < this.x + this.width)
        {
            if(y >= this.y && y < this.y + this.height) return true;
        }

        return false;
    }

    public pad(paddingX: number = 0, paddingY: number = paddingX): Rectangle
    {
        this.x -= paddingX;
        this.y -= paddingY;
        this.width += paddingX * 2;
        this.height += paddingY * 2;

        return this;
    }

    public fit(rectangle: Rectangle): Rectangle
    {
        const x1 = Math.max(this.x, rectangle.x);
        const x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
        const y1 = Math.max(this.y, rectangle.y);
        const y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);

        this.x = x1;
        this.width = Math.max(x2 - x1, 0);
        this.y = y1;
        this.height = Math.max(y2 - y1, 0);

        return this;
    }

    public ceil(resolution: number = 1, eps: number = 0.001): Rectangle
    {
        const x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
        const y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;

        this.x = Math.floor((this.x + eps) * resolution) / resolution;
        this.y = Math.floor((this.y + eps) * resolution) / resolution;
        this.width = x2 - this.x;
        this.height = y2 - this.y;

        return this;
    }

    public enlarge(rectangle: Rectangle): Rectangle
    {
        const x1 = Math.min(this.x, rectangle.x);
        const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
        const y1 = Math.min(this.y, rectangle.y);
        const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);

        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;

        return this;
    }

    public get left(): number
    {
        return this.x;
    }

    public get right(): number
    {
        return this.x + this.width;
    }

    public get top(): number
    {
        return this.y;
    }

    public get bottom(): number
    {
        return this.y + this.height;
    }
}
