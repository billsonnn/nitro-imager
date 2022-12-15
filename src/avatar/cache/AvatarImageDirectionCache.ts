import { AdvancedMap } from '../../core';
import { AvatarImageBodyPartContainer } from '../AvatarImageBodyPartContainer';
import { AvatarImagePartContainer } from '../AvatarImagePartContainer';

export class AvatarImageDirectionCache
{
    private _partList: AvatarImagePartContainer[];
    private _images: AdvancedMap<string, AvatarImageBodyPartContainer>;

    constructor(k: AvatarImagePartContainer[])
    {
        this._partList = k;
        this._images = new AdvancedMap();
    }

    public dispose(): void
    {
        for(const image of this._images.getValues()) image && image.dispose();

        this._images = null;
    }

    public getPartList(): AvatarImagePartContainer[]
    {
        return this._partList;
    }

    public getImageContainer(k: number): AvatarImageBodyPartContainer
    {
        const existing = this._images.getValue(this.getCacheKey(k));

        if(!existing) return null;

        return existing;
    }

    public updateImageContainer(k: AvatarImageBodyPartContainer, _arg_2: number): void
    {
        const name = this.getCacheKey(_arg_2);

        const existing = this._images.getValue(name);

        if(existing) existing.dispose();

        this._images.add(name, k);
    }

    private getCacheKey(k: number): string
    {
        let name = '';

        for(const part of this._partList) name += (part.getCacheableKey(k) + '/');

        return name;
    }

    private debugInfo(k: string): void
    {
    }
}
