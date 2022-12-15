import { AdvancedMap, ConfigurationManager, FileUtilities } from '../core';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadLibrary } from './EffectAssetDownloadLibrary';

export class EffectAssetDownloadManager
{
    private _structure: AvatarStructure;

    private _missingMandatoryLibs: string[] = [];
    private _effectMap: AdvancedMap<string, EffectAssetDownloadLibrary[]> = new AdvancedMap();
    private _libraryNames: string[] = [];

    constructor(structure: AvatarStructure)
    {
        this._structure = structure;

        this._missingMandatoryLibs = ConfigurationManager.getValue<string[]>('avatar.mandatory.effect.libraries');
    }

    public async loadEffectMap(): Promise<void>
    {
        const url = (process.env.AVATAR_EFFECTMAP_URL as string);

        if(!url || !url.length) throw new Error('invalid_effectmap_url');

        const data = await FileUtilities.readFileAsString(url);
        const json = JSON.parse(data);

        this.processEffectMap(json.effects);

        await this.processMissingLibraries();
    }

    private processEffectMap(data: any): void
    {
        if(!data) return;

        const url = (process.env.AVATAR_ASSET_EFFECT_URL as string);

        if(!url || !url.length) return;

        for(const effect of data)
        {
            if(!effect) continue;

            const id = (effect.id as string);
            const lib = (effect.lib as string);
            const revision = (effect.revision || '');

            if(this._libraryNames.indexOf(lib) >= 0) continue;

            this._libraryNames.push(lib);

            const downloadLibrary = new EffectAssetDownloadLibrary(lib, revision, url);

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
