export interface INitroLogger
{
    log(message: any): void;
    error(message: any, trace?: any): void;
    warn(message: any): void;
    description: string | number;
    print: boolean;
}
