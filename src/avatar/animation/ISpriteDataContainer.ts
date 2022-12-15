import { IAnimation } from './IAnimation';

export interface ISpriteDataContainer
{
    animation: IAnimation;
    id: string;
    ink: number;
    member: string;
    hasDirections: boolean;
    hasStaticY: boolean;
    getDirectionOffsetX(direction: number): number;
    getDirectionOffsetY(direction: number): number;
    getDirectionOffsetZ(direction: number): number;
}
