import { RequestQuery } from './RequestQuery';

export const GetDirectionRequest = (query: RequestQuery) =>
{
    return ((query.direction && query.direction.length) ? parseInt(query.direction) : null);
};
