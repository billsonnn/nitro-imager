import { AdvancedMap, CanvasUtilities, Point, Rectangle } from '../../core';
import { IActiveActionData } from '../actions';
import { AssetAliasCollection } from '../alias';
import { AvatarAnimationLayerData } from '../animation';
import { AvatarImageBodyPartContainer } from '../AvatarImageBodyPartContainer';
import { AvatarImagePartContainer } from '../AvatarImagePartContainer';
import { AvatarStructure } from '../AvatarStructure';
import { AvatarDirectionAngle, AvatarFigurePartType, AvatarScaleType, GeometryType } from '../enum';
import { IAvatarImage } from '../IAvatarImage';
import { AvatarCanvas } from '../structure';
import { AvatarImageActionCache } from './AvatarImageActionCache';
import { AvatarImageBodyPartCache } from './AvatarImageBodyPartCache';
import { AvatarImageDirectionCache } from './AvatarImageDirectionCache';
import { CompleteImageData } from './CompleteImageData';
import { ImageData } from './ImageData';

export class AvatarImageCache
{
    private static DEFAULT_MAX_CACHE_STORAGE_TIME_MS: number = 60000;

    private _structure: AvatarStructure;
    private _avatar: IAvatarImage;
    private _assets: AssetAliasCollection;
    private _scale: string;
    private _cache: AdvancedMap<string, AvatarImageBodyPartCache>;
    private _canvas: AvatarCanvas;
    private _disposed: boolean;
    private _geometryType: string;
    private _unionImages: ImageData[];

    constructor(structure: AvatarStructure, avatarImage: IAvatarImage, aliasCollection: AssetAliasCollection, scale: string)
    {
        this._structure = structure;
        this._avatar = avatarImage;
        this._assets = aliasCollection;
        this._scale = scale;
        this._cache = new AdvancedMap();
        this._canvas = null;
        this._disposed = false;
        this._unionImages = [];
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._structure = null;
        this._avatar = null;
        this._assets = null;
        this._canvas = null;
        this._disposed = true;

        if(this._cache)
        {
            for(const cache of this._cache.getValues())
            {
                if(!cache) continue;

                cache.dispose();
            }

            this._cache = null;
        }

        if(this._unionImages)
        {
            for(const image of this._unionImages)
            {
                if(!image) continue;

                image.dispose();
            }

            this._unionImages = [];
        }
    }

    public disposeInactiveActions(k: number = 60000): void
    {
        const time = 0;

        if(this._cache)
        {
            for(const cache of this._cache.getValues())
            {
                if(!cache) continue;

                cache.disposeActions(k, time);
            }
        }
    }

    public resetBodyPartCache(k: IActiveActionData): void
    {
        if(this._cache)
        {
            for(const cache of this._cache.getValues())
            {
                if(!cache) continue;

                cache.setAction(k, 0);
            }
        }
    }

    public setDirection(k: string, _arg_2: number): void
    {
        const parts = this._structure.getBodyPartsUnordered(k);

        if(parts)
        {
            for(const part of parts)
            {
                const actionCache = this.getBodyPartCache(part);

                if(!actionCache) continue;

                actionCache.setDirection(_arg_2);
            }
        }
    }

    public setAction(k: IActiveActionData, _arg_2: number): void
    {
        const _local_3 = this._structure.getActiveBodyPartIds(k, this._avatar);

        for(const _local_4 of _local_3)
        {
            const _local_5 = this.getBodyPartCache(_local_4);

            if(_local_5) _local_5.setAction(k, _arg_2);
        }
    }

    public setGeometryType(k: string): void
    {
        if(this._geometryType === k) return;

        if((((this._geometryType === GeometryType.SITTING) && (k === GeometryType.VERTICAL)) || ((this._geometryType === GeometryType.VERTICAL) && (k === GeometryType.SITTING)) || ((this._geometryType === GeometryType.SNOWWARS_HORIZONTAL) && (k = GeometryType.SNOWWARS_HORIZONTAL))))
        {
            this._geometryType = k;
            this._canvas = null;

            return;
        }

        this.disposeInactiveActions(0);

        this._geometryType = k;
        this._canvas = null;
    }

