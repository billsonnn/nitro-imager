import { INitroLogger, NitroLogger } from '../logger';
import { Disposable } from './disposable';
import { INitroManager } from './INitroManager';

export class NitroManager extends Disposable implements INitroManager
{
    private _logger: INitroLogger;

    private _isLoaded: boolean;
    private _isLoading: boolean;

    constructor(logger: INitroLogger = null)
    {
        super();

        this._logger = logger instanceof NitroLogger ? logger : new NitroLogger(this.constructor.name);

        this._isLoaded = false;
        this._isLoading = false;
    }

    public async init(): Promise<void>
    {
        if(this._isLoaded || this._isLoading || this.isDisposing) return;

        this._isLoading = true;

        try
        {
            await this.onInit();
        }

        catch(err)
        {
            this.logger.error(err.message || err);

            return;
        }

        this._isLoaded = true;
        this._isLoading = false;
    }

    protected async onInit(): Promise<void>
    {
        return;
    }

    public get logger(): INitroLogger
    {
        return this._logger;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }
}
