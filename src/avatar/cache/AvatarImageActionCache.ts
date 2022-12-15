import { AdvancedMap } from '../../core';
import { AvatarImageDirectionCache } from './AvatarImageDirectionCache';

export class AvatarImageActionCache
{
    private _cache: AdvancedMap<string, AvatarImageDirectionCache>;
    private _lastAccessTime: number;

    constructor()
    {
        this._cache = new AdvancedMap();

        this.setLastAccessTime(0);
    }

    public dispose(): void
    {
        this.debugInfo('[dispose]');

        if(!this._cache) return;

        for(const direction of this._cache.getValues())
        {
            if(direction) direction.dispose();
        }

        this._cache.reset();
    }

    public getDirectionCache(k: number): AvatarImageDirectionCache
    {
        const existing = this._cache.getValue(k.toString());

        if(!existing) return null;

        return existing;
    }

    public updateDirectionCache(k: number, _arg_2: AvatarImageDirectionCache): void
    {
        this._cache.add(k.toString(), _arg_2);
    }

    public setLastAccessTime(k: number): void
    {
        this._lastAccessTime = k;
    }

    public getLastAccessTime(): number
    {
        return this._lastAccessTime;
    }

    private debugInfo(k: string): void
    {
    }
}
