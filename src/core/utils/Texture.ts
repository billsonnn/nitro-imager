import { Canvas, createCanvas } from 'canvas';
import { BaseTexture } from './BaseTexture';
import { Rectangle } from './Rectangle';

export class Texture
{
    private _baseTexture: BaseTexture;
    private _frame: Rectangle;
    private _orig: Rectangle;
    private _trim: Rectangle;
    private _drawableCanvas: Canvas;

    constructor(baseTexture: BaseTexture, frame: Rectangle, orig: Rectangle, trim: Rectangle)
    {
        this._baseTexture = baseTexture;
        this._frame = frame;
        this._orig = orig;
        this._trim = trim;

        this.buildTexture();
    }

    private buildTexture(): void
    {
        const width = this._frame.width;
        const height = this._frame.height;

        let dx = 0;
        let dy = 0;

        if(this._trim)
        {
            dx = (this._trim.width / 2) + this._trim.x - (0 * this._orig.width);
            dy = (this._trim.height / 2) + this._trim.y - (0 * this._orig.height);
        }
        else
        {
            dx = (0.5 - 0) * this._orig.width;
            dy = (0.5 - 0) * this._orig.height;
        }

        dx -= width / 2;
        dy -= height / 2;

        const canvas = createCanvas(this._orig.width, this._orig.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            this._baseTexture.image,
            this._frame.x * this._baseTexture.resolution,
            this._frame.y * this._baseTexture.resolution,
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution),
            Math.floor(dx * this._baseTexture.resolution),
            Math.floor(dy * this._baseTexture.resolution),
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution)
        );

        this._drawableCanvas = canvas;
    }

    public getTintedWithMultiply(color: number): Canvas
    {
        const width = this._frame.width;
        const height = this._frame.height;

        let dx = 0;
        let dy = 0;

        if(this._trim)
        {
            dx = (this._trim.width / 2) + this._trim.x - (0 * this._orig.width);
            dy = (this._trim.height / 2) + this._trim.y - (0 * this._orig.height);
        }
        else
        {
            dx = (0.5 - 0) * this._orig.width;
            dy = (0.5 - 0) * this._orig.height;
        }

        dx -= width / 2;
        dy -= height / 2;

        const canvas = createCanvas(this._orig.width, this._orig.height);
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.fillStyle = `#${(`00000${(color | 0).toString(16)}`).substr(-6)}`;

        ctx.fillRect(0, 0, this._orig.width, this._orig.height);

        ctx.globalCompositeOperation = 'multiply';

        ctx.drawImage(
            this._baseTexture.image,
            this._frame.x * this._baseTexture.resolution,
            this._frame.y * this._baseTexture.resolution,
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution),
            Math.floor(dx * this._baseTexture.resolution),
            Math.floor(dy * this._baseTexture.resolution),
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution)
        );

        ctx.globalCompositeOperation = 'destination-atop';

        ctx.drawImage(
            this._baseTexture.image,
            this._frame.x * this._baseTexture.resolution,
            this._frame.y * this._baseTexture.resolution,
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution),
            Math.floor(dx * this._baseTexture.resolution),
            Math.floor(dy * this._baseTexture.resolution),
            Math.floor(width * this._baseTexture.resolution),
            Math.floor(height * this._baseTexture.resolution)
        );

        ctx.restore();

        return canvas;
    }

    public get baseTexture(): BaseTexture
    {
        return this._baseTexture;
    }

    public get frame(): Rectangle
    {
        return this._frame;
    }

    public get orig(): Rectangle
    {
        return this._orig;
    }

    public get trim(): Rectangle
    {
        return this._trim;
    }

    public get drawableCanvas(): Canvas
    {
        return this._drawableCanvas;
    }

    public get width(): number
    {
        return this.drawableCanvas.width;
    }

    public get height(): number
    {
        return this._drawableCanvas.height;
    }
}
