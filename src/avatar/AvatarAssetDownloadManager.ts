import { AdvancedMap, ConfigurationManager, FileUtilities } from '../core';
import { AvatarAssetDownloadLibrary } from './AvatarAssetDownloadLibrary';
import { AvatarStructure } from './AvatarStructure';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';

export class AvatarAssetDownloadManager
{
    private _structure: AvatarStructure;

    private _missingMandatoryLibs: string[] = [];
    private _figureMap: AdvancedMap<string, AvatarAssetDownloadLibrary[]> = new AdvancedMap();
    private _libraryNames: string[] = [];

    constructor(structure: AvatarStructure)
    {
        this._structure = structure;

        this._missingMandatoryLibs = ConfigurationManager.getValue<string[]>('avatar.mandatory.libraries');
    }

    public async loadFigureMap(): Promise<void>
    {
        const url = (process.env.AVATAR_FIGUREMAP_URL as string);

        if(!url || !url.length) throw new Error('invalid_figuremap_url');

        const data = await FileUtilities.readFileAsString(url);
        const json = JSON.parse(data);

        this.processFigureMap(json.libraries);

        await this.processMissingLibraries();
    }

    private processFigureMap(data: any): void
    {
        if(!data) return;

        const url = (process.env.AVATAR_ASSET_URL as string);

        if(!url || !url.length) return;

        for(const library of data)
        {
            if(!library) continue;

            const id = (library.id as string);
            const revision = (library.revision || '');

            if(this._libraryNames.indexOf(id) >= 0) continue;

            this._libraryNames.push(id);

            const downloadLibrary = new AvatarAssetDownloadLibrary(id, revision, url);

            for(const part of library.parts)
            {
                const id = (part.id as string);
                const type = (part.type as string);
                const partString = (type + ':' + id);

                let existing = this._figureMap.getValue(partString);

                if(!existing) existing = [];

                existing.push(downloadLibrary);

                this._figureMap.add(partString, existing);
            }
        }
    }

    public async processMissingLibraries(): Promise<void>
    {
        const missingLibraries = this._missingMandatoryLibs.slice();

        for(const library of missingLibraries)
        {
            if(!library) continue;

            const libraries = this._figureMap.getValue(library);

            if(libraries) for(const library of libraries) (library && await this.downloadLibrary(library));
        }
    }

    public isAvatarFigureContainerReady(container: IAvatarFigureContainer): boolean
    {
        const pendingLibraries = this.getAvatarFigurePendingLibraries(container);

        return !pendingLibraries.length;
    }

    private getAvatarFigurePendingLibraries(container: IAvatarFigureContainer): AvatarAssetDownloadLibrary[]
    {
        const pendingLibraries: AvatarAssetDownloadLibrary[] = [];

        if(!container || !this._structure) return pendingLibraries;

        const figureData = this._structure.figureData;

        if(!figureData) return pendingLibraries;

        const setKeys = container.getPartTypeIds();

        for(const key of setKeys)
        {
            const set = figureData.getSetType(key);

            if(!set) continue;

            const figurePartSet = set.getPartSet(container.getPartSetId(key));

            if(!figurePartSet) continue;

            for(const part of figurePartSet.parts)
            {
                if(!part) continue;

                const name = (part.type + ':' + part.id);
                const existing = this._figureMap.getValue(name);

                if(existing === undefined) continue;

                for(const library of existing)
                {
                    if(!library || library.isLoaded) continue;

                    if(pendingLibraries.indexOf(library) >= 0) continue;

                    pendingLibraries.push(library);
                }
            }
        }

        return pendingLibraries;
    }

    public async downloadAvatarFigure(container: IAvatarFigureContainer): Promise<void>
    {
        const pendingLibraries = this.getAvatarFigurePendingLibraries(container);

        for(const library of pendingLibraries) (library && await this.downloadLibrary(library));
    }

    private async downloadLibrary(library: AvatarAssetDownloadLibrary): Promise<void>
    {
        if(!library || library.isLoaded) return;

        if(!await library.downloadAsset()) return;
    }
}
