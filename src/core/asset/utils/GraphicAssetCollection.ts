import { Canvas, createCanvas, Image } from 'canvas';
import { AdvancedMap, Rectangle } from '../../utils';
import { IAsset, IAssetData, IAssetPalette } from '../interfaces';
import { GraphicAsset } from './GraphicAsset';
import { GraphicAssetPalette } from './GraphicAssetPalette';
import { IGraphicAsset } from './IGraphicAsset';
import { IGraphicAssetCollection } from './IGraphicAssetCollection';

export class GraphicAssetCollection implements IGraphicAssetCollection
{
    private static PALETTE_ASSET_DISPOSE_THRESHOLD: number = 10;

    private _name: string;
    private _data: IAssetData;
    private _textures: AdvancedMap<string, Canvas>;
    private _assets: AdvancedMap<string, GraphicAsset>;
    private _palettes: AdvancedMap<string, GraphicAssetPalette>;
    private _paletteAssetNames: string[];

    constructor(data: IAssetData, baseTexture: Image)
    {
        if(!data) throw new Error('invalid_collection');

        this._name = data.name;
        this._data = data;
        this._textures = new AdvancedMap();
        this._assets = new AdvancedMap();
        this._palettes = new AdvancedMap();
        this._paletteAssetNames = [];

        if(baseTexture) this.processBaseTexture(baseTexture);

        this.define(data);
    }

    public dispose(): void
    {
        if(this._palettes)
        {
            for(const palette of this._palettes.getValues()) palette.dispose();

            this._palettes.reset();
        }

        if(this._paletteAssetNames)
        {
            this.disposePaletteAssets();

            this._paletteAssetNames = null;
        }

        if(this._assets)
        {
            for(const asset of this._assets.getValues()) asset.recycle();

            this._assets.reset();
        }
    }

