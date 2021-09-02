export interface IDisposable
{
    dispose(): Promise<void>;
    disposed: boolean;
}
