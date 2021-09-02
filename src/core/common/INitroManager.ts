import { INitroLogger } from '../logger';
import { IDisposable } from './disposable/IDisposable';

export interface INitroManager extends IDisposable
{
    init(): Promise<void>;
    logger: INitroLogger;
    isLoaded: boolean;
    isLoading: boolean;
}
