import { NitroLogger } from './NitroLogger';
import { AdvancedMap, FileUtilities } from './utils';

export class ConfigurationManager
{
    private static _definitions: AdvancedMap<string, unknown> = new AdvancedMap();

    public static async init(): Promise<void>
    {
        await this.loadConfigurationFromUrl('./config.json');
    }

    private static async loadConfigurationFromUrl(url: string): Promise<void>
    {
        if(!url || (url === '')) throw new Error(`Invalid configuration url: ${ url }`);

        try
        {
            const response = await FileUtilities.readFileAsString(url);
            const json = JSON.parse(response);

            if(!this.parseConfiguration(json)) return Promise.reject('invalid_config');
        }

        catch (err)
        {
            return Promise.reject(err);
        }
    }

    private static parseConfiguration(data: { [index: string]: any }): boolean
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
            NitroLogger.error(e.stack);

            return false;
        }
    }

    public static interpolate(value: string, regex: RegExp = null): string
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

    private static removeInterpolateKey(value: string): string
    {
        return value.replace('${', '').replace('}', '');
    }

    public static getValue<T>(key: string, value: T = null): T
    {
        let existing = this._definitions.getValue(key);

        if(existing === undefined)
        {
            NitroLogger.warn(`Missing configuration key: ${ key }`);

            existing = value;
        }

        return (existing as T);
    }

    public static setValue(key: string, value: string): void
    {
        this._definitions.add(key, value);
    }
}