    public getImageContainer(k: string, frameNumber: number): AvatarImageBodyPartContainer
    {
        let _local_4 = this.getBodyPartCache(k);

        if(!_local_4)
        {
            _local_4 = new AvatarImageBodyPartCache();

            this._cache.add(k, _local_4);
        }

        let _local_5 = _local_4.getDirection();
        let _local_7 = _local_4.getAction();
        let frameCount = frameNumber;

        if(_local_7.definition.startFromFrameZero) frameCount -= _local_7.startFrame;

        let _local_8 = _local_7;
        let _local_9: string[] = [];
        let _local_10: AdvancedMap<string, string> = new AdvancedMap();
        const _local_11 = new Point();

        if(!((!(_local_7)) || (!(_local_7.definition))))
        {
            if(_local_7.definition.isAnimation)
            {
                let _local_15 = _local_5;

                const _local_16 = this._structure.getAnimation(((_local_7.definition.state + '.') + _local_7.actionParameter));
                const _local_17 = (frameNumber - _local_7.startFrame);

                if(_local_16)
                {
                    const _local_18 = _local_16.getLayerData(_local_17, k, _local_7.overridingAction);

                    if(_local_18)
                    {
                        _local_15 = (_local_5 + _local_18.dd);

                        if(_local_18.dd < 0)
                        {
                            if(_local_15 < 0)
                            {
                                _local_15 = (8 + _local_15);
                            }
                            else if(_local_15 > 7) _local_15 = (8 - _local_15);
                        }
                        else
                        {
                            if(_local_15 < 0)
                            {
                                _local_15 = (_local_15 + 8);
                            }
                            else if(_local_15 > 7) _local_15 = (_local_15 - 8);
                        }

                        if(this._scale === AvatarScaleType.LARGE)
                        {
                            _local_11.x = _local_18.dx;
                            _local_11.y = _local_18.dy;
                        }
                        else
                        {
                            _local_11.x = (_local_18.dx / 2);
                            _local_11.y = (_local_18.dy / 2);
                        }

                        frameCount = _local_18.animationFrame;

                        if(_local_18.action)
                        {
                            _local_7 = _local_18.action;
                        }

                        if(_local_18.type === AvatarAnimationLayerData.BODYPART)
                        {
                            if(_local_18.action != null)
                            {
                                _local_8 = _local_18.action;
                            }

                            _local_5 = _local_15;
                        }
                        else if(_local_18.type === AvatarAnimationLayerData.FX) _local_5 = _local_15;

                        _local_10 = _local_18.items;
                    }

                    _local_9 = _local_16.removeData;
                }
            }
        }

        let _local_12 = _local_4.getActionCache(_local_8);

        if(!_local_12)
        {
            _local_12 = new AvatarImageActionCache();
            _local_4.updateActionCache(_local_8, _local_12);
        }

        let _local_13 = _local_12.getDirectionCache(_local_5);

        if(!_local_13)
        {
            const _local_19 = this._structure.getParts(k, this._avatar.getFigure(), _local_8, this._geometryType, _local_5, _local_9, this._avatar, _local_10);

            _local_13 = new AvatarImageDirectionCache(_local_19);

            _local_12.updateDirectionCache(_local_5, _local_13);
        }

        let _local_14 = _local_13.getImageContainer(frameCount);

        if(!_local_14)
        {
            const _local_20 = _local_13.getPartList();

            _local_14 = this.renderBodyPart(_local_5, _local_20, frameCount, _local_7);

            if(_local_14)
            {
                if(_local_14.isCacheable) _local_13.updateImageContainer(_local_14, frameCount);
            }
            else
            {
                return null;
            }
        }

        const offset = this._structure.getFrameBodyPartOffset(_local_8, _local_5, frameCount, k);

        _local_11.x += offset.x;
        _local_11.y += offset.y;

        _local_14.offset = _local_11;

        return _local_14;
    }

    public getBodyPartCache(k: string): AvatarImageBodyPartCache
    {
        let existing = this._cache.getValue(k);

        if(!existing)
        {
            existing = new AvatarImageBodyPartCache();

            this._cache.add(k, existing);
        }

        return existing;
    }

