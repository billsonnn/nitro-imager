import { IAssetManager } from './asset';
import { INitroManager } from './common';
import { IConfigurationManager } from './configuration';

export interface INitroCore extends INitroManager
{
    configuration: IConfigurationManager;
    asset: IAssetManager;
}
