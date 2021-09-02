import chalk = require("chalk");
import { INitroLogger } from './INitroLogger';

export class NitroLogger implements INitroLogger
{
    private static LAST_TIMESTAMP: number = Date.now();

    private _name: string;
    private _description: string | number;
    private _print: boolean;
    
    constructor(name: string, description: string | number = null)
    {
        this._name          = name;
        this._description   = description;
        this._print         = true;
    }
    
    public log(message: any): void
    {
        this.printMessage(message, chalk.green);
    }
    
    public error(message: any, trace: any = null): void
    {
        this.printMessage(trace || message, chalk.red);
    }
    
    public warn(message: any): void
    {
        this.printMessage(message, chalk.yellow);
    }
    
    private printMessage(message: any, color: Function = null): void
    {
        if(!this._print) return;

        process.stdout.write(` ${ color(`[Nitro]`) } `);

        if(this._name !== null) process.stdout.write(chalk.cyan(`[${ this._name }] `));

        if(this._description !== null) process.stdout.write(chalk.gray(`[${ this._description }] `));

        process.stdout.write(color(message));

        this.printTimestamp();
        
        process.stdout.write(`\n`);
    }
  
    private printTimestamp(): void
    {
        const now = Date.now();

        process.stdout.write(chalk.gray(` +${ now - NitroLogger.LAST_TIMESTAMP || 0 }ms`));

        NitroLogger.LAST_TIMESTAMP = now;
    }

    public get description(): string | number
    {
        return this._description;
    }

    public set description(description: string | number)
    {
        this._description = description;
    }

    public get print(): boolean
    {
        return this._print;
    }

    public set print(flag: boolean)
    {
        this._print = flag;
    }
}
