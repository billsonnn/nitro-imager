import { AvatarRenderManager } from '../../avatar';
import { RequestQuery } from './RequestQuery';

export const GetFigureRequest = (query: RequestQuery) =>
{
    let figure = AvatarRenderManager.DEFAULT_FIGURE;

    if(query.figure && query.figure.length) figure = query.figure;

    return figure;
};
