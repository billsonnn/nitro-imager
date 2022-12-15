import { AssetManager } from '../core';

export class AvatarAssetDownloadLibrary
{
    private static NOT_LOADED: number = 0;
    private static LOADING: number = 1;
    private static LOADED: number = 2;

    private _state: number;
    private _libraryName: string;
    private _revision: string;
    private _downloadUrl: string;

    constructor(id: string, revision: string, assetUrl: string)
    {
        this._state = AvatarAssetDownloadLibrary.NOT_LOADED;
        this._libraryName = id;
        this._revision = revision;
        this._downloadUrl = assetUrl;

        this._downloadUrl = this._downloadUrl.replace(/%libname%/gi, this._libraryName);
        this._downloadUrl = this._downloadUrl.replace(/%revision%/gi, this._revision);

        this.checkIfAssetLoaded();
    }

    private checkIfAssetLoaded(): boolean
    {
        if(this._state === AvatarAssetDownloadLibrary.LOADED) return true;

        const asset = AssetManager.getCollection(this._libraryName);

        if(asset)
        {
            this._state = AvatarAssetDownloadLibrary.LOADED;

            return true;
        }

        return false;
    }

    public async downloadAsset(): Promise<boolean>
    {
        if(this._state === AvatarAssetDownloadLibrary.LOADING) return false;

        if(this.checkIfAssetLoaded()) return false;

        this._state = AvatarAssetDownloadLibrary.LOADING;

        if(!await AssetManager.downloadAsset(this._downloadUrl)) return false;

        this._state = AvatarAssetDownloadLibrary.LOADED;

        return true;
    }

    public get libraryName(): string
    {
        return this._libraryName;
    }

    public get isLoaded(): boolean
    {
        return (this._state === AvatarAssetDownloadLibrary.LOADED);
    }
}
