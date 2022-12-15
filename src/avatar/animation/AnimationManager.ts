import { AdvancedMap, IAssetAnimation } from '../../core';
import { AvatarStructure } from '../AvatarStructure';
import { Animation } from './Animation';
import { IAnimation } from './IAnimation';
import { IAnimationLayerData } from './IAnimationLayerData';
import { IAnimationManager } from './IAnimationManager';

export class AnimationManager implements IAnimationManager
{
    private _animations: AdvancedMap<string, Animation>;

    constructor()
    {
        this._animations = new AdvancedMap();
    }

    public registerAnimation(structure: AvatarStructure, animations: { [index: string]: IAssetAnimation }): boolean
    {
        const animationData = animations[Object.keys(animations)[0]];

        const animation = new Animation(structure, animationData);

        this._animations.add(animationData.name, animation);

        return true;
    }

    public getAnimation(animation: string): Animation
    {
        const existing = this._animations.getValue(animation);

        if(!existing) return null;

        return existing;
    }

    public getLayerData(animation: string, frameCount: number, spriteId: string): IAnimationLayerData
    {
        const existing = this.getAnimation(animation);

        if(!existing) return null;

        return existing.getLayerData(frameCount, spriteId);
    }

    public get animations(): AdvancedMap<string, IAnimation>
    {
        return this._animations;
    }
}
