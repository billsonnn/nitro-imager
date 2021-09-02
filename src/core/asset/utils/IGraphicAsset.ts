import { Canvas } from 'canvas';
import { Rectangle } from '../../utils';

export interface IGraphicAsset
{
    name: string;
    source: string;
    texture: Canvas;
    usesPalette: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    flipH: boolean;
    flipV: boolean;
    rectangle: Rectangle;
}
