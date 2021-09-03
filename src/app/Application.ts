import { INitroCore, NitroManager } from '../core';
import { AvatarRenderManager, AvatarScaleType, AvatarSetType, IAvatarRenderManager } from './avatar';
import { IApplication } from './IApplication';

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

        const image = await this._avatar.createAvatarImage('hd-207-14.lg-3216-1408.cc-3007-86-88.ha-3054-1408-1408.he-3079-64.ea-1402-0.ch-230-72.hr-110-40', AvatarScaleType.LARGE, 'M');

        //image.setDirection(AvatarSetType.FULL, 4);
        const canvas = await image.getImage(AvatarSetType.FULL, false);
        console.log(canvas.toDataURL());

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
