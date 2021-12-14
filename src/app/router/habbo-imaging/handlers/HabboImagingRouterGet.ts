import { Canvas, createCanvas } from 'canvas';
import { Request, Response } from 'express';
import { createWriteStream, writeFile, WriteStream } from 'fs';
import * as GIFEncoder from 'gifencoder';
import { File, FileUtilities, Point } from '../../../../core';
import { Application } from '../../../Application';
import { AvatarScaleType, IAvatarImage } from '../../../avatar';
import { BuildFigureOptionsRequest, BuildFigureOptionsStringRequest, ProcessActionRequest, ProcessDanceRequest, ProcessDirectionRequest, ProcessEffectRequest, ProcessGestureRequest, RequestQuery } from './utils';

export const HabboImagingRouterGet = async (request: Request<any, any, any, RequestQuery>, response: Response) =>
{
    const query = request.query;

    try
    {
        const buildOptions = BuildFigureOptionsRequest(query);
        const saveDirectory = (process.env.AVATAR_SAVE_PATH as string);
        const directory = FileUtilities.getDirectory(saveDirectory);
        const avatarString = BuildFigureOptionsStringRequest(buildOptions);
        const saveFile = new File(`${ directory.path }/${ avatarString }.${ buildOptions.imageFormat }`);

        if(saveFile.exists())
        {
            const buffer = await FileUtilities.readFileAsBuffer(saveFile.path);

            if(buffer)
            {
                response
                    .writeHead(200, {
                        'Content-Type': ((buildOptions.imageFormat === 'gif') ? 'image/gif' : 'image/png')
                    })
                    .end(buffer);
            }

            return;
        }

        if(buildOptions.effect > 0)
        {
            if(!Application.instance.avatar.effectManager.isAvatarEffectReady(buildOptions.effect))
            {
                await Application.instance.avatar.effectManager.downloadAvatarEffect(buildOptions.effect);
            }
        }
        
        const avatar = await Application.instance.avatar.createAvatarImage(buildOptions.figure, AvatarScaleType.LARGE, 'M');
        const avatarCanvas = Application.instance.avatar.structure.getCanvas(avatar.getScale(), avatar.mainAction.definition.geometryType);

        ProcessDirectionRequest(query, avatar);

        avatar.initActionAppends();

        ProcessActionRequest(query, avatar);
        ProcessGestureRequest(query, avatar);
        ProcessDanceRequest(query, avatar);
        ProcessEffectRequest(query, avatar);

        avatar.endActionAppends();

        const bgColor = 376510773; // magenta

        const tempCanvas = createCanvas((avatarCanvas.width * buildOptions.size), (avatarCanvas.height * buildOptions.size));
        const tempCtx = tempCanvas.getContext('2d');

        let encoder: GIFEncoder = null;
        let stream: WriteStream = null;

        if(buildOptions.imageFormat === 'gif')
        {
            encoder = new GIFEncoder(tempCanvas.width, tempCanvas.height);
            stream = encoder.createReadStream().pipe(createWriteStream(saveFile.path));

            encoder.setTransparent(bgColor);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(1);
            encoder.setQuality(10);
        }

        let totalFrames = 0;

        if(buildOptions.imageFormat !== 'gif')
        {
            if(buildOptions.frameNumber > 0) avatar.updateAnimationByFrames(buildOptions.frameNumber);

            totalFrames = 1;
        }
        else
        {
            totalFrames = ((avatar.getTotalFrameCount() * 2) || 1);
        }

        for(let i = 0; i < totalFrames; i++)
        {
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            if(totalFrames && (i > 0)) avatar.updateAnimationByFrames(1);

            const canvas = await avatar.getImage(buildOptions.setType, 0, false, buildOptions.size);

            const avatarOffset = new Point();
            const canvasOffset = new Point();

            canvasOffset.x = ((tempCanvas.width - canvas.width) / 2);
            canvasOffset.y = ((tempCanvas.height - canvas.height) / 2);

            for(const sprite of avatar.getSprites())
            {
                if(sprite.id === 'avatar')
                {
                    const layerData = avatar.getLayerData(sprite);

                    avatarOffset.x = sprite.getDirectionOffsetX(buildOptions.direction);
                    avatarOffset.y = sprite.getDirectionOffsetY(buildOptions.direction);

                    if(layerData)
                    {
                        avatarOffset.x += layerData.dx;
                        avatarOffset.y += layerData.dy;
                    }
                }
            }

            const avatarSize = 64;
            const sizeOffset = new Point(((canvas.width - avatarSize) / 2), (canvas.height - (avatarSize / 4)));

            ProcessAvatarSprites(tempCanvas, avatar, avatarOffset, canvasOffset.add(sizeOffset), false);
            tempCtx.drawImage(canvas, avatarOffset.x, avatarOffset.y, canvas.width, canvas.height);
            ProcessAvatarSprites(tempCanvas, avatar, avatarOffset, canvasOffset.add(sizeOffset), true);

            if(encoder)
            {
                encoder.addFrame(tempCtx);
            }
            else
            {
                const buffer = tempCanvas.toBuffer();

                response
                    .writeHead(200, {
                        'Content-Type': 'image/png'
                    })
                    .end(buffer);

                writeFile(saveFile.path, buffer, () => {});

                return;
            }
        }

        if(encoder) encoder.finish();

        if(stream)
        {
            await new Promise((resolve, reject) =>
            {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });
        }

        const buffer = await FileUtilities.readFileAsBuffer(saveFile.path);

        response
            .writeHead(200, {
                'Content-Type': 'image/gif'
            })
            .end(buffer);
    }

    catch(err)
    {
        Application.instance.logger.error(err.message);

        response
            .writeHead(500)
            .end();
    }
}

function ProcessAvatarSprites(canvas: Canvas, avatar: IAvatarImage, avatarOffset: Point, canvasOffset: Point, frontSprites: boolean = true)
{
    const ctx = canvas.getContext('2d');

    for(const sprite of avatar.getSprites())
    {
        if(sprite.id === 'avatar') continue;
        
        const layerData = avatar.getLayerData(sprite);

        let offsetX = sprite.getDirectionOffsetX(avatar.getDirection());
        let offsetY = sprite.getDirectionOffsetY(avatar.getDirection());
        let offsetZ = sprite.getDirectionOffsetZ(avatar.getDirection());
        let direction = 0;
        let frame = 0;

        if(!frontSprites)
        {
            if(offsetZ >= 0) continue;
        }
        else if(offsetZ < 0) continue;

        if(sprite.hasDirections) direction = avatar.getDirection();

        if(layerData)
        {
            frame = layerData.animationFrame;
            offsetX = (offsetX + layerData.dx);
            offsetY = (offsetY + layerData.dy);
            direction = (direction + layerData.dd);
        }

        if(direction < 0) direction = (direction + 8);

        if(direction > 7) direction = (direction - 8);

        const assetName = ((((((avatar.getScale() + "_") + sprite.member) + "_") + direction) + "_") + frame);
        const asset = avatar.getAsset(assetName);

        if(!asset) continue;
        
        const texture = asset.texture;

        let x = ((canvasOffset.x - (1 * asset.offsetX)) + offsetX);
        let y = ((canvasOffset.y - (1 * asset.offsetY)) + offsetY);

        ctx.save();

        if(sprite.ink === 33) ctx.globalCompositeOperation = 'lighter';
        
        ctx.transform(1, 0, 0, 1, (x - avatarOffset.x), (y - avatarOffset.y));
        ctx.drawImage(texture.drawableCanvas, 0, 0, texture.width, texture.height);

        ctx.restore();
    }
}
