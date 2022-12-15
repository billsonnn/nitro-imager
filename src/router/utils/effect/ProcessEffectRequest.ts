import { AvatarAction, IAvatarImage } from '../../../avatar';
import { GetEffectRequest } from '../GetEffectRequest';
import { RequestQuery } from '../RequestQuery';

export const ProcessEffectRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const effect: number = (GetEffectRequest(query) || null);

    if(!effect) return;

    avatar.appendAction(AvatarAction.EFFECT, effect);
};
