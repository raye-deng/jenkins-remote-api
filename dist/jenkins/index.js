"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const api_client_1 = __importDefault(require("./api-client"));
const computer_1 = __importDefault(require("./computer"));
const logger_1 = require("../common/logger");
const credentials_1 = __importDefault(require("./credentials"));
const job_1 = __importDefault(require("./job"));
const queue_1 = __importDefault(require("./queue"));
const user_1 = __importDefault(require("./user"));
const init = async (url, username, token) => {
    const httpClient = new api_client_1.default(url, username, token);
    await httpClient.init();
    const client = {
        computer: new computer_1.default(httpClient),
        credentials: new credentials_1.default(httpClient),
        queue: new queue_1.default(httpClient),
        job: new job_1.default(httpClient),
        user: new user_1.default(httpClient),
        logger: new logger_1.Logger()
    };
    client.logger.debug(`Jenkins Remote Access API initialed, host: ${url}`);
    return client;
};
exports.init = init;
//# sourceMappingURL=index.js.map