import { AdvancedMap } from '../../core';
import { ActionDefinition, IActionDefinition } from '../actions';
import { IFigureSetData } from './IFigureSetData';
import { ActivePartSet, PartDefinition } from './parts';

export class PartSetsData implements IFigureSetData
{
    private _parts: AdvancedMap<string, PartDefinition>;
    private _activePartSets: AdvancedMap<string, ActivePartSet>;

    constructor()
    {
        this._parts = new AdvancedMap();
        this._activePartSets = new AdvancedMap();
    }

    public parse(data: any): boolean
    {
        if(data.partSet && (data.partSet.length > 0))
        {
            for(const part of data.partSet)
            {
                if(!part) continue;

                this._parts.add(part.setType, new PartDefinition(part));
            }
        }

        if(data.activePartSets && (data.activePartSets.length > 0))
        {
            for(const activePart of data.activePartSets)
            {
                if(!activePart) continue;

                this._activePartSets.add(activePart.id, new ActivePartSet(activePart));
            }
        }

        return true;
    }

    public appendJSON(data: any): boolean
    {
        if(data.partSet && (data.partSet.length > 0))
        {
            for(const part of data.partSet)
            {
                if(!part) continue;

                this._parts.add(part.setType, new PartDefinition(part));
            }
        }

        if(data.activePartSets && (data.activePartSets.length > 0))
        {
            for(const activePart of data.activePartSets)
            {
                if(!activePart) continue;

                this._activePartSets.add(activePart.id, new ActivePartSet(activePart));
            }
        }

        return false;
    }

    public getActiveParts(k:IActionDefinition): string[]
    {
        const activePartSet = this._activePartSets.getValue(k.activePartSet);

        if(!activePartSet) return [];

        return activePartSet.parts;
    }

    public getPartDefinition(part: string): PartDefinition
    {
        const existing = this._parts.getValue(part);

        if(!existing) return null;

        return existing;
    }

    public addPartDefinition(k: any): PartDefinition
    {
        const _local_2 = k.setType as string;

        let existing = this._parts.getValue(_local_2);

        if(!existing)
        {
            existing = new PartDefinition(k);

            this._parts.add(_local_2, existing);
        }

        return existing;
    }

    public getActivePartSet(k: ActionDefinition): ActivePartSet
    {
        const existing = this._activePartSets.getValue(k.activePartSet);

        if(!existing) return null;

        return existing;
    }

    public get parts(): AdvancedMap<string, PartDefinition>
    {
        return this._parts;
    }

    public get activePartSets(): AdvancedMap<string, ActivePartSet>
    {
        return this._activePartSets;
    }
}
