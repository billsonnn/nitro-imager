import { Canvas } from 'canvas';
import { Point } from '../core';

export class AvatarImageBodyPartContainer
{
    private _image: Canvas;
    private _regPoint: Point;
    private _offset: Point;
    private _isCacheable: boolean;

    constructor(image: Canvas, regPoint: Point, isCacheable: boolean)
    {
        this._image = image;
        this._regPoint = regPoint;
        this._offset = new Point(0, 0);
        this._isCacheable = isCacheable;

        this.cleanPoints();
    }

    public dispose(): void
    {
        this._image = null;
        this._regPoint = null;
        this._offset = null;
    }

    private cleanPoints(): void
    {
        // this._regPoint.x    = this._regPoint.x;
        // this._regPoint.y    = this._regPoint.y;
        // this._offset.x      = this._offset.x;
        // this._offset.y      = this._offset.y;
    }

    public setRegPoint(k: Point): void
    {
        this._regPoint = k;

        this.cleanPoints();
    }

    public get image(): Canvas
    {
        return this._image;
    }

    public set image(k: Canvas)
    {
        this._image = k;
    }

    public get regPoint(): Point
    {
        const clone = this._regPoint.clone();

        clone.x += this._offset.x;
        clone.y += this._offset.y;

        return clone;
    }

    public set offset(k: Point)
    {
        this._offset = k;

        this.cleanPoints();
    }

    public get isCacheable(): boolean
    {
        return this._isCacheable;
    }
}
