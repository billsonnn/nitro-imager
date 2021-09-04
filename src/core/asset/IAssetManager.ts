import { INitroManager } from '../common';
import { AdvancedMap, Texture } from '../utils';
import { NitroBundle } from './NitroBundle';
import { IGraphicAsset, IGraphicAssetCollection } from './utils';

export interface IAssetManager extends INitroManager
{
    getTexture(name: string): Texture;
    setTexture(name: string, texture: Texture): void;
    getAsset(name: string): IGraphicAsset;
    getCollection(name: string): IGraphicAssetCollection;
    createCollectionFromNitroBundle(bundle: NitroBundle): IGraphicAssetCollection;
    downloadAssets(urls: string[]): Promise<boolean>;
    downloadAsset(url: string): Promise<boolean>;
    collections: AdvancedMap<string, IGraphicAssetCollection>;
}
