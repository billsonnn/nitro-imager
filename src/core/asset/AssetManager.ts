import { Canvas } from 'canvas';
import { NitroManager } from '../common';
import { AdvancedMap, FileUtilities } from '../utils';
import { IAssetManager } from './IAssetManager';
import { NitroBundle } from './NitroBundle';
import { GraphicAssetCollection, IGraphicAsset, IGraphicAssetCollection } from './utils';

export class AssetManager extends NitroManager implements IAssetManager
{
    private _textures: AdvancedMap<string, Canvas>;
    private _collections: AdvancedMap<string, IGraphicAssetCollection>;

    constructor()
    {
        super();

        this._textures = new AdvancedMap();
        this._collections = new AdvancedMap();
    }

    public getTexture(name: string): Canvas
    {
        if(!name) return null;

        const existing = this._textures.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: Canvas): void
    {
        if(!name || !texture) return;

        this._textures.add(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
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

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public createCollectionFromNitroBundle(bundle: NitroBundle): IGraphicAssetCollection
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

    public async downloadAsset(assetUrl: string): Promise<boolean>
    {
        return await this.downloadAssets([ assetUrl ]);
    }

    public async downloadAssets(assetUrls: string[]): Promise<boolean>
    {
        if(!assetUrls || !assetUrls.length) return false;

        for(const url of assetUrls)
        {
            try
            {
                const buffer = await FileUtilities.readFileAsBuffer(url);
                const bundle = await NitroBundle.from(buffer);

                this.createCollectionFromNitroBundle(bundle);
            }

            catch(err)
            {

            }
        }

        return true;
    }

    public get collections(): AdvancedMap<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
