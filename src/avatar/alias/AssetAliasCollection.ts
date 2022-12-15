import { AdvancedMap, AssetManager, IGraphicAsset } from '../../core';
import { AvatarRenderManager } from '../AvatarRenderManager';
import { AssetAlias } from './AssetAlias';

export class AssetAliasCollection
{
    private _aliases: AdvancedMap<string, AssetAlias>;
    private _avatarRenderManager: AvatarRenderManager;
    private _missingAssetNames: string[];

    constructor(renderManager: AvatarRenderManager)
    {
        this._avatarRenderManager = renderManager;
        this._aliases = new AdvancedMap();
        this._missingAssetNames = [];
    }

    public dispose(): void
    {
        this._aliases = null;
    }

    public reset(): void
    {
        this.init();
    }

    public init(): void
    {
        for(const collection of AssetManager.collections.getValues())
        {
            if(!collection) continue;

            const aliases = collection.data && collection.data.aliases;

            if(!aliases) continue;

            for(const name in aliases)
            {
                const alias = aliases[name];

                if(!alias) continue;

                this._aliases.add(name, new AssetAlias(name, alias));
            }
        }
    }

    public hasAlias(name: string): boolean
    {
        const alias = this._aliases.getValue(name);

        if(alias) return true;

        return false;
    }

    public getAssetName(k: string): string
    {
        let linkName = k;
        let tries = 5;

        while(this.hasAlias(linkName) && (tries >= 0))
        {
            const alias = this._aliases.getValue(linkName);

            linkName = alias.link;
            tries--;
        }

        return linkName;
    }

    public getAsset(name: string): IGraphicAsset
    {
        name = this.getAssetName(name);

        const asset = AssetManager.getAsset(name);

        if(!asset) return null;

        return asset;
    }
}
