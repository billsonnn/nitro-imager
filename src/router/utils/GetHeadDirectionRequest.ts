import { RequestQuery } from './RequestQuery';

export const GetHeadDirectionRequest = (query: RequestQuery) =>
{
    return ((query.head_direction && query.head_direction.length) ? parseInt(query.head_direction) : null);
};
