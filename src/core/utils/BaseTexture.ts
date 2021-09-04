import { Image } from 'canvas';

export class BaseTexture
{
    private _image: Image;
    private _resolution: number;

    constructor(image: Image)
    {
        this._image = image;
        this._resolution = 1;
    }

    public getDrawableSource(): Image
    {
        return this._image;
    }

    public get image(): Image
    {
        return this._image;
    }

    public get resolution(): number
    {
        return this._resolution;
    }
}
