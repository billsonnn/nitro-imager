import { IAvatarImage } from '../../../avatar';
import { GetActionRequest } from '../GetActionRequest';
import { RequestQuery } from '../RequestQuery';
import { ProcessCarryAction } from './ProcessCarryAction';
import { ProcessExpressionAction } from './ProcessExpressionAction';
import { ProcessPostureAction } from './ProcessPostureAction';

export const ProcessActionRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const actions = (GetActionRequest(query)?.split(',') || []);

    for(const action of actions)
    {
        if(ProcessPostureAction(action, avatar)) continue;

        if(ProcessExpressionAction(action, avatar)) continue;

        if(ProcessCarryAction(action, avatar)) continue;
    }
};
