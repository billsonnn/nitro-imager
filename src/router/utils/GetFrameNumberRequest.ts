import { RequestQuery } from './RequestQuery';

export const GetFrameNumberRequest = (query: RequestQuery) =>
{
    return ((query.frame_num && query.frame_num.length) ? parseInt(query.frame_num) : -1);
};
