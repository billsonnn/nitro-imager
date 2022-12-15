import { AvatarScaleType } from '../../avatar';
import { RequestQuery } from './RequestQuery';

export const GetScaleRequest = (query: RequestQuery) =>
{
    return AvatarScaleType.LARGE;
};
