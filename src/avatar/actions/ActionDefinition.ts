import { AdvancedMap } from '../../core';
import { ActionType } from './ActionType';
import { IActionDefinition } from './IActionDefinition';

export class ActionDefinition implements IActionDefinition
{
    private _id: string;
    private _state: string;
    private _precedence: number;
    private _activePartSet: string;
    private _assetPartDefinition: string;
    private _lay: string;
    private _geometryType: string;
    private _isMain: boolean;
    private _isDefault: boolean;
    private _isAnimation: boolean;
    private _startFromFrameZero: boolean;
    private _prevents: string[];
    private _preventHeadTurn: boolean;
    private _types: AdvancedMap<number, ActionType>;
    private _params: AdvancedMap<string, string>;
    private _defaultParameterValue: string;
    private _canvasOffsets: AdvancedMap<string, AdvancedMap<number, number[]>>;

    constructor(data: any)
    {
        this._id = data.id;
        this._state = data.state;
        this._precedence = data.precedence;
        this._activePartSet = data.activePartSet;
        this._assetPartDefinition = data.assetPartDefinition;
        this._lay = data.lay;
        this._geometryType = data.geometryType;
        this._isMain = data.main || false;
        this._isDefault = data.isDefault || false;
        this._isAnimation = data.animation || false;
        this._startFromFrameZero = data.startFromFrameZero || false;
        this._prevents = data.prevents || [];
        this._preventHeadTurn = data.preventHeadTurn || false;
        this._types = new AdvancedMap();
        this._params = new AdvancedMap();
        this._defaultParameterValue = '';
        this._canvasOffsets = null;

        if(data.params && (data.params.length > 0))
        {
            for(const param of data.params)
            {
                if(!param) continue;

                if(param.id === 'default') this._defaultParameterValue = param.value;
                else this._params.add(param.id, param.value);
            }
        }

        if(data.types && (data.types.length > 0))
        {
            for(const type of data.types)
            {
                if(!type) continue;

                const action = new ActionType(type);

                this._types.add(action.id, action);
            }
        }
    }

    public setOffsets(k: string, _arg_2: number, _arg_3: number[]): void
    {
        if(!this._canvasOffsets) this._canvasOffsets = new AdvancedMap();

        let existing = this._canvasOffsets.getValue(k);

        if(!existing)
        {
            existing = new AdvancedMap();

            this._canvasOffsets.add(k, existing);
        }

        existing.add(_arg_2, _arg_3);
    }

    public getOffsets(k: string, _arg_2: number): number[]
    {
        if(!this._canvasOffsets) return null;

        const existing = this._canvasOffsets.getValue(k);

        if(!existing) return null;

        return existing.getValue(_arg_2);
    }

    public getType(id: string): ActionType
    {
        if(!id) return null;

        const existing = this._types.getValue(parseInt(id));

        if(!existing) return null;

        return existing;
    }

    public getParameterValue(id: string): string
    {
        if(!id) return '';

        const existing = this._params.getValue(id);

        if(!existing) return this._defaultParameterValue;

        return existing;
    }

    public getPrevents(type: string): string[]
    {
        return this._prevents.concat(this.getTypePrevents(type));
    }

    private getTypePrevents(type: string): string[]
    {
        if(!type) return [];

        const existing = this._types.getValue(parseInt(type));

        if(!existing) return [];

        return existing.prevents;
    }

    public getPreventHeadTurn(k: string): boolean
    {
        if(!k) return this._preventHeadTurn;

        const type = this.getType(k);

        if(!type) return this._preventHeadTurn;

        return type.preventHeadTurn;
    }

    public isAnimated(k: string): boolean
    {
        if(!k) return true;

        const type = this.getType(k);

        if(!type) return true;

        return type.isAnimated;
    }

    public get id(): string
    {
        return this._id;
    }

    public get state(): string
    {
        return this._state;
    }

    public get precedence(): number
    {
        return this._precedence;
    }

    public get activePartSet(): string
    {
        return this._activePartSet;
    }

    public get assetPartDefinition(): string
    {
        return this._assetPartDefinition;
    }

    public get lay(): string
    {
        return this._lay;
    }

    public get geometryType(): string
    {
        return this._geometryType;
    }

    public get isMain(): boolean
    {
        return this._isMain;
    }

    public get isDefault(): boolean
    {
        return this._isDefault;
    }

    public get isAnimation(): boolean
    {
        return this._isAnimation;
    }

    public get startFromFrameZero(): boolean
    {
        return this._startFromFrameZero;
    }

    public get prevents(): string[]
    {
        return this._prevents;
    }

    public get preventHeadTurn(): boolean
    {
        return this._preventHeadTurn;
    }

    public get params(): AdvancedMap<string, string>
    {
        return this._params;
    }
}