    private renderBodyPart(direction: number, containers: AvatarImagePartContainer[], frameCount: number, _arg_4: IActiveActionData): AvatarImageBodyPartContainer
    {
        if(!containers || !containers.length) return null;

        if(!this._canvas)
        {
            this._canvas = this._structure.getCanvas(this._scale, this._geometryType);

            if(!this._canvas) return null;
        }

        const isFlipped = AvatarDirectionAngle.DIRECTION_IS_FLIPPED[direction] || false;
        let assetPartDefinition = _arg_4.definition.assetPartDefinition;
        let isCacheable = true;
        let containerIndex = (containers.length - 1);

        while(containerIndex >= 0)
        {
            const container = containers[containerIndex];

            let color = 16777215;

            if(!((direction == 7) && ((container.partType === 'fc') || (container.partType === 'ey'))))
            {
                if(!((container.partType === 'ri') && !container.partId))
                {
                    const partId = container.partId;
                    const animationFrame = container.getFrameDefinition(frameCount);

                    let partType = container.partType;
                    let frameNumber = 0;

                    if(animationFrame)
                    {
                        frameNumber = animationFrame.number;

                        if((animationFrame.assetPartDefinition) && (animationFrame.assetPartDefinition !== '')) assetPartDefinition = animationFrame.assetPartDefinition;
                    }
                    else frameNumber = container.getFrameIndex(frameCount);

                    let assetDirection = direction;
                    let flipH = false;

                    if(isFlipped)
                    {
                        if(((assetPartDefinition === 'wav') && (((partType === AvatarFigurePartType.LEFT_HAND) || (partType === AvatarFigurePartType.LEFT_SLEEVE)) || (partType === AvatarFigurePartType.LEFT_COAT_SLEEVE))) || ((assetPartDefinition === 'drk') && (((partType === AvatarFigurePartType.RIGHT_HAND) || (partType === AvatarFigurePartType.RIGHT_SLEEVE)) || (partType === AvatarFigurePartType.RIGHT_COAT_SLEEVE))) || ((assetPartDefinition === 'blw') && (partType === AvatarFigurePartType.RIGHT_HAND)) || ((assetPartDefinition === 'sig') && (partType === AvatarFigurePartType.LEFT_HAND)) || ((assetPartDefinition === 'respect') && (partType === AvatarFigurePartType.LEFT_HAND)) || (partType === AvatarFigurePartType.RIGHT_HAND_ITEM) || (partType === AvatarFigurePartType.LEFT_HAND_ITEM) || (partType === AvatarFigurePartType.CHEST_PRINT))
                        {
                            flipH = true;
                        }
                        else
                        {
                            if(direction === 4) assetDirection = 2;
                            else if(direction === 5) assetDirection = 1;
                            else if(direction === 6) assetDirection = 0;

                            if(container.flippedPartType !== partType) partType = container.flippedPartType;
                        }
                    }

                    let assetName = (this._scale + '_' + assetPartDefinition + '_' + partType + '_' + partId + '_' + assetDirection + '_' + frameNumber);
                    let asset = this._assets.getAsset(assetName);

                    if(!asset)
                    {
                        assetName = (this._scale + '_std_' + partType + '_' + partId + '_' + assetDirection + '_0');
                        asset = this._assets.getAsset(assetName);
                    }

                    if(asset)
                    {
                        const texture = asset.texture;

                        if(!texture)
                        {
                            isCacheable = false;
                        }
                        else
                        {
                            if(container.isColorable && container.color) color = container.color.rgb;

                            const offset = new Point(-(asset.x), -(asset.y));

                            if(flipH) offset.x = (offset.x + ((this._scale === AvatarScaleType.LARGE) ? 65 : 31));

                            this._unionImages.push(new ImageData(texture, asset.rectangle, offset, flipH, color));
                        }
                    }
                }
            }

            containerIndex--;
        }

        if(!this._unionImages.length) return null;

        const imageData = this.createUnionImage(this._unionImages, isFlipped);
        const canvasOffset = ((this._scale === AvatarScaleType.LARGE) ? (this._canvas.height - 16) : (this._canvas.height - 8));
        const offset = new Point(-(imageData.regPoint.x), (canvasOffset - imageData.regPoint.y));

        if(isFlipped && (assetPartDefinition !== 'lay')) offset.x = (offset.x + ((this._scale === AvatarScaleType.LARGE) ? 67 : 31));

        let imageIndex = (this._unionImages.length - 1);

        while(imageIndex >= 0)
        {
            const _local_17 = this._unionImages.pop();

            if(_local_17) _local_17.dispose();

            imageIndex--;
        }

        return new AvatarImageBodyPartContainer(imageData.image, offset, isCacheable);
    }

    private convertColorToHex(k: number): string
    {
        let _local_2: string = (k * 0xFF).toString(16);
        if(_local_2.length < 2)
        {
            _local_2 = ('0' + _local_2);
        }
        return _local_2;
    }

    private createUnionImage(imageDatas: ImageData[], isFlipped: boolean): CompleteImageData
    {
        const bounds = new Rectangle();

        for(const data of imageDatas) data && bounds.enlarge(data.offsetRect);

        const point = new Point(-(bounds.x), -(bounds.y));
        const canvas = CanvasUtilities.createNitroCanvas(bounds.width, bounds.height);
        const ctx = canvas.getContext('2d');

        for(const data of imageDatas)
        {
            if(!data) continue;

            const texture = data.texture;
            const color = data.colorTransform;
            const flipH = (!(isFlipped && data.flipH) && (isFlipped || data.flipH));
            const regPoint = point.clone();

            regPoint.x -= data.regPoint.x;
            regPoint.y -= data.regPoint.y;

            if(isFlipped) regPoint.x = (canvas.width - (regPoint.x + data.rect.width));

            let scale = 1;
            let tx = 0;
            let ty = 0;

            if(flipH)
            {
                scale = -1;
                tx = ((data.rect.x + data.rect.width) + regPoint.x);
                ty = (regPoint.y - data.rect.y);
            }
            else
            {
                scale = 1;
                tx = (regPoint.x - data.rect.x);
                ty = (regPoint.y - data.rect.y);
            }

            const tintedTexture = texture.getTintedWithMultiply(color);

            ctx.save();
            ctx.transform(scale, 0, 0, 1, tx, ty);
            ctx.drawImage(tintedTexture, 0, 0, data.rect.width, data.rect.height);
            ctx.restore();
        }

        return new CompleteImageData(canvas, new Rectangle(0, 0, canvas.width, canvas.height), point, isFlipped, null);
    }
}
