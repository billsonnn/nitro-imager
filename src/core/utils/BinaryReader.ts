import { wrap } from 'bytebuffer';
export class BinaryReader
{
    private _position: number;
    private _dataView: ByteBuffer;

    constructor(buffer: ArrayBuffer)
    {
        this._position = 0;
        this._dataView = wrap(buffer);
    }

    public readByte(): number
    {
        return this._dataView.readInt8();
    }

    public readBytes(length: number): ByteBuffer
    {
        return this._dataView.readBytes(length);
    }

    public readShort(): number
    {
        return this._dataView.readInt16(this._position);
    }

    public readInt(): number
    {
        return this._dataView.readInt32(this._position);
    }

    public remaining(): number
    {
        return this._dataView.remaining();
    }

    public toString(encoding?: string): string
    {
        return new TextDecoder().decode(this._dataView.buffer);
    }

    public toArrayBuffer(): ArrayBuffer
    {
        return this._dataView.buffer;
    }
}
