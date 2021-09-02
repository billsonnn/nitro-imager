import { Canvas } from 'canvas';
import { INitroManager } from '../common';
import { NitroBundle } from './NitroBundle';
import { IGraphicAsset, IGraphicAssetCollection } from './utils';

export interface IAssetManager extends INitroManager
{
    getTexture(name: string): Canvas;
    setTexture(name: string, texture: Canvas): void;
    getAsset(name: string): IGraphicAsset;
    getCollection(name: string): IGraphicAssetCollection;
    createCollectionFromNitroBundle(bundle: NitroBundle): IGraphicAssetCollection;
    downloadAssets(urls: string[]): Promise<boolean>;
    downloadAsset(url: string): Promise<boolean>;
    collections: AdvancedMap<string, IGraphicAssetCollection>;
}
