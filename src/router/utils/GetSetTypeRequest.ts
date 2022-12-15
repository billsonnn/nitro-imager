import { AvatarSetType } from '../../avatar';
import { RequestQuery } from './RequestQuery';

export const GetSetTypeRequest = (query: RequestQuery) =>
{
    let setType = AvatarSetType.FULL;

    if(query.headonly && query.headonly == '1') setType = AvatarSetType.HEAD;

    return setType;
};
