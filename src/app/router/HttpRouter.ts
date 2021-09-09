import { Router } from 'express';
import { HabboImagingRouter } from './habbo-imaging';

export const HttpRouter = Router();

HttpRouter.use('/', HabboImagingRouter);
