import { AssetManager, IAssetManager } from './asset';
import { NitroManager } from './common';
import { ConfigurationManager, IConfigurationManager } from './configuration';
import { INitroCore } from './INitroCore';

export class NitroCore extends NitroManager implements INitroCore
{
    private _configuration: IConfigurationManager;
    private _asset: IAssetManager;

    constructor()
    {
        super();

        this._configuration = new ConfigurationManager();
        this._asset = new AssetManager();
    }

    protected async onInit(): Promise<void>
    {
        try
        {
            if(this._configuration) await this._configuration.init();

            if(this._asset) await this._asset.init();
        }

        catch(err)
        {
            this.logger.error(err.message || err);
        }
    }

    protected async onDispose(): Promise<void>
    {
        if(this._asset) await this._asset.dispose();

        if(this._configuration) await this._configuration.dispose();
    }

    public get configuration(): IConfigurationManager
    {
        return this._configuration;
    }

    public get asset(): IAssetManager
    {
        return this._asset;
    }
}
