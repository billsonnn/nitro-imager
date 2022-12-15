import { Canvas } from 'canvas';
import { Point, Rectangle } from '../../core';

export class CompleteImageData
{
    private _image: Canvas;
    private _rect: Rectangle;
    private _regPoint: Point;
    private _flipH: boolean;
    private _colorTransform: number;

    constructor(texture: Canvas, rectangle: Rectangle, _arg_3: Point, flipH: boolean, color: number)
    {
        this._image = texture;
        this._rect = rectangle;
        this._regPoint = _arg_3;
        this._flipH = flipH;
        this._colorTransform = color;

        if(flipH) this._regPoint.x = (-(this._regPoint.x) + rectangle.width);
    }

    public dispose(): void
    {
        this._image = null;
        this._regPoint = null;
        this._colorTransform = null;
    }

    public get image(): Canvas
    {
        return this._image;
    }

    public get rect(): Rectangle
    {
        return this._rect;
    }

    public get regPoint(): Point
    {
        return this._regPoint;
    }

    public get flipH(): boolean
    {
        return this._flipH;
    }

    public get colorTransform(): number
    {
        return this._colorTransform;
    }

    public get offsetRect(): Rectangle
    {
        return new Rectangle(-(this._regPoint.x), -(this._regPoint.y), this._rect.width, this._rect.height);
    }
}
