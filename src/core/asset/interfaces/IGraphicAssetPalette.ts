import { Texture } from '../../utils';

export interface IGraphicAssetPalette
{
    dispose: () => void;
    applyPalette: (texture: Texture) => Texture;
    primaryColor: number;
    secondaryColor: number;
}
