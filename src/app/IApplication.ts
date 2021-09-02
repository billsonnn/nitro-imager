import { INitroCore, INitroManager } from '../core';
import { IAvatarRenderManager } from './avatar';

export interface IApplication extends INitroManager
{
    getConfiguration<T>(key: string, value?: T): T;
    core: INitroCore;
    avatar: IAvatarRenderManager;
}
