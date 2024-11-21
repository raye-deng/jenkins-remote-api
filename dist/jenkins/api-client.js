"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../common/logger");
const qs = require('qs');
class APIClient {
    constructor(url, username, apiToken) {
        this.url = url;
        this.username = username;
        this.apiToken = apiToken;
    }
    async init() {
        this.client = axios_1.default.create({
            baseURL: this.url,
            auth: { username: this.username, password: this.apiToken }
        });
        this.logger = new logger_1.Logger();
        this.client.interceptors.request.use((config) => {
            if (config.method === "get" && config.url.indexOf("/api/json") === -1) {
                config.url = `${config.url}/api/json`;
            }
            return config;
        });
        this.client.interceptors.response.use(async (response) => {
            this.logger.debug(`url:${response.config.url} response: ${JSON.stringify(response.data)}`);
            const { status } = response;
            if (status === 201) {
                const location = response === null || response === void 0 ? void 0 : response.headers["location"];
                if (location) {
                    response.config.baseURL = undefined;
                    response.config.url = location;
                    this.logger.info(`re-location to :${location}`);
                    return await this.client.request(response.config);
                }
            }
            return response;
        }, async (error) => {
            var _a, _b, _c, _d, _e;
            const { response, config } = error;
            if ((response === null || response === void 0 ? void 0 : response.status) === 403 || (response === null || response === void 0 ? void 0 : response.status) === 401) {
                await this.getCrumb();
                config.baseURL = undefined;
                config["isRetry"] = true;
                this.logger.warn(`refresh crumb and retrying api :${config.url}`);
                if (config["isRetry"]) {
                    error.message = `${error.message}, request already retry after first time failure.`;
                    return Promise.reject(error);
                }
                return await this.client.request(config);
            }
            if ((response === null || response === void 0 ? void 0 : response.status) === 404 && ((_b = (_a = error === null || error === void 0 ? void 0 : error.request) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.indexOf("/api/json")) === -1) {
                config.url = `${(_c = error === null || error === void 0 ? void 0 : error.request) === null || _c === void 0 ? void 0 : _c.path}${((_e = (_d = error === null || error === void 0 ? void 0 : error.request) === null || _d === void 0 ? void 0 : _d.path) === null || _e === void 0 ? void 0 : _e.endsWith("/")) ? "" : "/"}api/json`;
                config.baseURL = undefined;
                this.logger.info(`get api re-trying fetch json api url:${config.url}`);
                return await this.client.request(config);
            }
            const { data } = response || {};
            let rawErrorMessage;
            if (data && response.headers['content-type'] !== "application/json") {
                const regexp = /(<div id=\"error-description\">(.*?)<\/div>|<h1>Error<\/h1><p>(.*?)<\/div>)/g;
                rawErrorMessage = data.message ? data.message : data.match(regexp);
                rawErrorMessage = rawErrorMessage ? rawErrorMessage[0].replace(/(<([^>]+)>)/ig, " ").replace(/[\r\n]/g, " ") : rawErrorMessage;
            }
            this.logger.error(`api invoke failed,[${config.method}] ${config.url},${data && typeof data == "string" ? data : JSON.stringify(data)}`);
            const stack = new Error().stack;
            error = Object.assign(error, { message: `${error.message} ${rawErrorMessage ? "(html error message:" + rawErrorMessage + ")" : ''}`, stack });
            return Promise.reject(error);
        });
        await this.getCrumb();
    }
    async getCrumb() {
        var _a;
        try {
            let { data, status } = await this.get("/crumbIssuer/api/json");
            if (status === 404) {
                this.logger.warn(`CSRF protection is not enable on the server at the moment.`);
                return;
            }
            if (data && typeof data === "string") {
                data = JSON.parse(data);
            }
            const crumbConfig = {};
            crumbConfig[data["crumbRequestField"]] = data.crumb;
            this.crumb = crumbConfig;
            this.logger.debug(`refresh crumb:${JSON.stringify(this.crumb)}`);
        }
        catch (e) {
            if (((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                this.logger.warn(`CSRF protection is not enable on the server at the moment.`);
                return;
            }
            e.message = "CSRF protection is not enabled on the server at the moment." +
                " Perhaps the client was initialized when the CSRF setting was" +
                " enabled. Please re-initialize the client, also the root cause:\n" + e.message;
            throw e;
        }
    }
    async get(path, options) {
        return this.client.get(path, Object.assign({ headers: this.crumb }, options || {}));
    }
    async post(path, data = {}, options) {
        if (data.json) {
            Object.keys(this.crumb).map(k => data.json[k] = this.crumb[k]);
            data.json = JSON.stringify(data.json);
        }
        data = Object.assign({ Submit: "" }, this.crumb, data);
        if (!data.json) {
            data.json = JSON.stringify(data);
        }
        return this.client.post(path, qs.stringify(data), Object.assign({ headers: this.crumb }, options || { "content-type": "application/x-www-form-urlencoded" }));
    }
    async postConfig(path, data = {}, options) {
        return this.client.post(path, data, Object.assign({ headers: this.crumb }, options || { "content-type": "text/xml" }));
    }
}
exports.default = APIClient;
//# sourceMappingURL=api-client.js.map