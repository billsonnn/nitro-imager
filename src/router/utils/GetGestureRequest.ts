import { RequestQuery } from './RequestQuery';

export const GetGestureRequest = (query: RequestQuery) =>
{
    return ((query.gesture && query.gesture.length) ? query.gesture : null);
};
