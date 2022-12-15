﻿import { AdvancedMap } from '../../core';
import { IAvatarImage } from '../IAvatarImage';
import { GeometryItem } from './GeometryItem';
import { Matrix4x4 } from './Matrix4x4';
import { Node3D } from './Node3D';
import { Vector3D } from './Vector3D';

export class GeometryBodyPart extends Node3D
{
    private _id: string;
    private _radius: number;
    private _parts: AdvancedMap<string, GeometryItem>;
    private _dynamicParts: AdvancedMap<IAvatarImage, { [index: string]: GeometryItem }>;

    constructor(k: any)
    {
        super(parseFloat(k.x), parseFloat(k.y), parseFloat(k.z));

        this._id = k.id;
        this._radius = parseFloat(k.radius);
        this._parts = new AdvancedMap();
        this._dynamicParts = new AdvancedMap();

        if(k.items && (k.items.length > 0))
        {
            for(const item of k.items)
            {
                if(!item) continue;

                const geometryItem = new GeometryItem(item);

                this._parts.add(geometryItem.id, geometryItem);
            }
        }
    }

    public getDynamicParts(k: IAvatarImage): GeometryItem[]
    {
        const existing = this._dynamicParts.getValue(k);
        const parts: GeometryItem[] = [];

        if(existing)
        {
            for(const index in existing)
            {
                const item = existing[index];

                if(!item) continue;

                parts.push(item);
            }
        }

        return parts;
    }

    public getPartIds(k: IAvatarImage): string[]
    {
        const ids: string[] = [];

        for(const part of this._parts.getValues())
        {
            if(!part) continue;

            ids.push(part.id);
        }

        if(k)
        {
            const existing = this._dynamicParts.getValue(k);

            if(existing)
            {
                for(const index in existing)
                {
                    const part = existing[index];

                    if(!part) continue;

                    ids.push(part.id);
                }
            }
        }

        return ids;
    }

    public removeDynamicParts(k: IAvatarImage): boolean
    {
        this._dynamicParts.remove(k);

        return true;
    }

    public addPart(k: any, _arg_2: IAvatarImage): boolean
    {
        if(this.hasPart(k.id, _arg_2)) return false;

        let existing = this._dynamicParts.getValue(_arg_2);

        if(!existing)
        {
            existing = {};

            this._dynamicParts.add(_arg_2, existing);
        }

        existing[k.id] = new GeometryItem(k, true);

        return true;
    }

    public hasPart(k: string, _arg_2: IAvatarImage): boolean
    {
        let existingPart = (this._parts.getValue(k) || null);

        if(!existingPart && (this._dynamicParts.getValue(_arg_2) !== undefined))
        {
            existingPart = (this._dynamicParts.getValue(_arg_2)[k] || null);
        }

        return (existingPart !== null);
    }

    public getParts(k: Matrix4x4, _arg_2: Vector3D, _arg_3: any[], _arg_4: IAvatarImage): string[]
    {
        const parts: [ number, GeometryItem ][] = [];

        for(const part of this._parts.getValues())
        {
            if(!part) continue;

            part.applyTransform(k);

            parts.push([ part.getDistance(_arg_2), part ]);
        }

        const existingDynamic = this._dynamicParts.getValue(_arg_4);

        if(existingDynamic)
        {
            for(const index in existingDynamic)
            {
                const part = existingDynamic[index];

                if(!part) continue;

                part.applyTransform(k);

                parts.push([ part.getDistance(_arg_2), part ]);
            }
        }

        parts.sort((a, b) =>
        {
            const partA = a[0];
            const partB = b[0];

            if(partA < partB) return -1;

            if(partA > partB) return 1;

            return 0;
        });

        const partIds: string[] = [];

        for(const part of parts)
        {
            if(!part) continue;

            partIds.push(part[1].id);
        }

        return partIds;
    }

    public getDistance(k: Vector3D): number
    {
        const _local_2 = Math.abs(((k.z - this.transformedLocation.z) - this._radius));
        const _local_3 = Math.abs(((k.z - this.transformedLocation.z) + this._radius));

        return Math.min(_local_2, _local_3);
    }

    public get id(): string
    {
        return this._id;
    }

    public get radius(): number
    {
        return this._radius;
    }
}
