import * as express from 'express';
import { INitroCore, NitroManager } from '../core';
import { AvatarRenderManager, IAvatarRenderManager } from './avatar';
import { IApplication } from './IApplication';
import { HttpRouter } from './router/HttpRouter';

export class Application extends NitroManager implements IApplication
{
    private static INSTANCE: IApplication = null;

    private _core: INitroCore;
    private _avatar: IAvatarRenderManager;

    constructor(core: INitroCore)
    {
        super();

        Application.INSTANCE = this;

        this._core = core;
        this._avatar = new AvatarRenderManager(core.asset);
    }

    protected async onInit(): Promise<void>
    {
        if(this._core) await this._core.init();

        if(this._avatar) await this._avatar.init();

        this.setupRouter();

        this.logger.log(`Initialized`);
    }

    protected async onDispose(): Promise<void>
    {
        if(this._avatar) await this._avatar.dispose();

        if(this._core) await this._core.dispose();
    }

    public getConfiguration<T>(key: string, value: T = null): T
    {
        return this._core.configuration.getValue<T>(key, value);
    }

    private setupRouter(): void
    {
        const router = express();

        router.use('/', HttpRouter);

        const host = this.getConfiguration<string>('api.host');
        const port = this.getConfiguration<number>('api.port');

        router.listen(port, host, () =>
        {
            this.logger.log(`Server Started ${ host }:${ port }`);
        });
    }

    public get core(): INitroCore
    {
        return this._core;
    }

    public get avatar(): IAvatarRenderManager
    {
        return this._avatar;
    }

    public static get instance(): IApplication
    {
        return this.INSTANCE;
    }
}