    private processBaseTexture(baseTexture: Image): void
    {
        const frames = this._data.spritesheet.frames;

        for(const name in frames)
        {
            const spritesheetFrame = frames[name];

            if(!spritesheetFrame) continue;

            const rect = spritesheetFrame.frame;
            const sourceSize = (spritesheetFrame.trimmed && spritesheetFrame.sourceSize) ? spritesheetFrame.sourceSize : spritesheetFrame.frame;
            const resolution = 1;

            let frame: Rectangle = null;
            let trim: Rectangle = null;

            const orig = new Rectangle(
                0,
                0,
                Math.floor(sourceSize.w) / resolution,
                Math.floor(sourceSize.h) / resolution);

            if(spritesheetFrame.rotated)
            {
                frame = new Rectangle(
                    Math.floor(rect.x) / resolution,
                    Math.floor(rect.y) / resolution,
                    Math.floor(rect.h) / resolution,
                    Math.floor(rect.w) / resolution);
            }
            else
            {
                frame = new Rectangle(
                    Math.floor(rect.x) / resolution,
                    Math.floor(rect.y) / resolution,
                    Math.floor(rect.w) / resolution,
                    Math.floor(rect.h) / resolution);
            }

            if (spritesheetFrame.trimmed && spritesheetFrame.spriteSourceSize)
            {
                trim = new Rectangle(
                    Math.floor(spritesheetFrame.spriteSourceSize.x) / resolution,
                    Math.floor(spritesheetFrame.spriteSourceSize.y) / resolution,
                    Math.floor(rect.w) / resolution,
                    Math.floor(rect.h) / resolution
                );
            }

            const width = frame.width;
            const height = frame.height;

            let dx = 0;
            let dy = 0;

            if(trim)
            {
                dx = (trim.width / 2) + trim.x - (0 * orig.width);
                dy = (trim.height / 2) + trim.y - (0 * orig.height);
            }
            else
            {
                dx = (0.5 - 0) * orig.width;
                dy = (0.5 - 0) * orig.height;
            }

            dx -= width / 2;
            dy -= height / 2;

            const canvas = createCanvas(sourceSize.w, sourceSize.h);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                baseTexture,
                frame.x * resolution,
                frame.y * resolution,
                Math.floor(width * resolution),
                Math.floor(height * resolution),
                Math.floor(dx * resolution),
                Math.floor(dy * resolution),
                Math.floor(width * resolution),
                Math.floor(height * resolution)
            );

            if(name.indexOf('h_std_hr_4_2_0') >= 0)
            {
                //console.log(spritesheetFrame);
                console.log('h_std_hr_4_2_0');
                console.log(canvas.toDataURL());
                console.log();
            }

            if(name.indexOf('h_std_hrb_4_2_0') >= 0)
            {
                //console.log(frameData, source);
                console.log('h_std_hrb_4_2_0');
                console.log(canvas.toDataURL());
                console.log();
            }

            this._textures.add(name, canvas);
        }
    }

    public define(data: IAssetData): void
    {
        const assets = data.assets;
        const palettes = data.palettes;

        if(assets) this.defineAssets(assets);

        if(palettes) this.definePalettes(palettes);
    }

    private defineAssets(assets: { [index: string]: IAsset }): void
    {
        if(!assets) return;

        for(const name in assets)
        {
            const asset = assets[name];

            if(!asset) continue;

            const x = (-(asset.x) || 0);
            const y = (-(asset.y) || 0);
            let flipH = false;
            let flipV = false;
            const usesPalette = (asset.usesPalette || false);
            let source = (asset.source || '');

            if(asset.flipH && source.length) flipH = true;

            if(asset.flipV && source.length) flipV = true;

            if(!source.length) source = name;

            const texture = this.getLibraryAsset(source);

            if(!texture) continue;

            let didAddAsset = this.createAsset(name, source, texture, flipH, flipV, x, y, usesPalette);

            if(!didAddAsset)
            {
                const existingAsset = this.getAsset(name);

                if(existingAsset && (existingAsset.name !== existingAsset.source))
                {
                    didAddAsset = this.replaceAsset(name, source, texture, flipH, flipV, x, y, usesPalette);
                }
            }
        }
    }

    private definePalettes(palettes: { [index: string]: IAssetPalette }): void
    {
        if(!palettes) return;

        for(const name in palettes)
        {
            const palette = palettes[name];

            if(!palette) continue;

            const id = palette.id.toString();

            if(this._palettes.getValue(id)) continue;

            let colorOne = 0xFFFFFF;
            let colorTwo = 0xFFFFFF;

            let color = palette.color1;

            if(color && color.length > 0) colorOne = parseInt(color, 16);

            color = palette.color2;

            if(color && color.length > 0) colorTwo = parseInt(color, 16);

            this._palettes.add(id, new GraphicAssetPalette(palette.rgb, colorOne, colorTwo));
        }
    }

    private createAsset(name: string, source: string, texture: Canvas, flipH: boolean, flipV: boolean, x: number, y: number, usesPalette: boolean): boolean
    {
        if(this._assets.getValue(name)) return false;

        const graphicAsset = GraphicAsset.createAsset(name, source, texture, x, y, flipH, flipV, usesPalette);

        this._assets.add(name, graphicAsset);

        return true;
    }

    private replaceAsset(name: string, source: string, texture: Canvas, flipH: boolean, flipV: boolean, x: number, y: number, usesPalette: boolean): boolean
    {
        const existing = this._assets.getValue(name);

        if(existing)
        {
            this._assets.remove(name);

            existing.recycle();
        }

        return this.createAsset(name, source, texture, flipH, flipV, x, y, usesPalette);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        const existing = this._assets.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public getAssetWithPalette(name: string, paletteName: string): IGraphicAsset
    {
        const saveName = (name + '@' + paletteName);

        let asset = this.getAsset(saveName);

        if(!asset)
        {
            asset = this.getAsset(name);

            if(!asset || !asset.usesPalette) return asset;

            const palette = this.getPalette(paletteName);

            if(palette)
            {
                const texture = palette.applyPalette(asset.texture);

                if(texture)
                {
                    this._paletteAssetNames.push(saveName);

                    this.createAsset(saveName, (asset.source + '@' + paletteName), texture, asset.flipH, asset.flipV, asset.x, asset.y, false);

                    asset = this.getAsset(saveName);
                }
            }
        }

        return asset;
    }

    public getPaletteNames(): string[]
    {
        return Array.from(this._palettes.getKeys());
    }

    public getPaletteColors(paletteName: string): number[]
    {
        const palette = this.getPalette(paletteName);

        if(palette) return [ palette.primaryColor, palette.secondaryColor ];

        return null;
    }

    public getPalette(name: string): GraphicAssetPalette
    {
        if(!name) return null;

        const existing = this._palettes.getValue(name);

        if(!existing) return null;

        return existing;
    }

    public disposeAsset(name: string): void
    {
        const existing = this._assets.getValue(name);

        if(!existing) return;

        this._assets.remove(name);

        const texture = this.getLibraryAsset(existing.source);

        if(texture) this._textures.remove(existing.source);

        existing.recycle();
    }

    public getLibraryAsset(name: string): Canvas
    {
        if(!name) return null;

        name = this._name + '_' + name;

        const texture = this._textures.getValue(name);

        if(!texture) return null;

        return texture;
    }

    private disposePaletteAssets(disposeAll: boolean = true): void
    {
        if(this._paletteAssetNames)
        {
            if(disposeAll || (this._paletteAssetNames.length > GraphicAssetCollection.PALETTE_ASSET_DISPOSE_THRESHOLD))
            {
                for(const name of this._paletteAssetNames) this.disposeAsset(name);

                this._paletteAssetNames = [];
            }
        }
    }

    public get name(): string
    {
        return this._name;
    }

    public get data(): IAssetData
    {
        return this._data;
    }

    public get textures(): AdvancedMap<string, Canvas>
    {
        return this._textures;
    }

    public get assets(): AdvancedMap<string, IGraphicAsset>
    {
        return this._assets;
    }
}
