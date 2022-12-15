import { AvatarAction, IAvatarImage } from '../../../avatar';
import { GetGestureRequest } from '../GetGestureRequest';
import { RequestQuery } from '../RequestQuery';

export const ProcessGestureRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const gesture: string = (GetGestureRequest(query) || null);

    if(!gesture) return;

    switch(gesture)
    {
        case AvatarAction.POSTURE_STAND:
        case AvatarAction.GESTURE_AGGRAVATED:
        case AvatarAction.GESTURE_SAD:
        case AvatarAction.GESTURE_SMILE:
        case AvatarAction.GESTURE_SURPRISED:
            avatar.appendAction(AvatarAction.GESTURE, gesture);
            return;
        case 'spk':
            avatar.appendAction(AvatarAction.TALK);
            return;
        case 'eyb':
            avatar.appendAction(AvatarAction.SLEEP);
            return;
    }
};
