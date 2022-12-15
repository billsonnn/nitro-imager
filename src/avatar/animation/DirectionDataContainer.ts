import { IAssetAnimationDirection } from '../../core';

export class DirectionDataContainer
{
    private _offset: number;

    constructor(direction: IAssetAnimationDirection)
    {
        this._offset = direction.offset;
    }

    public get offset(): number
    {
        return this._offset;
    }
}
