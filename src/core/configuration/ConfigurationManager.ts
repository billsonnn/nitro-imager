import fetch from 'node-fetch';
import { NitroManager } from '../common';
import { AdvancedMap } from '../utils';
import { IConfigurationManager } from './IConfigurationManager';

export class ConfigurationManager extends NitroManager implements IConfigurationManager
{
    private _definitions: AdvancedMap<string, unknown>;

    constructor()
    {
        super();

        this._definitions = new AdvancedMap();
    }

    protected async onInit(): Promise<void>
    {
        await this.loadConfigurationFromUrl((process.env.CONFIG_URL || null));
    }

    private async loadConfigurationFromUrl(url: string): Promise<void>
    {
        if(!url || (url === '')) return Promise.reject('invalid_config_url');

        try
        {
            const response = await fetch(url);
            const json = await response.json();

            if(!this.parseConfiguration(json)) return Promise.reject('invalid_config');
        }

        catch(err)
        {
            return Promise.reject(err);
        }
    }

    private parseConfiguration(data: { [index: string]: any }): boolean
    {
        if(!data) return false;

        try
        {
            const regex = new RegExp(/\${(.*?)}/g);

            for(const key in data)
            {
                let value = data[key];

                if(typeof value === 'string')
                {
                    value = this.interpolate((value as string), regex);
                }

                this._definitions.add(key, value);
            }

            return true;
        }

        catch (e)
        {
            this.logger.error(e.stack);

            return false;
        }
    }

    public interpolate(value: string, regex: RegExp = null): string
    {
        if(!regex) regex = new RegExp(/\${(.*?)}/g);

        const pieces = value.match(regex);

        if(pieces && pieces.length)
        {
            for(const piece of pieces)
            {
                const existing = (this._definitions.getValue(this.removeInterpolateKey(piece)) as string);

                if(existing) (value = value.replace(piece, existing));
            }
        }

        return value;
    }

    private removeInterpolateKey(value: string): string
    {
        return value.replace('${', '').replace('}', '');
    }

    public getValue<T>(key: string, value: T = null): T
    {
        let existing = this._definitions.getValue(key);

        if(existing === undefined)
        {
            this.logger.warn(`Missing configuration key: ${ key }`);

            existing = value;
        }

        return (existing as T);
    }

    public setValue(key: string, value: string): void
    {
        this._definitions.add(key, value);
    }
}
