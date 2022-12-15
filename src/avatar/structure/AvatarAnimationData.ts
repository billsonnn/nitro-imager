import { AdvancedMap } from '../../core';
import { IActionDefinition } from '../actions';
import { AnimationAction } from './animation';
import { IFigureSetData } from './IFigureSetData';

export class AvatarAnimationData implements IFigureSetData
{
    private _actions: AdvancedMap<string, AnimationAction>;

    constructor()
    {
        this._actions = new AdvancedMap();
    }

    public parse(data: any): boolean
    {
        if(data && (data.length > 0))
        {
            for(const animation of data)
            {
                if(!animation) continue;

                const newAnimation = new AnimationAction(animation);

                this._actions.add(newAnimation.id, newAnimation);
            }
        }

        return true;
    }

    public appendJSON(k: any): boolean
    {
        for(const _local_2 of k.action)
        {
            this._actions.add(_local_2.id, new AnimationAction(_local_2));
        }

        return true;
    }

    public getAction(action: IActionDefinition): AnimationAction
    {
        const existing = this._actions.getValue(action.id);

        if(!existing) return null;

        return existing;
    }

    public getFrameCount(k: IActionDefinition): number
    {
        const animationAction = this.getAction(k);

        if(!animationAction) return 0;

        return animationAction.frameCount;
    }
}
