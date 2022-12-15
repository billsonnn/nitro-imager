import { IAssetData } from '.';
import { GraphicAssetPalette } from '../utils/GraphicAssetPalette';
import { IGraphicAsset } from './IGraphicAsset';

export interface IGraphicAssetCollection
{
    dispose(): void;
    define(data: IAssetData): void;
    getAsset(name: string): IGraphicAsset;
    getAssetWithPalette(name: string, paletteName: string): IGraphicAsset;
    getPaletteNames(): string[];
    getPaletteColors(paletteName: string): number[];
    getPalette(name: string): GraphicAssetPalette;
    disposeAsset(name: string): void;
    name: string;
    data: IAssetData;
}
