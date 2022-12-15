import { AvatarAction, IAvatarImage } from '../../../avatar';

export const ProcessExpressionAction = (action: string, avatar: IAvatarImage) =>
{
    let didSet = false;

    let expression: string = null;
    let param: string = null;

    if(action && action.length)
    {
        const [ key, value ] = action.split('=');

        if(value && value.length) param = value;

        switch(key)
        {
            case 'wav':
            case AvatarAction.EXPRESSION_WAVE:
                didSet = true;
                expression = AvatarAction.EXPRESSION_WAVE;
                break;
            case AvatarAction.EXPRESSION_BLOW_A_KISS:
            case AvatarAction.EXPRESSION_CRY:
            case AvatarAction.EXPRESSION_IDLE:
            case AvatarAction.EXPRESSION_LAUGH:
            case AvatarAction.EXPRESSION_RESPECT:
            case AvatarAction.EXPRESSION_RIDE_JUMP:
            case AvatarAction.EXPRESSION_SNOWBOARD_OLLIE:
            case AvatarAction.EXPRESSION_SNOWBORD_360:
                didSet = true;
                expression = key;
                break;
        }
    }

    if(expression && expression.length) avatar.appendAction(expression);

    return didSet;
};
