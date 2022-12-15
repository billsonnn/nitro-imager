import { AdvancedMap, IAssetAnimation, IAssetAnimationFrame } from '../../core';
import { AvatarStructure } from '../AvatarStructure';
import { AddDataContainer } from './AddDataContainer';
import { AvatarAnimationLayerData } from './AvatarAnimationLayerData';
import { AvatarDataContainer } from './AvatarDataContainer';
import { DirectionDataContainer } from './DirectionDataContainer';
import { IAnimation } from './IAnimation';
import { SpriteDataContainer } from './SpriteDataContainer';

export class Animation implements IAnimation
{
    private static EMPTY_ARRAY: any[] = [];

    private _id: string;
    private _description: string;
    private _frames: AvatarAnimationLayerData[][];
    private _spriteData: SpriteDataContainer[];
    private _avatarData: AvatarDataContainer;
    private _directionData: DirectionDataContainer;
    private _removeData: string[];
    private _addData: AddDataContainer[];
    private _overriddenActions: AdvancedMap<string, string>;
    private _overrideFrames: AdvancedMap<string, AvatarAnimationLayerData[][]>;
    private _resetOnToggle: boolean;

    constructor(structure: AvatarStructure, animation: IAssetAnimation)
    {
        this._id = animation.name;
        this._description = this._id;
        this._frames = [];
        this._spriteData = null;
        this._avatarData = null;
        this._directionData = null;
        this._removeData = null;
        this._addData = null;
        this._overriddenActions = null;
        this._overrideFrames = null;
        this._resetOnToggle = (animation.resetOnToggle || false);

        if(animation.sprites && animation.sprites.length)
        {
            this._spriteData = [];

            for(const sprite of animation.sprites) this._spriteData.push(new SpriteDataContainer(this, sprite));
        }

        if(animation.avatars && animation.avatars.length) this._avatarData = new AvatarDataContainer(animation.avatars[0]);

        if(animation.directions && animation.directions.length) this._directionData = new DirectionDataContainer(animation.directions[0]);

        if(animation.removes && animation.removes.length)
        {
            this._removeData = [];

            for(const remove of animation.removes) this._removeData.push(remove.id);
        }

        if(animation.adds && animation.adds.length)
        {
            this._addData = [];

            for(const add of animation.adds) this._addData.push(new AddDataContainer(add));
        }

        if(animation.overrides && animation.overrides.length)
        {
            this._overrideFrames = new AdvancedMap();
            this._overriddenActions = new AdvancedMap();

            for(const override of animation.overrides)
            {
                const name = override.name;
                const value = override.override;

                this._overriddenActions.add(value, name);

                const frames: AvatarAnimationLayerData[][] = [];

                this.parseFrames(frames, override.frames, structure);

                this._overrideFrames.add(name, frames);
            }
        }

        this.parseFrames(this._frames, animation.frames, structure);
    }

    private parseFrames(frames: AvatarAnimationLayerData[][], animationFrame: IAssetAnimationFrame[], structure: AvatarStructure): void
    {
        if(!animationFrame || !animationFrame.length) return;

        for(const frame of animationFrame)
        {
            let repeats = 1;

            if(frame.repeats && (frame.repeats > 1)) repeats = frame.repeats;

            let index = 0;

            while(index < repeats)
            {
                const layers: AvatarAnimationLayerData[] = [];

                if(frame.bodyparts && frame.bodyparts.length)
                {
                    for(const bodyPart of frame.bodyparts)
                    {
                        const definition = structure.getActionDefinition(bodyPart.action);
                        const layer = new AvatarAnimationLayerData(bodyPart, AvatarAnimationLayerData.BODYPART, definition);

                        layers.push(layer);
                    }
                }

                if(frame.fxs && frame.fxs.length)
                {
                    for(const fx of frame.fxs)
                    {
                        const definition = structure.getActionDefinition(fx.action);
                        const layer = new AvatarAnimationLayerData(fx, AvatarAnimationLayerData.FX, definition);

                        layers.push(layer);
                    }
                }

                frames.push(layers);

                index++;
            }
        }
    }

