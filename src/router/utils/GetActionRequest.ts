import { RequestQuery } from './RequestQuery';

export const GetActionRequest = (query: RequestQuery) =>
{
    return ((query.action && query.action.length) ? query.action : null);
};
