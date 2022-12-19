
import * as dotenv from 'dotenv';
import express from 'express';
import { AvatarRenderManager } from './avatar';
import { ConfigurationManager, NitroLogger } from './core';
import { HttpRouter } from './router';

dotenv.config();

async function init(): Promise<void>
{
    try
    {
        NitroLogger.success('Starting Nitro Imager');

        await ConfigurationManager.init();
        await AvatarRenderManager.init();

        const router = express();
		const urlpath = (process.env.IMAGER_PATH as string);
		
		router.get(urlpath, HttpRouter);
		
        const host = (process.env.API_HOST as string);
        const port = parseInt(process.env.API_PORT);

        router.listen(port, host, () =>
        {
            NitroLogger.success(`Server Started ${ host }:${ port }`);
        });
    }

    catch (err)
    {
        NitroLogger.error(err.message || err);
    }
}

init();
