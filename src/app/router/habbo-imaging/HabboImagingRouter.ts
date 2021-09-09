import { Router } from 'express';
import { HabboImagingRouterGet } from './handlers';

export const HabboImagingRouter = Router();

HabboImagingRouter.get('/', HabboImagingRouterGet);
