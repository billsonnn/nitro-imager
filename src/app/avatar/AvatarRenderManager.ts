import { FileUtilities, IAssetManager, IGraphicAsset, NitroManager } from '../../core';
import { Application } from '../Application';
import { AssetAliasCollection } from './alias';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { HabboAvatarAnimations, HabboAvatarGeometry, HabboAvatarPartSets } from './data';
import { EffectAssetDownloadManager } from './EffectAssetDownloadManager';
import { AvatarSetType } from './enum';
import { FigureDataContainer } from './FigureDataContainer';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarRenderManager } from './IAvatarRenderManager';
import { IFigureData } from './interfaces';
import { IFigurePartSet, IStructureData } from './structure';

export class AvatarRenderManager extends NitroManager implements IAvatarRenderManager
{
    public static DEFAULT_FIGURE: string = 'hd-99999-99999';

    private _aliasCollection: AssetAliasCollection;

    private _assets: IAssetManager;
    private _structure: AvatarStructure;
    private _avatarAssetDownloadManager: AvatarAssetDownloadManager;
    private _effectAssetDownloadManager: EffectAssetDownloadManager;
    private _placeHolderFigure: AvatarFigureContainer;

    constructor(assets: IAssetManager)
    {
        super();

        this._assets = assets;
        this._structure = null;
        this._avatarAssetDownloadManager = null;
        this._effectAssetDownloadManager = null;
        this._placeHolderFigure = null;
    }

    public async onInit(): Promise<void>
    {
        this._structure = new AvatarStructure(this);

        this._structure.initGeometry(HabboAvatarGeometry.geometry);
        this._structure.initPartSets(HabboAvatarPartSets.partSets);
        this._structure.initAnimation(HabboAvatarAnimations.animations);
        await this.loadActions();
        this.loadFigureData();

        this._aliasCollection = new AssetAliasCollection(this, this._assets);

        this._aliasCollection.init();

        if(!this._avatarAssetDownloadManager)
        {
            this._avatarAssetDownloadManager = new AvatarAssetDownloadManager(this._assets, this._structure);

            await this._avatarAssetDownloadManager.loadFigureMap();
        }

        if(!this._effectAssetDownloadManager)
        {
            this._effectAssetDownloadManager = new EffectAssetDownloadManager(this._assets, this._structure);

            await this._effectAssetDownloadManager.loadEffectMap();
        }
    }

    private async loadActions(): Promise<void>
    {
        this._structure.initActions({
            "actions": [
                {
                    "id": "Default",
                    "state": "std",
                    "precedence": 1000,
                    "main": true,
                    "isDefault": true,
                    "geometryType": "vertical",
                    "activePartSet": "figure",
                    "assetPartDefinition": "std"
                }
            ]
        });

        const url = Application.instance.getConfiguration<string>('avatar.actions.url');

        const data = await FileUtilities.readFileAsString(url);

        this._structure.updateActions(JSON.parse(data));
    }

    private async loadFigureData(): Promise<void>
    {
        const defaultFigureData = Application.instance.getConfiguration<IFigureData>('avatar.default.figuredata');

        if(this._structure) this._structure.initFigureData(defaultFigureData);

        const url = Application.instance.getConfiguration<string>('avatar.figuredata.url');

        const data = await FileUtilities.readFileAsString(url);

        this._structure.figureData.appendJSON(JSON.parse(data));
    }

    public createFigureContainer(figure: string): IAvatarFigureContainer
    {
        return new AvatarFigureContainer(figure);
    }

    public isFigureContainerReady(container: IAvatarFigureContainer): boolean
    {
        if(!this._avatarAssetDownloadManager) return false;

        return this._avatarAssetDownloadManager.isAvatarFigureContainerReady(container);
    }

    public async createAvatarImage(figure: string, size: string, gender: string): Promise<IAvatarImage>
    {
        if(!this._structure || !this._avatarAssetDownloadManager) return null;

        const figureContainer = new AvatarFigureContainer(figure);

        if(gender) this.validateAvatarFigure(figureContainer, gender);

        if(!this._avatarAssetDownloadManager.isAvatarFigureContainerReady(figureContainer))
        {
            await this._avatarAssetDownloadManager.downloadAvatarFigure(figureContainer);
        }

        if(!this._placeHolderFigure) this._placeHolderFigure = new AvatarFigureContainer(AvatarRenderManager.DEFAULT_FIGURE);

        return new AvatarImage(this._structure, this._aliasCollection, figureContainer, size, this._effectAssetDownloadManager);
    }

