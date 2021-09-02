import { IFigureData } from '../interfaces';
import { IFigurePartSet, IPalette, ISetType } from './figure';

export interface IStructureData
{
    parse(data: any): boolean;
    appendJSON(k: IFigureData): boolean;
    getSetType(_arg_1: string): ISetType;
    getPalette(_arg_1: number): IPalette;
    getFigurePartSet(_arg_1: number): IFigurePartSet;
}
