import { RequestQuery } from './RequestQuery';

export const GetDanceRequest = (query: RequestQuery) =>
{
    return ((query.dance && query.dance.length) ? parseInt(query.dance) : null);
};
