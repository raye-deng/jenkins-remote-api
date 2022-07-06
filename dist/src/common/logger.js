"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = require("winston");
class Logger {
    constructor() {
        const customizedFormat = winston.format.printf((args) => {
            return ` [${args.level}]  ${args.timestamp}:  ${args.message}`;
        });
        const format = winston.format.combine(customizedFormat, winston.format.timestamp(), winston.format.colorize({ message: true }));
        this.instance = winston.createLogger({
            level: process.env.NODE_ENV === 'Production' ? 'info' : 'debug', format,
            transports: [
                new winston.transports.Console({ format }),
                new winston.transports.File({ filename: 'log/app.log', level: process.env.NODE_ENV === 'Production' ? 'info' : 'debug', maxsize: 10485760, maxFiles: 7, }),
                new winston.transports.File({ filename: 'log/error.log', level: process.env.NODE_ENV === 'Production' ? 'info' : 'debug', maxsize: 10485760, maxFiles: 7, })
            ]
        });
        if (process.env.DISABLE_ES_LOGGER) {
            return;
        }
    }
    log(message) {
        this.instance.info(message);
    }
    info(message) {
        this.instance.info(message);
    }
    warn(message, ex) {
        this.instance.warn(message);
    }
    debug(message) {
        this.instance.debug(message);
    }
    error(message, error = new Error()) {
        this.instance.error(`${message} ${error ? error.stack : ''}`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map