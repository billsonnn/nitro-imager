import { Canvas, createCanvas } from 'canvas';
import { Texture } from './Texture';

export class CanvasUtilities
{
    public static cropTransparentPixels(canvas: Canvas): Canvas
    {
        const bounds = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };

        const ctx = canvas.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const length = pixels.data.length;

        for(let i = 0; i < length; i += 4)
        {
            if(pixels.data[i+3] !== 0)
            {
                const x = (i / 4) % canvas.width;
                const y = ~~((i / 4) / canvas.width);

                if(bounds.top === null) bounds.top = y;

                if(bounds.left === null) bounds.left = x;
                else if(x < bounds.left) bounds.left = x;

                if(bounds.right === null) bounds.right = x;
                else if(bounds.right < x) bounds.right = x;

                if(bounds.bottom === null) bounds.bottom = y;
                else if(bounds.bottom < y) bounds.bottom = y;
            }
        }

        const trimHeight = (bounds.bottom - bounds.top);
        const trimWidth = (bounds.right - bounds.left);
        const trimmed = ctx.getImageData(bounds.left, bounds.top, trimWidth, trimHeight);

        canvas.width = trimWidth;
        canvas.height = trimHeight;
        ctx.putImageData(trimmed, 0, 0);

        return canvas;
    }

    public static tintWithMultiply(texture: Texture, color: number): Canvas
    {
        const crop = texture.frame.clone();
        const resolution = texture.baseTexture.resolution;

        const canvas = createCanvas(Math.ceil(crop.width), Math.ceil(crop.height));
        const ctx = canvas.getContext('2d');

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        ctx.save();
        ctx.fillStyle = `#${(`00000${(color | 0).toString(16)}`).substr(-6)}`;

        ctx.fillRect(0, 0, crop.width, crop.height);

        ctx.globalCompositeOperation = 'multiply';

        const source = texture.baseTexture.getDrawableSource();

        ctx.drawImage(
            source,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        ctx.globalCompositeOperation = 'destination-atop';

        ctx.drawImage(
            source,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        ctx.restore();

        return canvas;
    }

    public static scaleCanvas(canvas: Canvas, scaleX: number, scaleY: number): Canvas
    {
        const tempCanvas = this.createNitroCanvas((canvas.width * scaleX), (canvas.height * scaleY));
        const ctx = tempCanvas.getContext('2d');

        ctx.scale(scaleX, scaleY);
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

        return tempCanvas;
    }

    public static createNitroCanvas(width: number, height: number): Canvas
    {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = false;

        return canvas;
    }
}
