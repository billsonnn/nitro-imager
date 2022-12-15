import { AvatarAction, IAvatarImage } from '../../../avatar';

export const ProcessCarryAction = (action: string, avatar: IAvatarImage) =>
{
    let didSet = false;

    let carryType: string = null;
    let param: string = null;

    if(action && action.length)
    {
        const [ key, value ] = action.split('=');

        if(value && value.length) param = value;

        switch(key)
        {
            case 'crr':
            case AvatarAction.CARRY_OBJECT:
                didSet = true;
                carryType = AvatarAction.CARRY_OBJECT;
                break;
            case 'drk':
            case AvatarAction.USE_OBJECT:
                didSet = true;
                carryType = AvatarAction.USE_OBJECT;
                break;
        }
    }

    if(carryType && carryType.length && param && param.length) avatar.appendAction(carryType, param);

    return didSet;
};
