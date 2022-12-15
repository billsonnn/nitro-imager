import { AdvancedMap, IAssetAnimationFramePart } from '../../core';
import { ActiveActionData, IActionDefinition, IActiveActionData } from '../actions';
import { IAnimationLayerData } from './IAnimationLayerData';

export class AvatarAnimationLayerData implements IAnimationLayerData
{
    public static BODYPART: string = 'bodypart';
    public static FX: string = 'fx';

    private _id: string;
    private _action: IActiveActionData;
    private _animationFrame: number;
    private _dx: number;
    private _dy: number;
    private _dz: number;
    private _directionOffset: number;
    private _type: string;
    private _base: string;
    private _items: AdvancedMap<string, string>;

    constructor(framePart: IAssetAnimationFramePart, type: string, definition: IActionDefinition)
    {
        this._id = framePart.id;
        this._animationFrame = (framePart.frame || 0);
        this._dx = (framePart.dx || 0);
        this._dy = (framePart.dy || 0);
        this._dz = (framePart.dz || 0);
        this._directionOffset = (framePart.dd || 0);
        this._type = type;
        this._base = (framePart.base || '');
        this._items = new AdvancedMap();

        if(framePart.items) for(const partItem of framePart.items) this._items.add(partItem.id, partItem.base);

        let base = '';

        if(this._base !== '') base = this.baseAsInt().toString();

        if(definition)
        {
            this._action = new ActiveActionData(definition.state, this.base);
            this._action.definition = definition;
        }
    }

    public get items(): AdvancedMap<string, string>
    {
        return this._items;
    }

    private baseAsInt(): number
    {
        let base = 0;
        let index = 0;

        while(index < this._base.length)
        {
            base = (base + this._base.charCodeAt(index));

            index++;
        }

        return base;
    }

    public get id(): string
    {
        return this._id;
    }

    public get animationFrame(): number
    {
        return this._animationFrame;
    }

    public get dx(): number
    {
        return this._dx;
    }

    public get dy(): number
    {
        return this._dy;
    }

    public get dz(): number
    {
        return this._dz;
    }

    public get dd(): number
    {
        return this._directionOffset;
    }

    public get type(): string
    {
        return this._type;
    }

    public get base(): string
    {
        return this._base;
    }

    public get action(): IActiveActionData
    {
        return this._action;
    }
}
