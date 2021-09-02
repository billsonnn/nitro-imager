import { AdvancedMap } from '../../../../core';
import { IFigureDataPalette } from '../../interfaces';
import { IPalette } from './IPalette';
import { IPartColor } from './IPartColor';
import { PartColor } from './PartColor';

export class Palette implements IPalette
{
    private _id: number;
    private _colors: AdvancedMap<string, IPartColor>;

    constructor(data: IFigureDataPalette)
    {
        if(!data) throw new Error('invalid_data');

        this._id = data.id;
        this._colors = new AdvancedMap();

        this.append(data);
    }

    public append(data: IFigureDataPalette): void
    {
        for(const color of data.colors)
        {
            const newColor = new PartColor(color);

            this._colors.add(color.id.toString(), newColor);
        }
    }

    public getColor(id: number): IPartColor
    {
        if((id === undefined) || id < 0) return null;

        return (this._colors.getValue(id.toString()) || null);
    }

    public get id(): number
    {
        return this._id;
    }

    public get colors(): AdvancedMap<string, IPartColor>
    {
        return this._colors;
    }
}
