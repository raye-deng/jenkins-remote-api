"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = __importStar(require("winston"));
class Logger {
    constructor() {
        const customizedFormat = winston.format.printf((args) => {
            return ` [${args.level}]  ${args.timestamp}:  ${args.message}`;
        });
        const format = winston.format.combine(customizedFormat, winston.format.timestamp(), winston.format.colorize({ message: true }));
        this.instance = winston.createLogger({
            level: 'info', format,
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