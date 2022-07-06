import { LoggerService } from '@nestjs/common';
export declare class Logger implements LoggerService {
    private readonly instance;
    constructor();
    log(message: string): void;
    info(message: string): void;
    warn(message: string, ex?: any): void;
    debug(message: string): void;
    error(message: string, error?: Error): void;
}
