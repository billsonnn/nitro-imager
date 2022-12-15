import { AvatarAction, IAvatarImage } from '../../../avatar';

export const ProcessPostureAction = (action: string, avatar: IAvatarImage) =>
{
    let didSet = false;

    let posture = AvatarAction.POSTURE_STAND;
    let param = null;

    if(action && action.length)
    {
        const [ key, value ] = action.split('=');

        if(value && value.length) param = value;

        switch(key)
        {
            case 'wlk':
            case AvatarAction.POSTURE_WALK:
                didSet = true;
                posture = AvatarAction.POSTURE_WALK;
                break;
            case AvatarAction.POSTURE_SIT:
            case AvatarAction.POSTURE_LAY:
            case AvatarAction.POSTURE_STAND:
                didSet = true;
                posture = key;
                break;
        }
    }

    if(posture && posture.length) avatar.appendAction(AvatarAction.POSTURE, posture, param);

    return didSet;
};
