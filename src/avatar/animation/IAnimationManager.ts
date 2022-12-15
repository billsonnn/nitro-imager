import { AdvancedMap } from '../../core';
import { IAnimation } from './IAnimation';
import { IAnimationLayerData } from './IAnimationLayerData';

export interface IAnimationManager
{
    animations: AdvancedMap<any, any>;
    getAnimation(animation: string): IAnimation;
    getLayerData(animation: string, frameCount: number, spriteId: string): IAnimationLayerData;
}