    public async downloadAvatarFigure(container: IAvatarFigureContainer): Promise<void>
    {
        if(!this._avatarAssetDownloadManager) return;

        await this._avatarAssetDownloadManager.downloadAvatarFigure(container);
    }

    private validateAvatarFigure(container: AvatarFigureContainer, gender: string): boolean
    {
        let isValid = false;

        const typeIds = this._structure.getMandatorySetTypeIds(gender, 2);

        if(typeIds)
        {
            const figureData = this._structure.figureData;

            for(const id of typeIds)
            {
                if(!container.hasPartType(id))
                {
                    const figurePartSet = this._structure.getDefaultPartSet(id, gender);

                    if(figurePartSet)
                    {
                        container.updatePart(id, figurePartSet.id, [0]);

                        isValid = true;
                    }
                }
                else
                {
                    const setType = figureData.getSetType(id);

                    if(setType)
                    {
                        const figurePartSet = setType.getPartSet(container.getPartSetId(id));

                        if(!figurePartSet)
                        {
                            const partSet = this._structure.getDefaultPartSet(id, gender);

                            if(partSet)
                            {
                                container.updatePart(id, partSet.id, [0]);

                                isValid = true;
                            }
                        }
                    }
                }
            }
        }

        return !(isValid);
    }

    public getFigureClubLevel(container: IAvatarFigureContainer, gender: string, searchParts: string[]): number
    {
        if(!this._structure) return 0;

        const figureData    = this._structure.figureData;
        const parts         = Array.from(container.getPartTypeIds());

        let clubLevel = 0;

        for(const part of parts)
        {
            const set       = figureData.getSetType(part);
            const setId     = container.getPartSetId(part);
            const partSet   = set.getPartSet(setId);

            if(partSet)
            {
                clubLevel = Math.max(partSet.clubLevel, clubLevel);

                const palette   = figureData.getPalette(set.paletteID);
                const colors   = container.getPartColorIds(part);

                for(const colorId of colors)
                {
                    const color = palette.getColor(colorId);

                    clubLevel = Math.max(color.clubLevel, clubLevel);
                }
            }
        }

        if(!searchParts) searchParts = this._structure.getBodyPartsUnordered(AvatarSetType.FULL);

        for(const part of searchParts)
        {
            const set = figureData.getSetType(part);

            if(parts.indexOf(part) === -1) clubLevel = Math.max(set.optionalFromClubLevel(gender), clubLevel);
        }

        return clubLevel;
    }

    public isValidFigureSetForGender(setId: number, gender: string): boolean
    {
        const structure = this.structureData;
        const partSet   = structure.getFigurePartSet(setId);

        return !!(partSet && ((partSet.gender.toUpperCase() === 'U') || (partSet.gender.toUpperCase() === gender.toUpperCase())));
    }

    public getFigureStringWithFigureIds(k: string, _arg_2: string, _arg_3: number[]): string
    {
        const container = new FigureDataContainer();

        container.loadAvatarData(k, _arg_2);

        const partSets: IFigurePartSet[] = this.resolveFigureSets(_arg_3);

        for(const partSet of partSets)
        {
            container.savePartData(partSet.type, partSet.id, container.getColourIds(partSet.type));
        }

        return container.getFigureString();
    }

    private resolveFigureSets(k: number[]): IFigurePartSet[]
    {
        const structure                     = this.structureData;
        const partSets: IFigurePartSet[]   = [];

        for(const _local_4 of k)
        {
            const partSet = structure.getFigurePartSet(_local_4);

            if(partSet) partSets.push(partSet);
        }

        return partSets;
    }

    public getMandatoryAvatarPartSetIds(k: string, _arg_2: number): string[]
    {
        if(!this._structure) return null;

        return this._structure.getMandatorySetTypeIds(k, _arg_2);
    }

    public getAssetByName(name: string): IGraphicAsset
    {
        return this._aliasCollection.getAsset(name);
    }

    public get assets(): IAssetManager
    {
        return this._assets;
    }

    public get structure(): AvatarStructure
    {
        return this._structure;
    }

    public get structureData(): IStructureData
    {
        if(this._structure) return this._structure.figureData;

        return null;
    }

    public get downloadManager(): AvatarAssetDownloadManager
    {
        return this._avatarAssetDownloadManager;
    }

    public get effectManager(): EffectAssetDownloadManager
    {
        return this._effectAssetDownloadManager;
    }
}
