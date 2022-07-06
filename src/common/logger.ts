import * as winston from 'winston';

export class Logger {
    private readonly instance: winston.Logger;

    public constructor() {
        const customizedFormat = winston.format.printf(
            (args: any) => {
                return ` [${args.level}]  ${args.timestamp}:  ${args.message}`;
            },
        );

        const format = winston.format.combine(customizedFormat, winston.format.timestamp(), winston.format.colorize({message: true}));

        this.instance = winston.createLogger({
            level: 'info', format,
            transports: [
                new winston.transports.Console({format}),
                new winston.transports.File({filename: 'log/app.log', level: process.env.NODE_ENV === 'Production' ? 'info' : 'debug', maxsize: 10485760, maxFiles: 7,}),
                new winston.transports.File({filename: 'log/error.log', level: process.env.NODE_ENV === 'Production' ? 'info' : 'debug', maxsize: 10485760, maxFiles: 7,})]
        });

        if (process.env.DISABLE_ES_LOGGER) {
            return;
        }


    }

    public log(message: string) {
        this.instance.info(message);
    }

    public info(message: string) {

        this.instance.info(message);
    }

    public warn(message: string, ex?: any) {
        this.instance.warn(message);
    }

    public debug(message: string) {
        this.instance.debug(message);
    }

    public error(message: string, error: Error = new Error()) {

        this.instance.error(`${message} ${error ? error.stack : ''}`);
    }
}
