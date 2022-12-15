import { AdvancedMap } from '../../core';
import { IFigureData } from '../interfaces';
import { IFigurePartSet, IPalette, ISetType, Palette, SetType } from './figure';
import { IFigureSetData } from './IFigureSetData';
import { IStructureData } from './IStructureData';

export class FigureSetData implements IFigureSetData, IStructureData
{
    private _palettes: AdvancedMap<string, Palette>;
    private _setTypes: AdvancedMap<string, SetType>;

    constructor()
    {
        this._palettes = new AdvancedMap();
        this._setTypes = new AdvancedMap();
    }

    public dispose(): void
    {

    }

    public parse(data: IFigureData): boolean
    {
        if(!data) return false;

        for(const palette of data.palettes)
        {
            const newPalette = new Palette(palette);

            if(!newPalette) continue;

            this._palettes.add(newPalette.id.toString(), newPalette);
        }

        for(const set of data.setTypes)
        {
            const newSet = new SetType(set);

            if(!newSet) continue;

            this._setTypes.add(newSet.type, newSet);
        }

        return true;
    }

    public injectJSON(data: IFigureData): void
    {
        for(const setType of data.setTypes)
        {
            const existingSetType = this._setTypes.getValue(setType.type);

            if(existingSetType) existingSetType.cleanUp(setType);
            else this._setTypes.add(setType.type, new SetType(setType));
        }

        this.appendJSON(data);
    }

    public appendJSON(data: IFigureData): boolean
    {
        if(!data) return false;

        for(const palette of data.palettes)
        {
            const id = palette.id.toString();
            const existingPalette = this._palettes.getValue(id);

            if(!existingPalette) this._palettes.add(id, new Palette(palette));
            else existingPalette.append(palette);
        }

        for(const setType of data.setTypes)
        {
            const type = setType.type;
            const existingSetType = this._setTypes.getValue(type);

            if(!existingSetType) this._setTypes.add(type, new SetType(setType));
            else existingSetType.append(setType);
        }

        return false;
    }

    public getMandatorySetTypeIds(k: string, _arg_2: number): string[]
    {
        const types: string[] = [];

        for(const set of this._setTypes.getValues())
        {
            if(!set || !set.isMandatory(k, _arg_2)) continue;

            types.push(set.type);
        }

        return types;
    }

    public getDefaultPartSet(k: string, _arg_2: string): IFigurePartSet
    {
        const setType = this._setTypes.getValue(k);

        if(!setType) return null;

        return setType.getDefaultPartSet(_arg_2);
    }

    public getSetType(k: string): ISetType
    {
        return (this._setTypes.getValue(k) || null);
    }

    public getPalette(k: number): IPalette
    {
        return (this._palettes.getValue(k.toString()) || null);
    }

    public getFigurePartSet(k: number): IFigurePartSet
    {
        for(const set of this._setTypes.getValues())
        {
            const partSet = set.getPartSet(k);

            if(!partSet) continue;

            return partSet;
        }

        return null;
    }
}
