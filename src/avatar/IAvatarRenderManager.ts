import { IGraphicAsset } from '../core';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadManager } from './EffectAssetDownloadManager';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';
import { IAvatarImage } from './IAvatarImage';
import { IStructureData } from './structure/IStructureData';

export interface IAvatarRenderManager
{
    init: () => Promise<void>;
    createFigureContainer(figure: string): IAvatarFigureContainer;
    isFigureContainerReady(container: IAvatarFigureContainer): boolean;
    createAvatarImage(figure: string, size: string, gender: string): Promise<IAvatarImage>;
    downloadAvatarFigure(container: IAvatarFigureContainer): void;
    getFigureClubLevel(container: IAvatarFigureContainer, gender: string, searchParts: string[]): number;
    isValidFigureSetForGender(setId: number, gender: string): boolean;
    getFigureStringWithFigureIds(k: string, _arg_2: string, _arg_3: number[]): string;
    getMandatoryAvatarPartSetIds(k: string, _arg_2: number): string[];
    getAssetByName(name: string): IGraphicAsset;
    structure: AvatarStructure;
    structureData: IStructureData;
    downloadManager: AvatarAssetDownloadManager;
    effectManager: EffectAssetDownloadManager;
}
