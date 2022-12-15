import { IFigureBuildOptions } from './IFigureBuildOptions';

const PART_SEPARATOR = '.';

export const BuildFigureOptionsStringRequest = (buildOptions: IFigureBuildOptions) =>
{
    let buildString = '';

    if(buildOptions.figure) buildString += buildOptions.figure;
    if(buildOptions.size) buildString += PART_SEPARATOR + 's-' + buildOptions.size;
    if(buildOptions.setType) buildString += PART_SEPARATOR + 'st-' + buildOptions.setType;
    if(buildOptions.direction) buildString += PART_SEPARATOR + 'd-' + buildOptions.direction;
    if(buildOptions.headDirection) buildString += PART_SEPARATOR + 'hd-' + buildOptions.headDirection;
    if(buildOptions.action) buildString += PART_SEPARATOR + 'a-' + buildOptions.action;
    if(buildOptions.gesture) buildString += PART_SEPARATOR + 'g-' + buildOptions.gesture;
    if(buildOptions.dance) buildString += PART_SEPARATOR + 'da-' + buildOptions.dance;
    if(buildOptions.effect) buildString += PART_SEPARATOR + 'fx-' + buildOptions.effect;
    if(buildOptions.frameNumber) buildString += PART_SEPARATOR + 'fn-' + buildOptions.frameNumber;
    if(buildOptions.imageFormat) buildString += PART_SEPARATOR + 'f-' + buildOptions.imageFormat;

    return buildString;
};
