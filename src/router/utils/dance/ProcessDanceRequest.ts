import { AvatarAction, IAvatarImage } from '../../../avatar';
import { GetDanceRequest } from '../GetDanceRequest';
import { RequestQuery } from '../RequestQuery';

export const ProcessDanceRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const dance: number = (GetDanceRequest(query) || null);

    if(!dance) return;

    switch(dance)
    {
        case 1:
        case 2:
        case 3:
        case 4:
            avatar.appendAction(AvatarAction.DANCE, dance);
            return;
    }
};
