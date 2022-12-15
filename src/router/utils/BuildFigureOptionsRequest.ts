import { GetActionRequest } from './GetActionRequest';
import { GetDanceRequest } from './GetDanceRequest';
import { GetDirectionRequest } from './GetDirectionRequest';
import { GetEffectRequest } from './GetEffectRequest';
import { GetFigureRequest } from './GetFigureRequest';
import { GetFrameNumberRequest } from './GetFrameNumberRequest';
import { GetGestureRequest } from './GetGestureRequest';
import { GetHeadDirectionRequest } from './GetHeadDirectionRequest';
import { GetImageFormatRequest } from './GetImageFormatRequest';
import { GetSetTypeRequest } from './GetSetTypeRequest';
import { GetSizeRequest } from './GetSizeRequest';
import { IFigureBuildOptions } from './IFigureBuildOptions';
import { RequestQuery } from './RequestQuery';

export const BuildFigureOptionsRequest = (query: RequestQuery) =>
{
    const figure = GetFigureRequest(query);
    const size = GetSizeRequest(query);
    const setType = GetSetTypeRequest(query);
    const direction = (GetDirectionRequest(query) || 2);
    const headDirection = (GetHeadDirectionRequest(query) || direction);
    const action = GetActionRequest(query);
    const gesture = GetGestureRequest(query);
    const dance = GetDanceRequest(query);
    const effect = GetEffectRequest(query);
    const frameNumber = GetFrameNumberRequest(query);
    const imageFormat = GetImageFormatRequest(query);

    return {
        figure,
        size,
        setType,
        direction,
        headDirection,
        action,
        gesture,
        dance,
        effect,
        frameNumber,
        imageFormat
    } as IFigureBuildOptions;
};
