import { AdvancedMap, FileUtilities, Texture } from '../utils';
import { IGraphicAsset, IGraphicAssetCollection } from './interfaces';
import { NitroBundle } from './NitroBundle';
import { GraphicAssetCollection } from './utils';

export class AssetManager
{
    private static _textures: AdvancedMap<string, Texture> = new AdvancedMap();
    private static _collections: AdvancedMap<string, IGraphicAssetCollection> = new AdvancedMap();

    public static getTexture(name: string): Texture
    {
        if(!name) return null;

        const existing = this._textures.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public static setTexture(name: string, texture: Texture): void
    {
        if(!name || !texture) return;

        this._textures.add(name, texture);
    }

    public static getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(const collection of this._collections.getValues())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        return null;
    }

    public static getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public static createCollectionFromNitroBundle(bundle: NitroBundle): IGraphicAssetCollection
    {
        const collection = new GraphicAssetCollection(bundle.jsonFile, bundle.baseTexture);

        if(collection)
        {
            for(const [ name, texture ] of collection.textures.getKeys())
            {
                const texture = collection.textures.getValue(name);

                this.setTexture(name, texture);
            }

            this._collections.add(collection.name, collection);
        }

        return collection;
    }

    public static async downloadAsset(assetUrl: string): Promise<boolean>
    {
        return await this.downloadAssets([ assetUrl ]);
    }

    public static async downloadAssets(assetUrls: string[]): Promise<boolean>
    {
        if(!assetUrls || !assetUrls.length) return false;

        for(const url of assetUrls)
        {
            const buffer = await FileUtilities.readFileAsBuffer(url);
            const bundle = await NitroBundle.from(buffer);

            this.createCollectionFromNitroBundle(bundle);
        }

        return true;
    }

    public static get collections(): AdvancedMap<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
