import { Canvas } from 'canvas';
import { IGraphicAsset } from '../core';
import { IActiveActionData } from './actions';
import { IAnimationLayerData, IAvatarDataContainer, ISpriteDataContainer } from './animation';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';
import { IPartColor } from './structure';

export interface IAvatarImage
{
    setDirection(_arg_1: string, _arg_2: number): void;
    setDirectionAngle(_arg_1: string, _arg_2: number): void;
    updateAnimationByFrames(_arg_1?: number): void;
    getScale(): string;
    getSprites(): ISpriteDataContainer[];
    getLayerData(_arg_1: ISpriteDataContainer): IAnimationLayerData;
    getImage(setType: string, bgColor?: number, hightlight?: boolean, scale?: number, cache?: boolean): Promise<Canvas>;
    getAsset(_arg_1: string): IGraphicAsset;
    getDirection(): number;
    getFigure(): IAvatarFigureContainer;
    getPartColor(_arg_1: string): IPartColor;
    isAnimating(): boolean;
    getCanvasOffsets(): number[];
    initActionAppends(): void;
    endActionAppends(): void;
    appendAction(_arg_1: string, ..._args: any[]): boolean;
    avatarSpriteData: IAvatarDataContainer;
    isPlaceholder(): boolean;
    forceActionUpdate(): void;
    animationHasResetOnToggle: boolean;
    resetAnimationFrameCounter(): void;
    mainAction: IActiveActionData;
    getTotalFrameCount(): number;
}
