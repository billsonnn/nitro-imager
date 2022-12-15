import { RequestQuery } from './RequestQuery';

export const GetEffectRequest = (query: RequestQuery) =>
{
    return ((query.effect && query.effect.length) ? parseInt(query.effect) : null);
};
