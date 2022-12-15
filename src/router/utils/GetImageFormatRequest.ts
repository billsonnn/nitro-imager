import { RequestQuery } from './RequestQuery';

export const GetImageFormatRequest = (query: RequestQuery) =>
{
    if(query.img_format === 'gif') return 'gif';

    return 'png';
};
