import { AdvancedMap, FileUtilities, IAssetManager } from '../../core';
import { Application } from '../Application';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadLibrary } from './EffectAssetDownloadLibrary';

export class EffectAssetDownloadManager
{
    private _assets: IAssetManager;
    private _structure: AvatarStructure;

    private _missingMandatoryLibs: string[];
    private _effectMap: AdvancedMap<string, EffectAssetDownloadLibrary[]>;
    private _libraryNames: string[];

    constructor(assets: IAssetManager, structure: AvatarStructure)
    {
        this._assets = assets;
        this._structure = structure;

        this._missingMandatoryLibs = Application.instance.getConfiguration<string[]>('avatar.mandatory.effect.libraries');
        this._effectMap = new AdvancedMap();
        this._libraryNames = [];
    }

    public async loadEffectMap(): Promise<void>
    {
        const url = Application.instance.getConfiguration<string>('avatar.effectmap.url');

        const data = await FileUtilities.readFileAsString(url);
        const json = JSON.parse(data);

        this.processEffectMap(json.effects);

        await this.processMissingLibraries();
    }

    private processEffectMap(data: any): void
    {
        if(!data) return;

        const avatarEffectAssetUrl = Application.instance.getConfiguration<string>('avatar.asset.effect.url');

        for(const effect of data)
        {
            if(!effect) continue;

            const id = (effect.id as string);
            const lib = (effect.lib as string);
            const revision = (effect.revision || '');

            if(this._libraryNames.indexOf(lib) >= 0) continue;

            this._libraryNames.push(lib);

            const downloadLibrary = new EffectAssetDownloadLibrary(lib, revision, this._assets, avatarEffectAssetUrl);

            let existing = this._effectMap.getValue(id);

            if(!existing) existing = [];

            existing.push(downloadLibrary);

            this._effectMap.add(id, existing);
        }
    }

    public async downloadAvatarEffect(id: number): Promise<void>
    {
        const pendingLibraries = this.getAvatarEffectPendingLibraries(id);

        for(const library of pendingLibraries) (library && await this.downloadLibrary(library));
    }

    public async processMissingLibraries(): Promise<void>
    {
        const missingLibraries = this._missingMandatoryLibs.slice();

        for(const library of missingLibraries)
        {
            if(!library) continue;

            const libraries = this._effectMap.getValue(library);

            if(libraries) for(const library of libraries) (library && await this.downloadLibrary(library));
        }
    }

    public isAvatarEffectReady(effect: number): boolean
    {
        const pendingLibraries = this.getAvatarEffectPendingLibraries(effect);

        return !pendingLibraries.length;
    }

    private getAvatarEffectPendingLibraries(id: number): EffectAssetDownloadLibrary[]
    {
        const pendingLibraries: EffectAssetDownloadLibrary[] = [];

        if(!this._structure) return pendingLibraries;

        const libraries = this._effectMap.getValue(id.toString());

        if(libraries)
        {
            for(const library of libraries)
            {
                if(!library || library.isLoaded) continue;

                if(pendingLibraries.indexOf(library) === -1) pendingLibraries.push(library);
            }
        }

        return pendingLibraries;
    }

    private async downloadLibrary(library: EffectAssetDownloadLibrary): Promise<void>
    {
        if(!library || library.isLoaded) return;

        if(!await library.downloadAsset()) return;

        this._structure.registerAnimation(library.animation);
    }
}
