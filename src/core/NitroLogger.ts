import { Format, green, red, white, yellow } from 'cli-color';

export class NitroLogger
{
    public static success(message: any): void
    {
        this.printMessage(message, green);
    }

    public static log(message: any): void
    {
        this.printMessage(message, white);
    }

    public static warn(message: any): void
    {
        this.printMessage(message, yellow);
    }

    public static error(message: any, trace: any = null): void
    {
        this.printMessage(trace ?? message, red);
    }

    private static printMessage(message: any, color: Format = null): void
    {
        process.stdout.write(` ${ color('[Nitro]') } `);
        process.stdout.write(color(message));
        process.stdout.write('\n');
    }
}
