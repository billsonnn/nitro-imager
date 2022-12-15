import { RequestQuery } from './RequestQuery';

export const GetSizeRequest = (query: RequestQuery) =>
{
    if(query.size === 's') return 0.5;

    if(query.size === 'l') return 2;

    return 1;
};
