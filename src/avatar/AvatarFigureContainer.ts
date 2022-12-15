import { AdvancedMap } from '../core';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';

export class AvatarFigureContainer implements IAvatarFigureContainer
{
    private _parts: AdvancedMap<string, AdvancedMap<string, any>>;

    constructor(figure: string)
    {
        this._parts = new AdvancedMap();

        this.parseFigure(figure);
    }

    public getPartTypeIds(): string[]
    {
        return this.partSets().getKeys();
    }

    public hasPartType(k: string): boolean
    {
        return !!this.partSets().getValue(k);
    }

    public getPartSetId(k: string): number
    {
        const existing = this.partSets().getValue(k);

        if(!existing) return 0;

        return existing.getValue('setid');
    }

    public getPartColorIds(k: string): number[]
    {
        const existing = this.partSets().getValue(k);

        if(!existing) return null;

        return existing.getValue('colorids');
    }

    public updatePart(setType: string, partSetId: number, colorIds: number[]): void
    {
        const set: AdvancedMap<string, any> = new AdvancedMap();

        set.add('type', setType);
        set.add('setid', partSetId);
        set.add('colorids', colorIds);

        const existingSets = this.partSets();

        existingSets.remove(setType);
        existingSets.add(setType, set);
    }

    public removePart(k: string): void
    {
        this.partSets().remove(k);
    }

    public getFigureString(): string
    {
        const parts: string[] = [];

        for(const key of this.partSets().getKeys())
        {
            if(!key) continue;

            let setParts = [];

            setParts.push(key);
            setParts.push(this.getPartSetId(key));

            setParts = setParts.concat(this.getPartColorIds(key));

            parts.push(setParts.join('-'));
        }

        return parts.join('.');
    }

    private partSets(): AdvancedMap<string, AdvancedMap<string, any>>
    {
        if(!this._parts) this._parts = new AdvancedMap();

        return this._parts;
    }

    private parseFigure(figure: string): void
    {
        if(!figure) figure = '';

        for(const part of figure.split('.'))
        {
            const pieces = part.split('-');

            if(pieces.length >= 2)
            {
                const type = pieces[0];
                const setId = parseInt(pieces[1]);
                const colors = [];

                let index = 2;

                while(index < pieces.length)
                {
                    colors.push(parseInt(pieces[index]));

                    index++;
                }

                this.updatePart(type, setId, colors);
            }
        }
    }
}
