import { AvatarSetType, IAvatarImage } from '../../../avatar';
import { GetDirectionRequest } from '../GetDirectionRequest';
import { GetHeadDirectionRequest } from '../GetHeadDirectionRequest';
import { RequestQuery } from '../RequestQuery';

export const ProcessDirectionRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const direction = (GetDirectionRequest(query) || 2);
    const headDirection = (GetHeadDirectionRequest(query) || direction);

    avatar.setDirection(AvatarSetType.FULL, direction);
    avatar.setDirection(AvatarSetType.HEAD, headDirection);
};
