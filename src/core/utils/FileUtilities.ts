import { readFile } from 'fs';
import fetch from 'node-fetch';
import { promisify } from 'util';
import { NitroLogger } from '../NitroLogger';
import { File } from './File';

const readFileAsync = promisify(readFile);

export class FileUtilities
{
    public static getDirectory(baseFolderPath: string, childFolderName: string = null): File
    {
        let folder = new File(baseFolderPath);

        if(!folder.isDirectory()) folder.mkdirs();

        if(childFolderName)
        {
            folder = new File(folder.path + childFolderName);

            if(!folder.isDirectory()) folder.mkdirs();
        }

        return folder;
    }

    public static async readFileAsBuffer(url: string): Promise<Buffer>
    {
        if(!url) return null;

        NitroLogger.warn(`Loading: ${ url }`);

        if(url.startsWith('//')) url = ('https:' + url);

        if(url.startsWith('http'))
        {
            const data = await fetch(url);

            if(data.status !== 200) throw new Error(`File not found: ${ url }`);

            const arrayBuffer = await data.arrayBuffer();

            if(data.headers.get('Content-Type') !== 'application/octet-stream') throw new Error(`Invalid content-type: ${ url }`);

            return Buffer.from(arrayBuffer);
        }

        return await readFileAsync(url);
    }

    public static async readFileAsString(url: string): Promise<string>
    {
        if(!url || !url.length) return null;

        if(url.startsWith('//')) url = ('https:' + url);

        if(url.startsWith('http'))
        {
            const data = await fetch(url);

            if(data.status !== 200) throw new Error(`File not found: ${ url }`);

            return await data.text();
        }

        const data = await readFileAsync(url);

        return data.toString('utf-8');
    }
}
