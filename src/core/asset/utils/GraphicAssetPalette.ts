import { Texture } from '../../utils';
import { IGraphicAssetPalette } from '../interfaces';

export class GraphicAssetPalette implements IGraphicAssetPalette
{
    private _palette: [ number, number, number ][];
    private _primaryColor: number;
    private _secondaryColor: number;

    constructor(palette: [ number, number, number ][], primaryColor: number, secondaryColor: number)
    {
        this._palette = palette;

        while(this._palette.length < 256) this._palette.push([ 0, 0, 0 ]);

        this._primaryColor = primaryColor;
        this._secondaryColor = secondaryColor;
    }

    public dispose(): void
    {

    }

    public applyPalette(texture: Texture): Texture
    {
        return null;

        // const ctx = texture.getContext('2d');
        // const imageData = ctx.getImageData(0, 0, texture.width, texture.height);
        // const data = imageData.data;
        // const newCanvas = createCanvas(texture.width, texture.height);
        // const newCanvasCtx = newCanvas.getContext('2d');

        // for(let i = 0; i < data.length; i += 4)
        // {
        //     let paletteColor = this._palette[data[ i + 1 ]];

        //     if(paletteColor === undefined) paletteColor = [ 0, 0, 0 ];

        //     data[ i ] = paletteColor[0];
        //     data[ i + 1 ] = paletteColor[1];
        //     data[ i + 2 ] = paletteColor[2];
        // }

        // newCanvasCtx.drawImage(data, 0, 0, texture.width, texture.height);

        // return newCanvas;
    }

    public get primaryColor(): number
    {
        return this._primaryColor;
    }

    public get secondaryColor(): number
    {
        return this._secondaryColor;
    }
}
