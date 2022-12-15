import { AssetManager, IAssetAnimation } from '../core';

export class EffectAssetDownloadLibrary
{
    private static NOT_LOADED: number = 0;
    private static LOADING: number = 1;
    private static LOADED: number = 2;

    private _state: number;
    private _libraryName: string;
    private _revision: string;
    private _downloadUrl: string;
    private _animation: { [index: string]: IAssetAnimation };

    constructor(id: string, revision: string, assetUrl: string)
    {
        this._state = EffectAssetDownloadLibrary.NOT_LOADED;
        this._libraryName = id;
        this._revision = revision;
        this._downloadUrl = assetUrl;
        this._animation = null;

        this._downloadUrl = this._downloadUrl.replace(/%libname%/gi, this._libraryName);
        this._downloadUrl = this._downloadUrl.replace(/%revision%/gi, this._revision);

        this.checkIfAssetLoaded();
    }

    private checkIfAssetLoaded(): boolean
    {
        if(this._state === EffectAssetDownloadLibrary.LOADED) return true;

        const asset = AssetManager.getCollection(this._libraryName);

        if(asset)
        {
            this._state = EffectAssetDownloadLibrary.LOADED;

            return true;
        }

        return false;
    }

    public async downloadAsset(): Promise<boolean>
    {
        if(this._state === EffectAssetDownloadLibrary.LOADING) return;

        if(this.checkIfAssetLoaded()) return true;

        this._state = EffectAssetDownloadLibrary.LOADING;

        if(!await AssetManager.downloadAsset(this._downloadUrl)) return false;

        const collection = AssetManager.getCollection(this._libraryName);

        if(collection) this._animation = collection.data.animations;

        this._state = EffectAssetDownloadLibrary.LOADED;

        return true;
    }

    public get libraryName(): string
    {
        return this._libraryName;
    }

    public get animation(): { [index: string]: IAssetAnimation }
    {
        return this._animation;
    }

    public get isLoaded(): boolean
    {
        return (this._state === EffectAssetDownloadLibrary.LOADED);
    }
}