    public frameCount(frame: string = null): number
    {
        if(!frame) return this._frames.length;

        if(this._overrideFrames)
        {
            const layerData = this._overrideFrames.getValue(frame);

            if(layerData) return layerData.length;
        }

        return 0;
    }

    public hasOverriddenActions(): boolean
    {
        if(!this._overriddenActions) return false;

        return (this._overriddenActions.length > 0);
    }

    public overriddenActionNames(): string[]
    {
        if(!this._overriddenActions) return null;

        const keys: string[] = [];

        for(const key of this._overriddenActions.getKeys()) keys.push(key);

        return keys;
    }

    public overridingAction(action: string): string
    {
        if(!this._overriddenActions) return null;

        return this._overriddenActions.getValue(action);
    }

    private getFrame(frameCount: number, frame: string = null): AvatarAnimationLayerData[]
    {
        if(frameCount < 0) frameCount = 0;

        let layers: AvatarAnimationLayerData[] = [];

        if(!frame)
        {
            if(this._frames.length > 0)
            {
                layers = this._frames[(frameCount % this._frames.length)];
            }
        }
        else
        {
            const overrideLayers = this._overrideFrames.getValue(frame);

            if(overrideLayers && (overrideLayers.length > 0))
            {
                layers = overrideLayers[(frameCount % overrideLayers.length)];
            }
        }

        return layers;
    }

    public getAnimatedBodyPartIds(frameCount: number, frame: string = null): string[]
    {
        const partIds: string[] = [];

        for(const layer of this.getFrame(frameCount, frame))
        {
            if(layer.type === AvatarAnimationLayerData.BODYPART)
            {
                partIds.push(layer.id);
            }

            else if(layer.type === AvatarAnimationLayerData.FX)
            {
                if(this._addData && this._addData.length)
                {
                    for(const _local_5 of this._addData)
                    {
                        if(_local_5.id === layer.id) partIds.push(_local_5.align);
                    }
                }
            }
        }

        return partIds;
    }

    public getLayerData(frameCount: number, spriteId: string, frame: string = null): AvatarAnimationLayerData
    {
        for(const layer of this.getFrame(frameCount, frame))
        {
            if(layer.id === spriteId) return layer;

            if(layer.type === AvatarAnimationLayerData.FX)
            {
                if(this._addData && this._addData.length)
                {
                    for(const addData of this._addData)
                    {
                        if(((addData.align === spriteId) && (addData.id === layer.id))) return layer;
                    }
                }
            }
        }

        return null;
    }

    public hasAvatarData(): boolean
    {
        return (this._avatarData !== null);
    }

    public hasDirectionData(): boolean
    {
        return (this._directionData !== null);
    }

    public hasAddData(): boolean
    {
        return (this._addData !== null);
    }

    public getAddData(id: string): AddDataContainer
    {
        if(this._addData)
        {
            for(const data of this._addData)
            {
                if(data.id === id) return data;
            }
        }

        return null;
    }

    public get id(): string
    {
        return this._id;
    }

    public get spriteData(): SpriteDataContainer[]
    {
        return (this._spriteData || Animation.EMPTY_ARRAY);
    }

    public get avatarData(): AvatarDataContainer
    {
        return this._avatarData;
    }

    public get directionData(): DirectionDataContainer
    {
        return this._directionData;
    }

    public get removeData(): string[]
    {
        return (this._removeData || Animation.EMPTY_ARRAY);
    }

    public get addData(): AddDataContainer[]
    {
        return (this._addData || Animation.EMPTY_ARRAY);
    }

    public toString(): string
    {
        return this._description;
    }

    public get resetOnToggle(): boolean
    {
        return this._resetOnToggle;
    }
}
